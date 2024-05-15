import React from "react";
import styles from "@styles/Home.module.scss";

const QoEComponent = ({regionNPSInfo, regionNPS}) => {

     // Fonction pour générer le contenu en fonction de la disponibilité des données
    const generateContent = (info, label) => {
        const isInteger = Number.isInteger(info);
    
        if (isInteger) {
        return <span>{label}: <strong>{info}</strong></span>;
        } else {
        // Sinon, le formater avec 2 chiffres après la virgule
        return info ? <span>{label}: <strong>{info.toFixed(2)}</strong></span> : <span>{label}: <strong>Non disponible</strong></span>
        }
  };


  return (
    <div>
        {regionNPSInfo && (
        <>
            <div className={styles.special}>Informatif NPS</div>
            <p className={styles.listtext}>
                <br />{generateContent(regionNPSInfo.nps, 'NPS ')}
                <br />{generateContent(regionNPSInfo.qualite_couverture_moyenne, 'Perception sur la couverture ')}
                <br />{generateContent(regionNPSInfo.qualite_appels_moyenne, 'Perception sur les appels ')}
                <br />{generateContent(regionNPSInfo.qualite_data_principal_moyenne, 'Perception sur la data ')}
                <br />{generateContent(regionNPSInfo.qualite_service_client_moyenne, 'Perception sur service client ')}
            </p>
        </>
        )}

        {regionNPS && (
            <div className={styles.special}>NPS de la région: {regionNPS}</div>
        )}
      
    </div>
  );
};

export default QoEComponent;