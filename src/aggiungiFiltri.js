/*
import { clearCollection } from "./eliminaDati";

export function aggiungiFiltri(mappa, callbackFiltro) {
  const filtri = L.control({ position: 'topright' });

  filtri.onAdd = function() {
    const div = L.DomUtil.create('div', 'filtri-container');
    div.innerHTML = `
      <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
        <label><b>Magnitudo minima:</b></label><br>
        <input id="minMag" type="range" min="0" max="8" step="0.5" value="0">
        <span id="minMagValue">0</span>
        <br></br>
        <label><b>Contatore: </b></label>
        <span id="contatore">0</span>
        <br></br>
        <button id="reset">Reset</button>

      </div>
    `;
    return div;
  };

  filtri.addTo(mappa);

  L.DomEvent.disableClickPropagation(document.querySelector('.filtri-container'));
  document.getElementById('minMag').addEventListener('input', e => {
    const valore = parseFloat(e.target.value);
    document.getElementById('minMagValue').textContent = valore;
    callbackFiltro(valore);
  });

  document.getElementById('reset').addEventListener('click', clearCollection)
  
}

export function aggiornaContatore(numero) {
  const contatore = document.getElementById('contatore');
  if (contatore) contatore.textContent = numero;
}
*/
import { clearCollection } from "./eliminaDati.js";

// Callback dei filtri
export function inizializzaFiltri(callbackFiltro) {
  const minMagInput = document.getElementById("minMag");
  const maxMagInput = document.getElementById("maxMag");
  const minMagValue = document.getElementById("minMagValue");
  const maxMagValue = document.getElementById("maxMagValue");
  const resetBtn = document.getElementById("reset");

  minMagInput.addEventListener("input", () => {
    const minVal = parseFloat(minMagInput.value);
    const maxVal = parseFloat(maxMagInput.value);
    minMagValue.textContent = minVal;
    callbackFiltro(minVal, maxVal);
  });

  maxMagInput.addEventListener("input", () => {
    const minVal = parseFloat(minMagInput.value);
    const maxVal = parseFloat(maxMagInput.value);
    maxMagValue.textContent = maxVal;
    callbackFiltro(minVal, maxVal);
  });

  resetBtn.addEventListener("click", clearCollection);
}

// Aggiornamento contatore
export function aggiornaContatore(numero) {
  const contatore = document.getElementById("contatore");
  if (contatore) contatore.textContent = numero;
}

// Modale dinamico
export function mostraModaleMagnitudo() {
  return new Promise((resolve) => {
    const modal = document.getElementById("modalMagnitudo");
    const slider = document.getElementById("inputMagnitudo");
    const display = document.getElementById("magnitudoValue");
    const inputPlace = document.getElementById("inputPlace");
    const btnConferma = document.getElementById("btnConferma");
    const btnAnnulla = document.getElementById("btnAnnulla");

    // Mostra il modale
    modal.showModal();

    // Aggiorna il valore in tempo reale accanto allo slider
    const onSliderInput = () => {
      display.textContent = slider.value;
    };
    slider.addEventListener("input", onSliderInput);

    function conferma() {
      const mag = parseFloat(slider.value);  // <--- qui correggiamo inputMag -> slider
      const place = inputPlace.value.trim() || "Punto utente";
      modal.close();
      btnConferma.removeEventListener("click", conferma);
      btnAnnulla.removeEventListener("click", annulla);
      slider.removeEventListener("input", onSliderInput);
      resolve({ mag, place });
    }

    function annulla() {
      modal.close();
      btnConferma.removeEventListener("click", conferma);
      btnAnnulla.removeEventListener("click", annulla);
      slider.removeEventListener("input", onSliderInput);
      resolve(null);
    }

    btnConferma.addEventListener("click", conferma);
    btnAnnulla.addEventListener("click", annulla);
  });
}

