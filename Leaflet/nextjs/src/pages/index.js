import { useState, useEffect } from 'react';
import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';

const DEFAULT_CENTER = [7.37, 12.35];

export default function Home() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Charger les données depuis le fichier JSON
    const fetchData = async () => {
      try {
        const data = require('./markers.json');
        setMarkers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Carte des sites d'OCM</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>
          Carte des sites d'OCM
          </h1>

          <Map className={styles.homeMap} width="1000" height="800" center={DEFAULT_CENTER} zoom={8} minZoom={5} maxZoom={13}>
            {({ TileLayer, Marker, Popup }) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker, index) => (
                  <Marker key={index} position={[marker.coords[0], marker.coords[1]]}>
                    <Popup>
                      {marker.nom}
                    </Popup>
                  </Marker>
                ))}
              </>
            )}
          </Map>

          <p className={styles.description}>
            <code className={styles.code}>Prémiers résultats de l'affichage des sites sur la carte</code>
          </p>

        </Container>
      </Section>
    </Layout>
  );
}
