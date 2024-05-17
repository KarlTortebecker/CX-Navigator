"use client"
import React, { useState, useEffect } from "react";
import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Sidebar from "@components/Sidebar";
import Map from "@components/Map";
import SearchBar from "@components/SearchBar";
import DateRangeComp from "@components/DateRangeComp";

import styles from "@styles/Home.module.scss";

import data from "./data/markers.json";
import regions from "./data/regions.json";
import departements from "./data/departements.json";
import arrondissements from "./data/arrondissements.json";
import cameroun from "./data/cameroun.json";
import npsData from "./data/NPS_MARS.json"; 

import QoEComponent from "@components/Layers/QoEComponent";
import NPSComponent from "@components/Layers/NPSComponent";
import ClienteleComponent from "@components/Layers/ClienteleComponent";

const DEFAULT_CENTER = [7.37, 12.35];
const views = ["Pays", "Régions", "Départements", "Arrondissements", "Sites"];
const layers = ["NPS", "Clientèle"];

// Fonction pour récupérer le NPS d'une région
const getRegionNPS = (regionName, npsData) => {
  const regionNPS = npsData.find((item) => item.region.toLowerCase() === regionName.toLowerCase());
  return regionNPS ? regionNPS : null;
};

const customData = {
  labels: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  datasets: [
    {
      label: 'Data',
      data: [75, 82, 68, 90, 85, 78, 88],
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.4)'
    },
    {
      label: 'Voix',
      data: [90, 85, 80, 75, 70, 78, 85],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.4)'
    },
    {
      label: 'SMS',
      data: [85, 90, 95, 100, 85, 93, 88],
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.4)'
    }
  ]
};

const initialDataState = {
  markers: [],
  regionData: [],
  departementData: [],
  arrondissementData: [],
  countryData: [],
  npsData: [],
};

