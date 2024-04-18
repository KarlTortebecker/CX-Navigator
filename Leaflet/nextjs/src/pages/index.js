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

const DEFAULT_CENTER = [7.37, 12.35];

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [geojsonData, setGeojsonData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState();  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Charger les données depuis le fichier JSON
    const fetchData = async () => {
      try {
        setMarkers(data);
        setGeojsonData(regions);
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
  }

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

          {/* Intégration de la barre de recherche */}
          <SearchBar setSearchQuery={setSearchQuery} />

          {/* Afficher la sidebar */}
          {isSidebarOpen && selectedMarker && (
              <Sidebar isOpen={true} onClose={handleCloseSidebar}>
                <h2 className={styles.code}>{selectedMarker.nom}</h2>
                <p>Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
                <p> Here to display the necessary to explain the QoE</p>
              </Sidebar>
            )}


          {/* Afficher la carte */}
          <div className={styles.map}>
              
            <Map
              className={styles.homeMap}
              width="1000"
              height="800"
              center={DEFAULT_CENTER}
              zoom={8}
              minZoom={5}
              maxZoom={13}
              geojsonData={geojsonData}
              onMarkerClick={(e) => handleMarkerClick(e.target)}
            >
            
              {({ TileLayer, Marker, Popup, Sidebar }) => (
                <>
                  <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

                  {/* Afficher les marqueurs filtrés */}
                  {filteredMarkers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={[marker.coords[0], marker.coords[1]]}
                      eventHandlers={{ dblclick: () => {
                        console.log('Marker double-clicked:', marker); // Ajoutez cette ligne pour vérifier si le double-clic est capturé
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
