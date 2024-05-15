import React from "react";
import styles from "@styles/Home.module.scss";
import LineChart from "@components/LineChart";

import { analyseQoE } from "../../pages/utils/qoeAnalyser";

const QoEComponent = ({regionStatsData, selectedMarker, data}) => {
  return (
    <div>
      { regionStatsData && (
        <>
         <div className={styles.special}>Statistiques QoE régionales</div>
         <ul className={styles.listtext}>
           <li>QoE SMS moyenne : <b>{regionStatsData.avgSMSQoE.toFixed(2)}</b></li>
           <li>QoE Voix moyenne : <b>{regionStatsData.avgVoixQoE.toFixed(2)}</b></li>
           <li>QoE Data moyenne : <b>{regionStatsData.avgDataQoE.toFixed(2)}</b></li>
           <li>QoE Drop_call moyen : <b>{regionStatsData.avgDropQoE.toFixed(5)}</b></li>
         </ul>
         <div className={styles.special}>Explicatif QoE</div>
             <b className={styles.listtext}>Sur la QoE SMS</b>
             <p className={styles.listtext}>{analyseQoE("sms", regionStatsData.avgSMSQoE, 92.0).verdict}</p>
             
             <b className={styles.listtext}>Sur la QoE Voix</b>
             <p className={styles.listtext}>{analyseQoE("voix", regionStatsData.avgVoixQoE, 92.0).verdict}</p>
             
             <b className={styles.listtext}>Sur la QoE Data</b>
             <p className={styles.listtext}>{analyseQoE("data", regionStatsData.avgDataQoE, 92.0).verdict}</p>
             
 
           <LineChart></LineChart>
        </>
      )}

      { selectedMarker && (
        <>
            <div className={styles.special}>Explicatif QoE</div>
            <b className={styles.listtext}>Sur la QoE SMS</b>
            <p className={styles.listtext}>{analyseQoE("sms", selectedMarker.sms, 92.0).verdict}</p>
            
            <b className={styles.listtext}>Sur la QoE Voix</b>
            <p className={styles.listtext}>{analyseQoE("voix", selectedMarker.voix, 92.0).verdict}</p>
            
            <b className={styles.listtext}>Sur la QoE Data</b>
            <p className={styles.listtext}>{analyseQoE("data", selectedMarker.data, 92.0).verdict}</p>
            

            <div className={styles.LineChart} ><LineChart data={data}></LineChart></div>
        </>
      )}
     
          <br/>
    </div>
  );
};

export default QoEComponent;