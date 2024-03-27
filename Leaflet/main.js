window.onload = init;

function init() {
    const mapElement = document.getElementById('mapid');

    const openStreetMapStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        maxZoom: 16
    });

    const OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    });

    const mymap = L.map(mapElement, {
        center: [7.37, 12.35],
        zoom: 7,
        minZoom: 7,
        maxZoom: 11,
        attributionControl: false,
        layers: [openStreetMapStandard]
    });

    const baseLayers = {
        'OpenStreetMapStandard': openStreetMapStandard,
        'OpenStreetMap_HOT': OpenStreetMap_HOT,
        'Esri_NatGeoworldMap': Esri_NatGeoWorldMap
    };

    const layerControls = L.control.layers(baseLayers, {}, {}).addTo(mymap);

    
    // Définir le chemin du fichier JSON
    var jsonFilePath = './markers.json';

    // Charger le fichier JSON à l'aide de Fetch
    fetch(jsonFilePath)
        .then(response => {
            // Vérifier si la réponse est OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Convertir la réponse en JSON
            return response.json();
        })
        .then(data => {
            // Manipuler les données JSON ici
            console.log(data);
        })
        .catch(error => {
            // Attraper les erreurs de requête
            console.error('There has been a problem with your fetch operation:', error);
        });

}
