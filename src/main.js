import './app.css'
import App from "./App.svelte"
import Gato from "./armarGato/gatoInteractivo.svelte"
import Juego from "/src/juego.svelte"
import Juego2 from "/src/juego2.svelte"
import GatoFinal from "./armarGato/gatoResultado.svelte"
import GatoResultado from './armarGato/gatoResultado.svelte'

const app = new App({
  target: document.getElementById("app"),
})

const juego = new Juego({
  target: document.getElementById("juego")
})

const juego2 = new Juego2({
  target: document.getElementById("juego2")
})

const gato = new Gato({
  target: document.getElementById("app2"),
})

const gatoResultado = new GatoResultado({
  target: document.getElementById("gato-final")
})

export {app, gato}

function loadSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(section => {
    section.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
  }
}

