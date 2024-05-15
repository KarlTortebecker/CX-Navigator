import React from "react";
import styles from "@styles/Home.module.scss";

const ClienteleComponent = ({ regionStatsData, selectedMarker }) => {
  return (
    <div>
      {/* Affichez les informations agrégées sur les clients pour la région */}
      {regionStatsData && (
        <div>
          <div className={styles.special}>Information clientèle</div>
          <ul className={styles.listtext}>
            <li>Nombre moyen de clients par jour sur les SMS : <b>{regionStatsData.totalClientsSMS}</b></li>
            <li>Nombre moyen de clients par jour sur les appels : <b>{regionStatsData.totalClientsAppels}</b></li>
            <li>Nombre moyen de clients par jour sur les Data : <b>{regionStatsData.totalClientsData}</b></li>
            <br/>
          </ul>
        </div>
      )}

      {/* Affichez les informations sur les clients pour le marqueur sélectionné */}
      {selectedMarker && (
        <div>
          <div className={styles.special}>Information clientèle</div>
          <ul className={styles.listtext}>
            <li>Nombre moyen de clients par jour sur les sms :  <b>{selectedMarker.moy_clients_sms}</b></li>
            <li>Nombre moyen de clients par jour sur la voix :  <b>{selectedMarker.moy_clients_voix}</b></li>
            <li>Nombre moyen de clients par jour sur la data :  <b>{selectedMarker.moy_clients_data}</b></li>
            <br/>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClienteleComponent;
