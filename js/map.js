let map;
let geoJsonLayer;
let selectedLayer = null;

function initMap() {
  map = L.map("map").setView([37.5665, 126.9780], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);
}

function renderGeoJson(geojson, projects, onSelect) {
  const projectMap = new Map(projects.map(p => [p.id, p]));

  geoJsonLayer = L.geoJSON(geojson, {
    style: {
      color: "#38bdf8",
      weight: 2,
      fillColor: "#0ea5e9",
      fillOpacity: 0.25
    },
    onEachFeature: (feature, layer) => {
      const project = projectMap.get(feature.properties.id);

      layer.on("click", () => {
        if (selectedLayer) {
          selectedLayer.setStyle({
            color: "#38bdf8",
            weight: 2,
            fillColor: "#0ea5e9",
            fillOpacity: 0.25
          });
        }

        selectedLayer = layer;

        layer.setStyle({
          color: "#facc15",
          weight: 3,
          fillColor: "#facc15",
          fillOpacity: 0.35
        });

        if (project) {
          onSelect(project);
        }
      });
    }
  }).addTo(map);

  map.fitBounds(geoJsonLayer.getBounds());
}

function focusProject(projectId) {
  geoJsonLayer.eachLayer(layer => {
    if (layer.feature.properties.id === projectId) {
      layer.fire("click");
      map.fitBounds(layer.getBounds(), {
        padding: [60, 60]
      });
    }
  });
}
