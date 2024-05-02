// components/LayerControl.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const LayerControl = ({ baseLayers }) => {
  const map = useMap();

  useEffect(() => {
    // Ajouter les couches de base à la carte
    Object.keys(baseLayers).forEach(layerName => {
      baseLayers[layerName].addTo(map);
    });

    // Supprimer les couches de base non sélectionnées de la carte
    return () => {
      Object.keys(baseLayers).forEach(layerName => {
        map.removeLayer(baseLayers[layerName]);
      });
    };
  }, [map, baseLayers]);

  return null;
};

export default LayerControl;
