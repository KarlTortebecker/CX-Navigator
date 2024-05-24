import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import addDays from 'date-fns/addDays';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import styles from './DateRangeComp.module.scss';
import QoEComponent from "@components/Layers/QoEComponent";
import { debounce } from 'lodash';

const DateRangeComp = ({ data, onChange, site, sites, region }) => {
  const formatDate = useCallback((date) => format(date, 'dd/MM/yyyy'), []);
  const parseDate = useCallback((dateStr) => parse(dateStr, 'dd/MM/yyyy', new Date()), []);

  const findMostRecentDate = useCallback((filteredData) => {
    if (filteredData.length === 0) {
      return new Date();
    }
    return new Date(Math.max(...filteredData.map(item => parseDate(item.date).getTime())));
  }, [parseDate]);

  const initializeRange = (filteredData) => {
    const defaultEndDate = findMostRecentDate(filteredData);
    const defaultStartDate = addDays(defaultEndDate, -7);

    return [{
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      key: 'selection',
    }];
  };

  const [range, setRange] = useState(() => initializeRange(data));
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);
  const [metrics, setMetrics] = useState({
    averageVoix: 0,
    averageData: 0,
    averageSms: 0,
    averageWeb: 0,
    averageVoip: 0,
    averageDownload: 0,
    averageStreaming: 0,
    averageDropcall: 0,
    totalClientsVoix: 0
  });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (refOne.current && !refOne.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape, true);
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('keydown', handleEscape, true);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const sumMetrics = (filteredData, key) => filteredData.reduce((sum, item) => {
    const value = parseFloat(item[key]);
    return isNaN(value) ? sum : sum + value;
  }, 0);

  const average = (total, count, order = 2) => (total / count).toFixed(order);

  const calculateMetrics = useCallback((filteredData) => {
    if (filteredData.length === 0) {
      setMetrics({
        averageVoix: 0,
        averageData: 0,
        averageSms: 0,
        averageWeb: 0,
        averageVoip: 0,
        averageDownload: 0,
        averageStreaming: 0,
        averageDropcall: 0,
        totalClientsVoix: 0
      });
      return;
    }

    const totalVoix = sumMetrics(filteredData, 'voix');
    const totalSms = sumMetrics(filteredData, 'sms');
    const totalWeb = sumMetrics(filteredData, 'web');
    const totalData = sumMetrics(filteredData, 'data');
    const totalDownload = sumMetrics(filteredData, 'download');
    const totalVoip = sumMetrics(filteredData, 'voip');
    const totalDropcall = sumMetrics(filteredData, 'drop_call');
    const totalStreaming = sumMetrics(filteredData, 'streaming');
    const totalClientsVoix = filteredData.reduce((sum, item) => sum + (item.moy_clients_voix || 0), 0);

    const filteredLength = filteredData.length;
    setMetrics({
      averageVoix: average(totalVoix, filteredLength),
      averageData: average(totalData, filteredLength),
      averageSms: average(totalSms, filteredLength),
      averageWeb: average(totalWeb, filteredLength),
      averageVoip: average(totalVoip, filteredLength),
      averageDropcall: average(totalDropcall, filteredLength, 5),
      averageDownload: average(totalDownload, filteredLength),
      averageStreaming: average(totalStreaming, filteredLength),
      totalClientsVoix
    });
  }, []);

  const handleRangeChange = useCallback((item) => {
    setRange([item.selection]);
    onChange(item.selection);

    const { startDate, endDate } = item.selection;
    let filteredData = [];

    if (site) {
      filteredData = data.filter((item) => {
        const date = parseDate(item.date);
        return item.site === site && date >= startDate && date <= endDate;
      });
    } else if (sites && region) {
      const dataByRegion = data.filter((item) => {
        const siteData = sites.find(site => site.nom === item.site);
        return siteData && siteData.region === region.toUpperCase();
      });

      filteredData = dataByRegion.filter((item) => {
        const date = parseDate(item.date);
        return date >= startDate && date <= endDate;
      });
    }

    calculateMetrics(filteredData);
  }, [onChange, calculateMetrics, site, data, sites, region, parseDate]);

  useEffect(() => {
    // Calculate metrics for the initial range
    const { startDate, endDate } = range[0];
    let filteredData = [];

    if (site) {
      filteredData = data.filter((item) => {
        const date = parseDate(item.date);
        return item.site === site && date >= startDate && date <= endDate;
      });
    } else if (sites && region) {
      const dataByRegion = data.filter((item) => {
        const siteData = sites.find(site => site.nom === item.site);
        return siteData && siteData.region === region.toUpperCase();
      });

      filteredData = dataByRegion.filter((item) => {
        const date = parseDate(item.date);
        return date >= startDate && date <= endDate;
      });
    }

    calculateMetrics(filteredData);
  }, [range, site, data, sites, region, parseDate, calculateMetrics]);

  const minDate = useMemo(() => new Date(Math.min(...data.map(item => parseDate(item.date).getTime()))), [data, parseDate]);
  const maxDate = useMemo(() => new Date(Math.max(...data.map(item => parseDate(item.date).getTime()))), [data, parseDate]);

  return (
    <div className="calendarWrap">
      <input
        value={`${formatDate(range[0].startDate)} to ${formatDate(range[0].endDate)}`}
        readOnly
        className={styles.inputBox}
        onClick={() => setOpen(prevOpen => !prevOpen)}
      />

      <div ref={refOne}>
        {open && (
          <DateRange
            onChange={handleRangeChange}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
            className="calendarElement"
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </div>
      <br/>

      <div className="metricsDisplay">
        <ul className={styles.listtext}>
          <li>QoE sms : <b>{metrics.averageSms}</b></li>
          <li>QoE voix : <b>{metrics.averageVoix}</b></li>
          <li>QoE data : <b>{metrics.averageData}</b></li>
          <ul>
            <li>QoE web : <b>{metrics.averageWeb}</b></li>
            <li>QoE voip : <b>{metrics.averageVoip}</b></li>
            <li>QoE streaming : <b>{metrics.averageStreaming}</b></li>
            <li>QoE download : <b>{metrics.averageDownload}</b></li>
          </ul>
          <li>Drop_call : <b>{metrics.averageDropcall}</b></li>
        </ul>
        <QoEComponent selectedMarker={metrics}></QoEComponent>
      </div>
    </div>
  );
};

export default DateRangeComp;
