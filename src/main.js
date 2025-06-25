import './app.css'
import App from "./App.svelte"
import Gato from "./armarGato/gatoInteractivo.svelte"
import Juego from "/src/juego.svelte"

const app = new App({
  target: document.getElementById("app"),
})

const juego = new Juego({
  target: document.getElementById("juego")
})

const gato = new Gato({
  target: document.getElementById("app2"),
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