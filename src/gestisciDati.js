import { TERREMOTI_URL } from "./fetchURL.js";
import PocketBase from "https://unpkg.com/pocketbase/dist/pocketbase.es.mjs";
import { mostraModaleMagnitudo, aggiornaContatore } from "./aggiungiFiltri.js";

const pb = new PocketBase("http://127.0.0.1:8090");

// cache dei dati
let terremotiCache = null;
let userPointsCache = null;
let clickListenerRegistrato = false;

// funzione helper per creare marker con icona e popup
function creaMarker(lat, lon, place, mag, tipo) {
  const isUtente = tipo === 'utente';
  
  // Icona personalizzata con effetto terremoto
  const iconHtml = isUtente 
    ? `
      <div class="relative flex items-center justify-center" style="width: 40px; height: 40px;">
        <div class="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
        <div class="absolute inset-0 rounded-full bg-emerald-500 opacity-30" style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-lime-500 shadow-2xl" style="box-shadow: 0 0 15px rgba(34, 197, 94, 0.6), 0 0 30px rgba(16, 185, 129, 0.4);"></div>
        <div class="absolute inset-1 rounded-full bg-gradient-to-br from-green-500 via-emerald-400 to-lime-400"></div>
        <div class="absolute inset-2 rounded-full bg-green-600 border-2 border-lime-300" style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
    `
    : `
      <div class="relative flex items-center justify-center" style="width: 40px; height: 40px;">
        <div class="absolute inset-0 rounded-full bg-red-700 opacity-20 animate-ping"></div>
        <div class="absolute inset-0 rounded-full bg-red-600 opacity-30" style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-red-800 via-red-700 to-red-600 shadow-2xl" style="box-shadow: 0 0 15px rgba(185, 28, 28, 0.7), 0 0 30px rgba(220, 38, 38, 0.5);"></div>
        <div class="absolute inset-1 rounded-full bg-gradient-to-br from-red-700 via-red-600 to-red-500"></div>
        <div class="absolute inset-2 rounded-full bg-red-800 border-2 border-red-400" style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
    `;

  const icon = L.divIcon({
    html: iconHtml,
    className: `marker-${tipo}`,
    iconSize: L.point(40, 40),
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  const marker = L.marker([lat, lon], { icon });
  const badgeClass = tipo === 'utente' ? 'badge-success' : 'badge-error';
  marker.bindPopup(`<b>${place}</b><br><span class="badge ${badgeClass}">Magnitudo ${mag}</span>`);
  return marker;
}

export async function gestisciDati({ mappa, markerClusterGroup }, minMag = 0, maxMag = 13) {
  // svuota cluster
  markerClusterGroup.clearLayers();

  if (!terremotiCache) {
    try {
      const response = await fetch(TERREMOTI_URL);
      const data = await response.json();
      terremotiCache = data.features;
    } catch (e) {
      console.error("Errore terremoti:", e);
      terremotiCache = [];
    }
  }

  if (!userPointsCache) {
    try {
      userPointsCache = await pb.collection("punti").getFullList();
    } catch (e) {
      console.error("Errore punti utente:", e);
      userPointsCache = [];
    }
  }

  const markers = [];

  // aggiungi terremoti filtrati
  for (const el of terremotiCache) {
    const [lon, lat] = el.geometry.coordinates;
    const mag = el.properties.mag;
    if (mag < minMag || mag > maxMag) continue;

    const marker = creaMarker(lat, lon, el.properties.place, mag, 'terremoto');
    markers.push(marker);
    markerClusterGroup.addLayer(marker);
  }

  // aggiungi punti utente filtrati
  for (const r of userPointsCache) {
    const { lat, lon } = r.field;
    const mag = r.mag;
    if (mag < minMag || mag > maxMag) continue;

    const marker = creaMarker(lat, lon, r.place, mag, 'utente');
    markers.push(marker);
    markerClusterGroup.addLayer(marker);
  }

  // click per aggiungere punti utente
  if (!clickListenerRegistrato) {
    clickListenerRegistrato = true;
    mappa.off('click');
    mappa.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      const result = await mostraModaleMagnitudo();
      if (!result) return;

      const { mag, place } = result;
      try {
        await pb.collection('punti').create({
          field: { lat, lon: lng },
          mag,
          place,
          tipo: 'utente'
        });

        const marker = creaMarker(lat, lng, place, mag, 'utente');
        markers.push(marker);
        markerClusterGroup.addLayer(marker);

        // aggiorna cache e contatore
        userPointsCache.push({ field: { lat, lon: lng }, mag, place });
        aggiornaContatore(markers.length);

      } catch (err) {
        console.error("Errore nel salvataggio in PocketBase:", err.message);
      }
    });
  }

  return markers;
}