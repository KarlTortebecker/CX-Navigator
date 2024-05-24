import React, { useState, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";
import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Sidebar from "@components/Sidebar";
import Map from "@components/Map";
import SearchBar from "@components/SearchBar";
import DateRangeComp from "@components/DateRangeComp";
import styles from "@styles/Home.module.scss";
import sites from "./data/echantillons_sites.json";
import regions from "./data/regions.json";
import departements from "./data/departements.json";
import arrondissements from "./data/arrondissements.json";
import cameroun from "./data/cameroun.json";
import npsData from "./data/NPS_MARS.json";
import qoeData from "./data/qoE sites 1-15 Mai.json";
import NPSComponent from "@components/Layers/NPSComponent";
import ClienteleComponent from "@components/Layers/ClienteleComponent";

const DEFAULT_CENTER = [7.37, 12.35];
const views = ["Pays", "Régions", "Départements", "Arrondissements", "Sites"];
const layers = ["NPS", "Clientèle"];

const getRegionNPS = (regionName, npsData) => {
  const regionNPS = npsData.find((item) => item.region.toLowerCase() === regionName.toLowerCase());
  return regionNPS ? regionNPS : null;
};

const initialDataState = {
  siteData: [],
  regionData: [],
  departementData: [],
  arrondissementData: [],
  countryData: [],
  npsData: [],
  qoeData: [],
};

export default function Home() {
  const [dataState, setDataState] = useState(initialDataState);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState(views[0]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [regionNPS, setRegionNPS] = useState(null);
  const [regionInfo, setRegionInfo] = useState(null);
  const [regionNPSInfo, setRegionNPSInfo] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState([]);

  const fetchData = useCallback(async () => {
    setDataState({
      siteData: sites,
      regionData: regions,
      departementData: departements,
      arrondissementData: arrondissements,
      countryData: cameroun,
      npsData: npsData,
      qoeData: qoeData,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredMarkers = useMemo(
    () =>
      dataState.siteData.filter(
        (site) =>
          site.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.localite.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.region.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [dataState.siteData, searchQuery]
  );

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  const calculateRegionStats = (sites, qoeData) => {
    const regionStats = {};

    qoeData.forEach((qoe) => {
      const siteName = qoe.site;
      const site = sites.find((s) => s.nom === siteName);

      if (site) {
        const region = site.region;
        const date = qoe.date;

        if (!regionStats[region]) {
          regionStats[region] = {};
        }

        if (!regionStats[region][date]) {
          regionStats[region][date] = {
            totalClientsSMS: 0,
            totalClientsAppels: 0,
            totalClientsData: 0,
            totalSMSQoE: 0,
            totalVoixQoE: 0,
            totalDataQoE: 0,
            totalDropQoE: 0,
            totalSites: 0,
          };
        }

        const stats = regionStats[region][date];
        stats.totalClientsSMS += Number(qoe.moy_clients_sms);
        stats.totalClientsAppels += Number(qoe.moy_clients_voix);
        stats.totalClientsData += Number(qoe.moy_clients_data);
        stats.totalSMSQoE += Number(qoe.sms);
        stats.totalVoixQoE += Number(qoe.voix);
        stats.totalDataQoE += Number(qoe.data);
        stats.totalDropQoE += Number(qoe.drop_call);
        stats.totalSites++;
      }
    });

    Object.keys(regionStats).forEach((region) => {
      Object.keys(regionStats[region]).forEach((date) => {
        const stats = regionStats[region][date];
        stats.avgSMSQoE = stats.totalSMSQoE / stats.totalSites;
        stats.avgVoixQoE = stats.totalVoixQoE / stats.totalSites;
        stats.avgDropQoE = stats.totalDropQoE / stats.totalSites;
        stats.avgDataQoE = stats.totalDataQoE / stats.totalSites;
      });
    });

    return regionStats;
  };

  const getSiteStats = (siteName, qoeData) => {
    const siteData = qoeData.filter((data) => data.site?.toLowerCase() === siteName.toLowerCase());

    if (siteData.length === 0) {
      return null;
    }

    const latestDate = siteData.reduce((latest, data) => (data.date > latest ? data.date : latest), siteData[0].date);

    const latestSiteData = siteData.find((data) => data.date === latestDate);

    return {
      data: latestSiteData.data,
      sms: latestSiteData.sms,
      voix: latestSiteData.voix,
      drop_call: latestSiteData.drop_call,
      web: latestSiteData.web,
      download: latestSiteData.download,
      streaming: latestSiteData.streaming,
      voip: latestSiteData.voip,
      moy_clients_voix: latestSiteData.moy_clients_voix,
      moy_clients_sms: latestSiteData.moy_clients_sms,
      moy_clients_data: latestSiteData.moy_clients_data,
    };
  };

  const handleMarkerDoubleClick = (marker) => {
    setIsSidebarOpen(true);
    setSelectedMarker(marker);
    const regionName = marker.region;
    const regionNPSValue = getRegionNPS(regionName, dataState.npsData);
    setRegionNPS(regionNPSValue ? regionNPSValue.nps : null);
  };

  const handleRegionDoubleClick = (regionInfo) => {
    const regionNPSInfo = getRegionNPS(regionInfo.Région, dataState.npsData);
    setRegionInfo(regionInfo);
    setRegionNPSInfo(regionNPSInfo);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSelectedMarker(null);
    setIsSidebarOpen(false);
    setRegionNPS(null);
  };

  const handleChangeView = (event) => {
    setSelectedView(event.target.value);
  };

  const handleLayerChange = (layer) => {
    if (selectedLayers.includes(layer)) {
      setSelectedLayers(selectedLayers.filter((l) => l !== layer));
    } else {
      setSelectedLayers([...selectedLayers, layer]);
    }
  };

  const generatePopupContent = (regionInfo) => {
    return `
      <div>
        <h3>${regionInfo.Région}</h3>
        <p>Superficie : ${regionInfo.Superficie}
        <br>NPS Score : <b>${getRegionNPS(regionInfo.Région, dataState.npsData).nps}</b>
        <br/>Mesure réalisée au mois de <b>Mars</b></p>
      </div>
    `;
  };

  const renderSidebar = () => {
    if (selectedView === "Sites" && isSidebarOpen && selectedMarker) {
      const qoeData = getSiteStats(selectedMarker.nom, dataState.qoeData);
      return (
        <Sidebar isOpen={true} onClose={handleCloseSidebar}>
          <h2 className={styles.code}>Site de {selectedMarker.nom}</h2>
          <div className={styles.special}>Détails du site</div>
          <ul className={styles.listtext}>
            <li>Localité : <b>{selectedMarker.localite}</b></li>
            <li>Type de zone : <b>{selectedMarker.type_zone}</b></li>
            <li>Code du site : <b>{selectedMarker.code}</b></li>
            <li>Zone PMO : <b>{selectedMarker.zone_pmo}</b></li>
            <li>Région : <b>{selectedMarker.region}</b></li>
            <li>Département : <b>{selectedMarker.departement}</b></li>
            <li>Arrondissement : <b>{selectedMarker.arrondissement}</b></li>
          </ul>
          <DateRangeComp data={dataState.qoeData} onChange={handleDateRangeChange} site={selectedMarker.nom} />
          {selectedLayers.includes("NPS") && <NPSComponent regionNPS={regionNPS}></NPSComponent>}
          {selectedLayers.includes("Clientèle") && <ClienteleComponent selectedMarker={qoeData}></ClienteleComponent>}
          <br />
        </Sidebar>
      );
    } else if (selectedView === "Régions" && isSidebarOpen && regionInfo) {
      const regionStatsData =
        calculateRegionStats(dataState.siteData, dataState.qoeData)[regionInfo.Région.toUpperCase()] ?? {
          avgSMSQoE: NaN,
          avgVoixQoE: NaN,
          avgDataQoE: NaN,
          avgDropQoE: NaN,
        };
      return (
        <Sidebar isOpen={true} onClose={handleCloseSidebar}>
          <h2 className={styles.code}>Region : {regionInfo.Région}</h2>
          <DateRangeComp data={dataState.qoeData} onChange={handleDateRangeChange} sites={dataState.siteData} region={regionInfo.Région} />
          {selectedLayers.includes("NPS") && <NPSComponent regionNPSInfo={regionNPSInfo}></NPSComponent>}
          {selectedLayers.includes("Clientèle") && <ClienteleComponent regionStatsData={regionStatsData}></ClienteleComponent>}
          <br />
        </Sidebar>
      );
    } else {
      return null;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Le CX Navigator</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet for QoE" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <SearchBar setSearchQuery={setSearchQuery} />

            <div>
              {layers.map((layer) => (
                <label key={layer} style={{ marginRight: "10px" }}>
                  <input
                    type="checkbox"
                    value={layer}
                    checked={selectedLayers.includes(layer)}
                    onChange={() => handleLayerChange(layer)}
                  />
                  {layer}
                </label>
              ))}
            </div>

            <div>
              <select
                value={selectedView}
                onChange={handleChangeView}
                style={{ border: "3px solid #d1d5db", borderRadius: "6px" }}
              >
                {views.map((view) => (
                  <option key={view} value={view}>
                    {view}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {renderSidebar()}

          <div className={styles.map}>
            {selectedView === "Sites" && (
              <Map
                className={styles.homeMap}
                width="1000"
                height="800"
                center={DEFAULT_CENTER}
                zoom={6}
                minZoom={6}
              >
                {({ TileLayer, Marker, Popup }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    {filteredMarkers.map((marker, index) => (
                      <Marker
                        key={index}
                        position={[marker.coords[0], marker.coords[1]]}
                        eventHandlers={{ dblclick: () => handleMarkerDoubleClick(marker) }}
                      >
                        <Popup>
                          <b>Nom du site :</b> {marker.nom} <br />
                          <b>Localité : </b>
                          {marker.localite} <br />
                          <b>Code du site : </b>
                          {marker.code}
                          <br />
                          <b>Type de zone : </b>
                          {marker.type_zone}
                          <br />
                          <b>QoE data : </b>
                          {parseFloat(getSiteStats(marker.nom, dataState.qoeData)?.data).toFixed(2) || "N/A"}
                          <br />
                          <b>Zone PMO : </b>
                          {marker.zone_pmo}
                          <br />
                          <b>Coordonnées : </b>
                          {marker.coords[1]} -- {marker.coords[0]}
                        </Popup>
                      </Marker>
                    ))}
                  </>
                )}
              </Map>
            )}
            {selectedView === "Régions" && (
              <Map
                className={styles.homeMap}
                width="1000"
                height="800"
                center={DEFAULT_CENTER}
                zoom={6}
                minZoom={5}
                maxZoom={8}
                geojsonData={dataState.regionData}
              >
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    <GeoJSON
                      data={dataState.regionData}
                      onEachFeature={(feature, layer) => {
                        layer.on("mouseover", (e) => {
                          const regionInfo = feature.properties;
                          const popupContent = generatePopupContent(regionInfo);
                          layer.bindPopup(popupContent).openPopup(e.latlng);
                        });
                        layer.on("mouseout", (e) => {
                          layer.closePopup();
                        });
                        layer.on("click", (e) => {
                          const regionInfo = feature.properties;
                          const regionNPSInfo = getRegionNPS(regionInfo.Région, npsData);
                          handleRegionDoubleClick(regionInfo, regionNPSInfo);
                          layer.bindPopup(renderSidebar(regionInfo, regionNPSInfo));
                        });
                      }}
                    />
                  </>
                )}
              </Map>
            )}
            {selectedView === "Pays" && (
              <Map
                className={styles.homeMap}
                width="1000"
                height="800"
                center={DEFAULT_CENTER}
                zoom={6}
                minZoom={5}
                maxZoom={8}
                geojsonData={dataState.countryData}
              >
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    <GeoJSON
                      data={dataState.countryData}
                      onEachFeature={(feature, layer) => {
                        layer.on("click", (e) => {
                          const countryInfo = feature.properties;
                          layer.bindPopup(<b> Pays : ${countryInfo.Pays}</b>);
                        });
                      }}
                    />
                  </>
                )}
              </Map>
            )}
            {selectedView === "Départements" && (
              <Map
                className={styles.homeMap}
                width="1000"
                height="800"
                center={DEFAULT_CENTER}
                zoom={6}
                minZoom={5}
                maxZoom={8}
                geojsonData={dataState.departementData}
              >
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    <GeoJSON
                      data={dataState.departementData}
                      onEachFeature={(feature, layer) => {
                        layer.on("click", (e) => {
                          const departementInfo = feature.properties;
                          layer.bindPopup(<b> Département : ${departementInfo.Département}</b>);
                        });
                      }}
                    />
                  </>
                )}
              </Map>
            )}
            {selectedView === "Arrondissements" && (
              <Map
                className={styles.homeMap}
                width="1000"
                height="800"
                center={DEFAULT_CENTER}
                zoom={6}
                minZoom={5}
                maxZoom={8}
                geojsonData={dataState.departementData}
              >
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    <GeoJSON
                      data={dataState.arrondissementData}
                      onEachFeature={(feature, layer) => {
                        layer.on("click", (e) => {
                          const arrondissementInfo = feature.properties;
                          layer.bindPopup(<b> Arrondissement : ${arrondissementInfo.Arrondissement}</b>);
                        });
                      }}
                    />
                  </>
                )}
              </Map>
            )}
          </div>

          <p className={styles.description}>
            <code className={styles.code}>
              Premiers résultats de l'affichage des sites sur la carte
            </code>
          </p>
        </Container>
      </Section>
    </Layout>
  );
}
