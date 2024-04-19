import { useState, useEffect } from "react";
import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import Container from "@components/Container";
import Sidebar from "@components/Sidebar";
import Map from "@components/Map";
import SearchBar from "@components/SearchBar"; // Importez la barre de recherche ici

import styles from "@styles/Home.module.scss";

import data from "./markers.json";
import regions from "./regions.json";
import departements from './departements.json'
import arrondissements from "./arrondissements.json";
import cameroun from "./cameroun.json";


const DEFAULT_CENTER = [7.37, 12.35];
const views = ["Pays", "Régions", "Départements", "Arrondissements", "Sites"];

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [departementData, setDepartementData] = useState([]);
  const [arrondissementData, setArrondissementDataData] = useState([]);
  const [selectedView, setSelectedView] = useState(views[0]); // Modifier l'index initial à 0
  const [selectedMarker, setSelectedMarker] = useState();  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Charger les données depuis le fichier JSON
    const fetchData = async () => {
      try {
        setMarkers(data);
        setRegionData(regions);
        setArrondissementDataData(arrondissements);
        setCountryData(cameroun);
        setDepartementData(departements);
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
  };

  const handleCloseSidebar = () => {
    setSelectedMarker(null);
    setIsSidebarOpen(false)
  };

  // Fonction pour gérer le changement de vue
  const handleChangeView = (event) => {
    setSelectedView(event.target.value);
  };

  return (
    <Layout>
      <Head>
        <title>Carte des sites d'OCM</title>
        <meta
          name="description"
          content="Create mapping apps with Next.js Leaflet for QoE"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>Carte des sites d'OCM</h1>

          <div style={{display:"flex", justifyContent:"space-between"}}>
              {/* Intégration de la barre de recherche */}
          <SearchBar setSearchQuery={setSearchQuery} />

          {/* Sélecteur de vue */}
          <div >
            <select value={selectedView} onChange={handleChangeView} style={{border: "1px solid #d1d5db"}}>
              {views.map((view) => (
                <option key={view} value={view}>
                  {view}
                </option>
              ))}
            </select>
          </div>
          </div>
          


          {/* Afficher la sidebar */}
          {isSidebarOpen && selectedMarker && (
              <Sidebar isOpen={true} onClose={handleCloseSidebar}>
                <h2 className={styles.code}>Site de {selectedMarker.nom}</h2>
                <p> Localité :  {selectedMarker.localite}</p>
                <p> Type de zone : {selectedMarker.zonepmo}</p>
                <p> Région : {selectedMarker.region}</p>
                <p> Département : {selectedMarker.departement}</p>
                <p> Arrondissement : {selectedMarker.arrondissement}</p>
                <p> QoE data : {selectedMarker.data.toFixed(3)}</p>
                <p> QoE sms : {selectedMarker.sms.toFixed(3)}</p>
                <p> QoE voix : {selectedMarker.voix.toFixed(3)}</p>
                <p> Taux de dropcall : {selectedMarker.dropcall.toFixed(3)}</p>
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
              zoom={7}
              minZoom={6}
              maxZoom={11}
            >
            
              {({ TileLayer, Marker, Popup }) => (
                <>
                  <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

                  {/* Afficher les marqueurs filtrés */}
                  {filteredMarkers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={[marker.coords[0], marker.coords[1]]}
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
                        {marker.Typezone}
                        <br />
                        <b>QoE data : </b>
                        {marker.data}
                        <br />
                        <b>Zone PMO : </b>
                        {marker.zonepmo}
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
                          layer.bindPopup(`<b> Région : ${regionInfo.Région}</b><br> Superficie : ${regionInfo.Superficie}`); // Afficher les informations dans le popup
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
                          layer.bindPopup(`<b> Pays : ${departementInfo.Département}</b>`); // Afficher les informations dans le popup
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
