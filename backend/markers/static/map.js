/*const map = L.map('map', {
    center: [7.334636635, 13.60340973],
    zoom: 6,
    minZoom: 6,
    maxZoom: 12,
    layers : [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
        }),

    ]
})

map.fitWorld();
*/

const layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
});

const map = L.map("map", {
    center: [6.28, 12.38],
    minZoom: 6,
    zoom: 8,
    maxZoom: 12,
    layers : [layer],
});
map.fitWorld();

