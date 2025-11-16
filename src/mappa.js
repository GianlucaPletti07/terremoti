/*export function creaMappa() {
  var mappa = L.map('map').setView([41.8719, 12.5674], 5);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mappa);

  const popup = L.popup();
  mappa.on('click', e => {
    popup
      .setLatLng(e.latlng)
      .setContent("Hai cliccato in " + e.latlng.toString())
      .openOn(mappa);
  });

  return mappa;
}*/
import 'https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js';

export function creaMappa() {
  const mappa = L.map('map').setView([41.8719, 12.5674], 3);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mappa);

  // Cluster personalizzato "terremoto" con effetto più appealing
  const markerClusterGroup = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      const count = cluster.getChildCount();
      let size = 50;
      let textSize = "text-sm";
      
      if (count >= 10 && count < 50) {
        size = 60;
        textSize = "text-base";
      } else if (count >= 50) {
        size = 70;
        textSize = "text-lg";
      }

      const html = `
        <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
          <!-- Onde sismiche esterne -->
          <div class="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
          <div class="absolute inset-0 rounded-full bg-orange-500 opacity-30" style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
          
          <!-- Cerchio principale con gradiente -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 shadow-2xl" style="box-shadow: 0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(249, 115, 22, 0.4);"></div>
          
          <!-- Bordo interno luminoso -->
          <div class="absolute inset-1 rounded-full bg-gradient-to-br from-red-500 via-orange-400 to-yellow-400"></div>
          
          <!-- Centro con numero -->
          <div class="absolute inset-2 rounded-full bg-red-600 flex items-center justify-center border-2 border-yellow-300" style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
            <span class="font-black text-white ${textSize} drop-shadow-lg" style="text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${count}</span>
          </div>
        </div>
      `;

      return L.divIcon({
        html,
        className: 'marker-cluster-earthquake',
        iconSize: L.point(size, size)
      });
    }
  });

  mappa.addLayer(markerClusterGroup);

  return { mappa, markerClusterGroup };
}




