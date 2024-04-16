import { useEffect, useState } from 'react';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './Map.module.scss';

const { MapContainer, GeoJSON } = ReactLeaflet;

const Map = ({ children, className, width, height, geojsonData, ...rest }) => {
  const [Leaflet, setLeaflet] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        setLeaflet(L.default);
        delete L.default.Icon.Default.prototype._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
          iconUrl: 'leaflet/images/marker-icon.png',
          shadowUrl: 'leaflet/images/marker-shadow.png',
        });
      });
    }
  }, []);

  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  return (
    <MapContainer className={mapClassName} {...rest}>
      {Leaflet && children(ReactLeaflet, Leaflet)}
      {geojsonData && <GeoJSON data={geojsonData} />}
    </MapContainer>
  )
}

export default Map;
