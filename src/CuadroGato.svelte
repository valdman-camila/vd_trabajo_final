<script>
  import * as d3 from "d3";
  import Color from "/src/color.svelte";
  import Mancha from "/src/mancha.svelte";
  import { gatoEspecifico, arrayfiltrado } from "./store.js";
  import series from "/src/data/SeriesYJuguetes.json";

  $: serie = $gatoEspecifico !== null ? $arrayfiltrado[$gatoEspecifico] : null;

  const maxRating = d3.max(series, (d) => d.Rating);
  const minRating = d3.min(series, (d) => d.Rating);
  const diamRating = d3
    .scaleLinear()
    .domain([minRating, maxRating])
    .range([160, 360]);

  const manchaW = d3
    .scaleLinear()
    .domain([minRating, maxRating])
    .range([15, 180]);
  const manchaH = d3
    .scaleLinear()
    .domain([minRating, maxRating])
    .range([15, 180]);
  const maxDuracion = d3.max(series, (d) => d.Duracion);
  let colorDuracion = d3
    .scaleThreshold()
    .domain([50, 100, 150, 200])
    .range(["#FDF8F2", "#EFCFA9", "#DF9F53", "#AC6C20", "#6C4414"]);
  const maxVentas = d3.max(series, (d) => d.Ventas);
  const minVentas = d3.min(series, (d) => d.Ventas);
  let manchaVentas = d3
    .scaleLinear()
    .domain([minVentas, maxVentas])
    .range([1, 5]);
</script>

{#if serie}
  <div class="contenedor">
    <img
      class="marco"
      src="./images/marco-foto.svg"
      alt=""
      style="height: {diamRating(serie.Rating) * 1.5}px"
    />

    <div class="person-container">
      {#if serie.Tipo === "Serializada"}
        <img
          class="person"
          src="./images/gatoDer.svg"
          alt=""
          style="
            width: {diamRating(serie.Rating) * 0.674}px; 
            height: {diamRating(serie.Rating)}px;"
        />
      {/if}

      {#if serie.Tipo === "Episodica"}
        <img
          class="person"
          src="./images/gatoIzq.svg"
          alt=""
          style="
            width: {diamRating(serie.Rating) * 0.674}px; 
            height: {diamRating(serie.Rating)}px;"
        />
      {/if}

      {#if serie.Tipo === "Ambas"}
        <img
          class="person"
          src="./images/linea-gato-dos.svg"
          alt=""
          style="
            width: {diamRating(serie.Rating) * 0.674}px; 
            height: {diamRating(serie.Rating)}px;"
        />
      {/if}

      <div class="manchas">
        <Mancha
          tipo={serie.Tipo}
          cant={manchaVentas(serie.Ventas)}
          tamano={diamRating(serie.Rating) * 0.674}
          altura={diamRating(serie.Rating)}
        />
      </div>

      <div class="person-color">
        <Color
          tipo={serie.Tipo}
          tamano={diamRating(serie.Rating) * 0.674}
          altura={diamRating(serie.Rating)}
          color={colorDuracion(serie.Duracion)}
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
    position: relative;
    transform: rotate(0deg);
    transition: transform 0.6s ease-in-out;
    transform-origin: top center;
  }
  .marco {
    position: absolute;
    z-index: 0;
    bottom: 5%;
    transform: translateY(-54%);
    top: 46%;
    overflow: hidden;
  }
  .person-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    z-index: 3;
  }
  .person {
    position: relative;
    z-index: 3;
  }
  .manchas {
    bottom: -6px;
    position: absolute;
    mix-blend-mode: multiply;
    z-index: 3;
  }
  .person-color {
    position: absolute;
    bottom: -6px;
  }

  .contenedor:hover {
    animation: move 3.5s ease-in-out infinite;
    transform-origin: top center;
    animation-fill-mode: both;
  }

  @keyframes move {
    0% {
      transform: rotate(-3deg);
    }
    25% {
      transform: rotate(3deg);
    }
    50% {
      transform: rotate(-3deg);
    }
    75% {
      transform: rotate(3deg);
    }
    100% {
      transform: rotate(-3deg);
    }
  }
</style>
