/*

// PocketBase CDN (Content Delivery Network)
// Per usarlo senza installare nulla localmente
import PocketBase from 'https://unpkg.com/pocketbase/dist/pocketbase.es.mjs';
 
const pb = new PocketBase('http://127.0.0.1:8090');
 
// Esegui il login come admin o utente registrato
// queste informazioni negli scaffold come Vite, React, Vue, ecc.
// andrebbero inserite nel file .env
await pb.admins.authWithPassword('admin@admin.it', '1234567890');
 
/**********************************************************************/
/*
import { creaMappa } from './mappa.js';
import { gestisciDati } from './gestisciDati.js';
import { inizializzaFiltri, aggiornaContatore } from './aggiungiFiltri.js';

const mappa = creaMappa();
let markers = [];

// Funzione principale per caricare e filtrare i terremoti
async function caricaTerremoti(minMag = 0, maxMag = 13) {
  // Rimuovi marker attuali dalla mappa
  markers.forEach(m => m.remove());
  markers = [];

  // Recupera i marker filtrati
  const nuovi = await gestisciDati(mappa, minMag, maxMag);
  markers = nuovi;

  // Aggiorna contatore
  aggiornaContatore(markers.length);
}

// Inizializza i filtri e collega il callback
// La funzione inizializzaFiltri() è quella che gestisce gli slider e il reset
inizializzaFiltri((minMag, maxMag) => caricaTerremoti(minMag, maxMag));

// Caricamento iniziale
caricaTerremoti();
*/
import PocketBase from 'https://unpkg.com/pocketbase/dist/pocketbase.es.mjs';
import { creaMappa } from './mappa.js';
import { gestisciDati } from './gestisciDati.js';
import { inizializzaFiltri, aggiornaContatore } from './aggiungiFiltri.js';

const pb = new PocketBase('http://127.0.0.1:8090');
await pb.admins.authWithPassword('admin@admin.it', '1234567890');

const { mappa, markerClusterGroup } = creaMappa();

let markers = [];

async function caricaTerremoti(minMag = 0, maxMag = 13) {
  // chiama gestisciDati passando anche il layer di cluster
  markers.forEach(m => m.remove());
  markers = await gestisciDati({ mappa, markerClusterGroup }, minMag, maxMag);
  aggiornaContatore(markers.length);
}

inizializzaFiltri((minMag, maxMag) => caricaTerremoti(minMag, maxMag));
caricaTerremoti();

