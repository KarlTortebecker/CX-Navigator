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
           <li>QoE SMS moyenne : <b>{regionStatsData.avgSMSQoE}</b></li>
           <li>QoE Voix moyenne : <b>{regionStatsData.avgVoixQoE}</b></li>
           <li>QoE Data moyenne : <b>{regionStatsData.avgDataQoE}</b></li>
           <li>Drop_call moyen : <b>{regionStatsData.avgDropQoE}</b></li>
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
            <p className={styles.listtext}>{analyseQoE("sms", selectedMarker.averageSms, 92.0).verdict}</p>
            
            <b className={styles.listtext}>Sur la QoE Voix</b>
            <p className={styles.listtext}>{analyseQoE("voix", selectedMarker.averageVoix, 92.0).verdict}</p>
            
            <b className={styles.listtext}>Sur la QoE Data</b>
            <p className={styles.listtext}>{analyseQoE("data", selectedMarker.averageData, 92.0).verdict}</p>
            

            <div className={styles.LineChart} ><LineChart data={data}></LineChart></div>
        </>
      )}
     
          <br/>
    </div>
  );
};

export default QoEComponent;