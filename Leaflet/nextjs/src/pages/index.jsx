import { useState, useEffect } from "react";
import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Sidebar from "@components/Sidebar";
import Map from "@components/Map";
import SearchBar from "@components/SearchBar";
import LineChart from "@components/LineChart";

import styles from "@styles/Home.module.scss";

import data from "./data/markers.json";
import regions from "./data/regions.json";
import departements from './data/departements.json';
import arrondissements from "./data/arrondissements.json";
import cameroun from "./data/cameroun.json";
import npsData from "./data/NPS_MARS.json"; // Import NPS data


import { analyseQoE } from "./utils/qoeAnalyser";

const DEFAULT_CENTER = [7.37, 12.35];
const views = ["Pays", "Régions", "Départements", "Arrondissements", "Sites"];

// Fonction pour récupérer le NPS d'une région
const getRegionNPS = (regionName, npsData) => {
  const regionNPS = npsData.find((item) => item.region.toLowerCase() === regionName.toLowerCase());
  return regionNPS ? regionNPS : null;
};

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [departementData, setDepartementData] = useState([]);
  const [nps, setNps] = useState([]);
  const [arrondissementData, setArrondissementData] = useState([]);
  const [selectedView, setSelectedView] = useState(views[0]);
  const [selectedMarker, setSelectedMarker] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [regionNPS, setRegionNPS] = useState(); // State to hold region NPS valuemeasurement


  useEffect(() => {
    const fetchData = async () => {
      try {
        setMarkers(data);
        setRegionData(regions);
        setArrondissementData(arrondissements);
        setCountryData(cameroun);
        setDepartementData(departements);
        setNps(npsData);
    
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter markers based on searchQuery
  const filteredMarkers = markers.filter(
    (marker) =>
      marker.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.localite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkerDoubleClick = (marker) => {
    setIsSidebarOpen(true);
    setSelectedMarker(marker);
  
    // Fetch and set region NPS value when sidebar is opened for a site
    const regionName = marker.region;
    const regionNPSValue = getRegionNPS(regionName, npsData);
    setRegionNPS(regionNPSValue.nps);
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

  // Fonction pour générer le contenu en fonction de la disponibilité des données
  const generateContent = (info, label) => {
    const isInteger = Number.isInteger(info);
  
    if (isInteger) {
      return `${label}: ${info}`;
    } else {
      // Sinon, le formater avec 2 chiffres après la virgule
      return info ? `${label}: ${info.toFixed(2)}` : `${label}: Non disponible`;
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

          {isSidebarOpen && selectedMarker && (
            <Sidebar isOpen={true} onClose={handleCloseSidebar}>
              <h2 className={styles.code}>Site de {selectedMarker.nom}</h2>
              <div className={styles.special}>Détails du site</div>
              <ul className={styles.listtext}>
                  <li>Localité :  {selectedMarker.localite}</li>
                  <li>Type de zone : {selectedMarker.zonepmo}</li>
                  <li>Région : {selectedMarker.region}</li>
                  <li>Département : {selectedMarker.departement}</li>
                  <li>Arrondissement : {selectedMarker.arrondissement}</li>
                  <li>QoE data : {selectedMarker.data.toFixed(3)}</li>
                  <li>QoE sms : {selectedMarker.sms.toFixed(3)}</li>
                  <li>QoE voix : {selectedMarker.voix.toFixed(3)}</li>
                  <li>Taux de dropcall : {selectedMarker.drop_call.toFixed(3)}</li>
              </ul>

              {/* Display region NPS in sidebar */}
              <div className={styles.special}>NPS de la région: {regionNPS}</div>
              

              <div className={styles.special}>Explicatif QoE</div>
                  <b className={styles.listtext}>Sur la QoE SMS</b>
                  <p className={styles.listtext}>{analyseQoE("sms", selectedMarker.sms, 92.0).verdict}</p>
                  
                  <b className={styles.listtext}>Sur la QoE Voix</b>
                  <p className={styles.listtext}>{analyseQoE("voix", selectedMarker.voix, 92.0).verdict}</p>
                  
                  <b className={styles.listtext}>Sur la QoE Data</b>
                  <p className={styles.listtext}>{analyseQoE("data", selectedMarker.data, 92.0).verdict}</p>
                  

                <div className={styles.LineChart} >
                  <LineChart></LineChart>
                </div>

                <div className={styles.special}>Information clientèle</div>
                <ul className={styles.listtext}>
                <li>Nombre moyen de clients sur les sms :  <b>{selectedMarker.moy_clients_sms}</b></li>
                <li>Nombre moyen de clients sur la voix :  <b>{selectedMarker.moy_clients_voix}</b></li>
                <li>Nombre moyen de clients sur la data :  <b>{selectedMarker.moy_clients_data}</b></li>
                
              </ul>
              </Sidebar>
          )}

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
                geojsonData={regionData}
              >
                {/* Contenu de la carte pour la vue "Régions" */}
                {({ TileLayer, GeoJSON, Popup }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    {/* Afficher les entités géographiques */}
                    <GeoJSON
                      data={regionData}
                      onEachFeature={(feature, layer) => {
                        layer.on('click', (e) => {
                          const regionInfo = feature.properties; // Récupérer les informations de la région
                          const regionNPSInfo = getRegionNPS(regionInfo.Région, npsData); // Récupérer les informations sur le NPS de la région
                          const npsContent = generateContent(regionNPSInfo.nps, 'NPS ')// Générer le contenu HTML pour le NPS
                          layer.bindPopup(`<b> Région : ${regionInfo.Région}</b><br> Superficie : ${regionInfo.Superficie}
                                        <br>${generateContent(regionNPSInfo.nps, 'NPS ')}
                                        <br>${generateContent(regionNPSInfo.qualite_couverture_moyenne, 'Qualité de la couverture ')}
                                        <br>${generateContent(regionNPSInfo.qualite_appels_moyenne, 'Qualité des appels ')}
                                        <br>${generateContent(regionNPSInfo.qualite_data_principal_moyenne, 'Qualité des data ')}
                                        <br>${generateContent(regionNPSInfo.qualite_service_client_moyenne, 'Qualité du service client ')}
                                        <br>${generateContent(regionNPSInfo['nombre répondants'], 'Nombre de répondants ')}
                                        <br>Mesure réalisée au mois de <b>Mars</b>`); // Afficher les informations dans le popup
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
                geojsonData={countryData}
              >
                {/* Contenu de la carte pour la vue "Pays" */}
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    {/* Afficher les entités géographiques */}
                    <GeoJSON
                      data={countryData}
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
                geojsonData={departementData}
              >
                {/* Contenu de la carte pour la vue "Département" */}
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    {/* Afficher les entités géographiques */}
                    <GeoJSON
                      data={departementData}
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
                geojsonData={departementData}
              >
                {/* Contenu de la carte pour la vue "Arrondissement" */}
                {({ TileLayer, GeoJSON }) => (
                  <>
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    {/* Afficher les entités géographiques */}
                    <GeoJSON
                      data={arrondissementData}
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