export default function Home() {
  const [dataState, setDataState] = useState(initialDataState);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState(views[0]);
  const [selectedMarker, setSelectedMarker] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [regionNPS, setRegionNPS] = useState();
  const [regionInfo, setRegionInfo] = useState(null);
  const [regionNPSInfo, setRegionNPSInfo] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState([]);


  // To fetch data from the sources
  useEffect(() => {
    
    // Effet de nettoyage pour réinitialiser regionInfo et regionNPSInfo lorsque la sidebar est fermée
    if (!isSidebarOpen) {
      setRegionInfo(null);
      setRegionNPSInfo(null);
    }

    fetchData();
  }, [isSidebarOpen]);

  const fetchData = async () => {
    try {
      setDataState({
        markers: data,
        regionData: regions,
        departementData: departements,
        arrondissementData: arrondissements,
        countryData: cameroun,
        npsData: npsData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Filter markers based on searchQuery
  const filteredMarkers = dataState.markers.filter(
    (marker) =>
      marker.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.localite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour mettre à jour la plage de dates sélectionnée
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  const calculateRegionStats = (sites) => {
    const regionStats = {};
  
    sites.forEach((site) => {
      const region = site.region;
  
      if (!regionStats[region]) {
        regionStats[region] = {
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
  
      // Correction ici: Utiliser totalClientsData pour incrémenter la valeur de site.moy_clients_data
      regionStats[region].totalClientsSMS += site.moy_clients_sms;
      regionStats[region].totalClientsAppels += site.moy_clients_voix;
      regionStats[region].totalClientsData += site.moy_clients_data; // Correction ici: Utiliser totalClientsData
      regionStats[region].totalSMSQoE += site.sms;
      regionStats[region].totalVoixQoE += site.voix;
      regionStats[region].totalDataQoE += site.data;
      regionStats[region].totalDropQoE += site.drop_call;
      regionStats[region].totalSites++;
    });
  
    // Calculer les moyennes par région
    Object.keys(regionStats).forEach((region) => {
      regionStats[region].avgSMSQoE = regionStats[region].totalSMSQoE / regionStats[region].totalSites;
      regionStats[region].avgVoixQoE = regionStats[region].totalVoixQoE / regionStats[region].totalSites;
      regionStats[region].avgDropQoE = regionStats[region].totalDropQoE / regionStats[region].totalSites;
      regionStats[region].avgDataQoE = regionStats[region].totalDataQoE / regionStats[region].totalSites;
    });

    return regionStats;
  };
  
  const regionStats = calculateRegionStats(dataState.markers);


  const handleMarkerDoubleClick = (marker) => {
    setIsSidebarOpen(true);
    setSelectedMarker(marker);
    const regionName = marker.region;  // Fetch and set region NPS value when sidebar is opened for a site
    const regionNPSValue = getRegionNPS(regionName, dataState.npsData);
    setRegionNPS(regionNPSValue.nps);
  };

  // Fonction pour gérer le double clic sur une région
  const handleRegionDoubleClick = (regionInfo) => {
    const regionNPSInfo = getRegionNPS(regionInfo.Région, dataState.npsData);
    setRegionInfo(regionInfo);
    setRegionNPSInfo(regionNPSInfo);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSelectedMarker(null);
    setIsSidebarOpen(false);
    setRegionNPS(null); // Reset region NPS when sidebar is closed
  };

  // Fonction pour gérer le changement de vue
  const handleChangeView = (event) => {
    setSelectedView(event.target.value);
  };

  // Fonction pour gérer le changement d'une couche sélectionnée
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

  
  
  // Fonction pour rendre la barre latérale en fonction de la vue sélectionnée
const renderSidebar = () => {
  if (selectedView === "Sites" && isSidebarOpen && selectedMarker) {
    return (
      <Sidebar isOpen={true} onClose={handleCloseSidebar}>
        <h2 className={styles.code}>Site de {selectedMarker.nom}</h2>
        <div className={styles.special}>Détails du site</div>
        <ul className={styles.listtext}>
            <li>Localité :  <b>{selectedMarker.localite}</b></li>
            <li>Type de zone : <b>{selectedMarker.zone_pmo}</b></li>
            <li>Région : <b>{selectedMarker.region}</b></li>
            <li>Département : <b>{selectedMarker.departement}</b></li>
            <li>Arrondissement : <b>{selectedMarker.arrondissement}</b></li>
            <li>QoE data : <b>{selectedMarker.data.toFixed(2)}</b></li>
            <li>QoE sms : <b>{selectedMarker.sms.toFixed(2)}</b></li>
            <li>QoE voix : <b>{selectedMarker.voix.toFixed(2)}</b></li>
            <li>Taux de dropcall : <b>{selectedMarker.drop_call.toFixed(5)}</b></li>
        </ul>
        <DateRangeComp onChange={handleDateRangeChange}/>
        <QoEComponent selectedMarker={selectedMarker} data={customData}></QoEComponent>
        
        {selectedLayers.includes("NPS") && (
          <NPSComponent regionNPS={regionNPS}></NPSComponent>
        )}
        {selectedLayers.includes("Clientèle") && (
          <ClienteleComponent selectedMarker={selectedMarker}></ClienteleComponent>
        )}
        <br/>
      </Sidebar>
    );
  } else if (selectedView === "Régions" && isSidebarOpen && regionInfo) {
    const regionStatsData = regionStats[regionInfo.Région.toUpperCase()] ?? { avgSMSQoE: NaN, avgVoixQoE: NaN, avgDataQoE: NaN, avgDropQoE: NaN }; 
    return (
      <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)}>
        <h2 className={styles.code}>Region : {regionInfo.Région}</h2>
        <DateRangeComp />
          <QoEComponent regionStatsData={regionStatsData}></QoEComponent>
        {selectedLayers.includes("NPS") && (
          <NPSComponent regionNPSInfo={regionNPSInfo}></NPSComponent>
        )}
        {selectedLayers.includes("Clientèle") && (
          <ClienteleComponent regionStatsData={regionStatsData}></ClienteleComponent>
        )}
        <br/>
      </Sidebar>
    );
  } else {
    return null; // Ne rien rendre si la vue actuelle ne nécessite pas de barre latérale ou si la barre latérale est fermée
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

          {/* Appel de la fonction renderSidebar pour afficher la barre latérale */}
          {renderSidebar()}

          {/* Afficher la carte en fonction de la vue sélectionnée */}
          <div className={styles.map}>
          {selectedView === "Sites" && (
              // Afficher les sites sur la carte
              <Map
              className={styles.homeMap}
              width="1000"
              height="800"
              center={DEFAULT_CENTER}
              zoom={6}
              minZoom={6}
              maxZoom={13}
            >
            
              {({ TileLayer, Marker, Popup }) => (
                <>
                  <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

                  {/* Afficher les marqueurs filtrés */}
                  {filteredMarkers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={[marker.latitude, marker.longitude]}
                      eventHandlers={{ dblclick: () => {
                       handleMarkerDoubleClick(marker);
                      }}}
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
                        {marker.data}
                        <br />
                        <b>Zone PMO : </b>
                        {marker.zone_pmo}
                        <br />
                        <b>Coordonnées : </b>
                        {marker.longitude} -- {marker.latitude}
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
              {/* Contenu de la carte pour la vue "Régions" */}
              {({ TileLayer, GeoJSON }) => (
                <>
                  <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                  {/* Afficher les entités géographiques */}
                  <GeoJSON
                    data={dataState.regionData}
                    onEachFeature={(feature, layer) => {
                      layer.on('mouseover', (e) => {
                        const regionInfo = feature.properties; // Récupérer les informations de la région
                        const popupContent = generatePopupContent(regionInfo); // Générer le contenu du popup
                        
                        // Associer le contenu du popup à la couche géographique et l'afficher
                        layer.bindPopup(popupContent).openPopup(e.latlng);
                      });
                      layer.on('mouseout', (e) => {
                        // Fermer le popup lorsque la souris quitte l'entité géographique
                        layer.closePopup();
                      });
                      layer.on('click', (e) => {
                        const regionInfo = feature.properties; // Récupérer les informations de la région
                        const regionNPSInfo = getRegionNPS(regionInfo.Région, npsData); // Récupérer les informations sur le NPS de la région
                        handleRegionDoubleClick(regionInfo, regionNPSInfo); // Utilisez handleRegionDoubleClick
                        // Affichez la barre latérale en passant regionInfo et regionNPSInfo
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
                {/* Contenu de la carte pour la vue "Pays" */}
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    {/* Afficher les entités géographiques */}
                    <GeoJSON
                      data={dataState.countryData}
                      onEachFeature={(feature, layer) => {
                        layer.on('click', (e) => {
                          const countryInfo = feature.properties; // Récupérer les informations de la région
                          layer.bindPopup(`<b> Pays : ${countryInfo.Pays}</b>`); // Afficher les informations dans le popup
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
                {/* Contenu de la carte pour la vue "Département" */}
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    {/* Afficher les entités géographiques */}
                    <GeoJSON
                      data={dataState.departementData}
                      onEachFeature={(feature, layer) => {
                        layer.on('click', (e) => {
                          const departementInfo = feature.properties; // Récupérer les informations de la région
                          layer.bindPopup(`<b> Département : ${departementInfo.Département}</b>`); // Afficher les informations dans le popup
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
                {/* Contenu de la carte pour la vue "Arrondissement" */}
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    {/* Afficher les entités géographiques */}
                    <GeoJSON
                      data={dataState.arrondissementData}
                      onEachFeature={(feature, layer) => {
                        layer.on('click', (e) => {
                          const arrondissementInfo = feature.properties; // Récupérer les informations de l'arrondissement
                          layer.bindPopup(`<b> Arrondissement : ${arrondissementInfo.Arrondissement}</b>`); // Afficher les informations dans le popup
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
