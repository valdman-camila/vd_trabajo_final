<script>
  import * as d3 from "d3";
  import atletas from "/src/data/athletes.csv";
  import series from "/src/data/SeriesYJuguetes.json";
  import peliculas from "/src/data/PeliculasYJuguetes.json";
  import Gatos from "/src/gatos.svelte";
  import Gatos2 from "/src/gatos2.svelte";
  import { llamadoGato, gatoEspecifico } from "/src/store.js";
  import CuadroGato from "/src/CuadroGato.svelte";
  import CuadroGato2 from "/src/CuadroGato2.svelte";
  import { fade, slide } from "svelte/transition";
  import { arrayfiltrado, arrayfiltrado2 } from "./store.js";

  console.log("series", series);
  console.log("peliculas", peliculas);

  /* 1. Escala para participaciones (cuantitativo > grosor) */
  const minMaxParticipations = d3.extent(atletas, (d) => d.participations);
  let grosorPartic = d3
    .scaleLinear()
    .domain(minMaxParticipations)
    .range([2, 18]);

  /* 2. Escala para medallas (cuantitativo > diámetro círculo) */
  const maxMedallas = d3.max(atletas, (d) => d.medallas);
  const diamMedallas = d3
    .scaleRadial()
    .domain([0, maxMedallas])
    .range([0, 100]);

  /* 3. Escala para genero (categórico > color) */
  const colorGenero = d3
    .scaleOrdinal()
    .domain(["F", "M"])
    .range(["#F7DDBA", "#E4D9F2"]);

  /* 4. Escala para continentes (categórico > color)   */
  const colorContinentes = d3
    .scaleOrdinal()
    .domain(["América", "África", "Asia", "Europa", "Oceanía"])
    .range(["#ed334e", "#000000", "#fbb132", "#009fe3", "#00963f"]);

  let currentGuideImage = "series";

  let currentDataType = "series";

  $: currentData = currentDataType === "series" ? series : peliculas;

  function abrirPopup() {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.getElementById("guia-visualizacion").classList.remove("hidden");
    document.getElementById("overlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "${scrollBarWidth}px";
  }

  function cerrarPopup() {
    document.getElementById("guia-visualizacion").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    currentGuideImage = "series";
    $gatoEspecifico = undefined;
    llamadoGato.set(false);
  }

  function showPreviousGuideImage() {
    if (currentGuideImage === "peliculas") {
      currentGuideImage = "series";
    }
  }

  function showNextGuideImage() {
    if (currentGuideImage === "series") {
      currentGuideImage = "peliculas";
    }
  }

  function changeDataType(type) {
    currentDataType = type;
    $gatoEspecifico = undefined;
    llamadoGato.set(false);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".guia-button");
    const nube = document.querySelector(".fondo-nube");

    if (button && nube) {
      button.addEventListener("mouseenter", () => {
        nube.classList.add("nube-escalada");
      });

      button.addEventListener("mouseleave", () => {
        nube.classList.remove("nube-escalada");
      });
    }
  });

  import { onMount } from "svelte";

  let mostrarBotones = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        mostrarBotones = entry.isIntersecting;
      },
      {
        threshold: 0.2,
      }
    );

    const target = document.getElementById("visualizacion");
    if (target) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  });
</script>

<main>
  <div id="overlay" class="hidden">
    <div id="guia-visualizacion" class="guia-visualizacion hidden">
      <div class="guia-image-wrapper">
        <img
          src={currentDataType === "series"
            ? "/images/GuiaSeriesFin2.svg"
            : "/images/GuiaPeliculasFin.svg"}
          alt="Guía Visual"
          width="950"
          in:fade={{ duration: 500 }}
          out:fade={{ duration: 500 }}
          class="guia-content-image"
        />
      </div>

      <button class="boton-cerrar-popup" on:click={cerrarPopup}>Cerrar</button>
    </div>
  </div>

  <!--<p class="bajada">
     Durante décadas, muchas líneas de juguetes dieron origen a series animadas pensadas para promocionarlos. Esta colección recorre esas historias que nacieron del marketing y terminaron marcando infancias.
    </p>
    -->
  <img src="/images/nube.svg" class="fondo-nube nube-izquierda" alt="" />

  <img src="/images/nube.svg" class="fondo-nube nube-derecha" alt="" />
  <div class="bunni-container">
    <div class="contenedor-intro">
      <img class="conejo" src="/images/Bunny_intro.svg" alt="Conejo" />
      <div class="speech">
        ¡Bienvenidos, queridísima audiencia! Soy Bunni, su anfitrión. Acá no van
        a encontrar cualquier historia… Esta es una colección de series y
        películas que nacieron de algo muy noble: ¡vender juguetes! Pero ojo, lo
        que empezó como pura estrategia de marketing terminó dejando huella en
        miles de infancias. Así que adelante, exploren, comparen, y revivan!
      </div>
    </div>
  </div>

  <div id="guia-container">
    <img src="/images/nube.svg" class="fondo-nube" alt="" />
    <button class="guia-button" on:click={abrirPopup}>
      <p>Guía de visualización</p>
    </button>
  </div>

  {#if mostrarBotones}
    <div class="data-type-fijo" transition:fade>
      <button
        class="change-data-button"
        class:active={currentDataType === "series"}
        on:click={() => changeDataType("series")}
        aria-label="Ver series"
      >
        <img
          src="/images/series_icono5.svg"
          alt="Series"
          style="width: 50px; height: 50px; margin-right:5px;"
        />
      </button>
      <button
        class="change-data-button"
        class:active={currentDataType === "peliculas"}
        on:click={() => changeDataType("peliculas")}
        aria-label="Ver películas"
      >
        <img
          src="/images/peliculas_icono5.svg"
          alt="Películas"
          style="width: 50px; height: 50px;"
        />
      </button>
    </div>
  {/if}

  <div class="gatos-visualizacion" id="visualizacion">
    {#if currentDataType === "series"}
      <Gatos {series} />
    {:else if currentDataType === "peliculas"}
      <Gatos2 {peliculas} />
    {/if}
  </div>

  <!--<Gatos series={series} />-->

  {#if currentDataType === "series"}
    <input type="checkbox" id="down" />
    <div class="seccion4">
      {#if $gatoEspecifico !== undefined && $arrayfiltrado[$gatoEspecifico]}
        <CuadroGato />
        <img class="fondo-nube-cuadro" src="./images/nube.svg" alt="" />
        <div class="cuadro-texto">
          <h2>¿{$arrayfiltrado[$gatoEspecifico].Nombre} marcó tu infancia?</h2>
          {#if $arrayfiltrado[$gatoEspecifico].Tipo == "Ambas"}
            <p>
              Esta serie es tanto <strong>episódica</strong> como
              <strong>serializada</strong>
              y tiene
              <strong>{$arrayfiltrado[$gatoEspecifico].Duracion}</strong> episodios
              en total.
            </p>
          {:else if $arrayfiltrado[$gatoEspecifico].Tipo == "Episodica"}
            <p>
              Esta serie es episódica
              y tiene
              <strong>{$arrayfiltrado[$gatoEspecifico].Duracion}</strong> episodios
              en total.
            </p>
          {:else}
            <p>
              Esta serie es serializada
              y tiene
              <strong>{$arrayfiltrado[$gatoEspecifico].Duracion}</strong> episodios
              en total.
            </p>
          {/if}
          <p>
            Tiene un puntaje de <strong
              >{$arrayfiltrado[$gatoEspecifico].Rating}</strong
            >
            en IMBD y recaudó
            <strong
              >{$arrayfiltrado[$gatoEspecifico].Ventas.toLocaleString()}</strong
            > millones de dólares en ventas de juguetes. ¡Un montón!
          </p>
          <p>
            ¿No te gustaría abrazar a <strong
              >{$arrayfiltrado[$gatoEspecifico].Nombre}</strong
            >?
          </p>
        </div>
      {/if}
      <label for="down"></label>
    </div>
  {:else if currentDataType === "peliculas"}
    <input type="checkbox" id="down" />
    <div class="seccion4">
      {#if $gatoEspecifico !== undefined && $arrayfiltrado2[$gatoEspecifico]}
        <CuadroGato2 />
        <img class="fondo-nube-cuadro" src="./images/nube.svg" alt="" />
        <div class="cuadro-texto">
          <h2>¿{$arrayfiltrado2[$gatoEspecifico].Nombre} marcó tu infancia?</h2>
          {#if $arrayfiltrado2[$gatoEspecifico].Tipo == "2"}
            <p>
              Esta película es parte de una saga de <strong>tres o más</strong>
              películas y dura
              <strong>{$arrayfiltrado2[$gatoEspecifico].Duracion}</strong> minutos.
            </p>
          {:else if $arrayfiltrado2[$gatoEspecifico].Tipo == "1"}
            <p>
              Esta película no cuenta con otras que siguen su historia, es solo <strong
                >{$arrayfiltrado2[$gatoEspecifico].Tipo.toLowerCase()}</strong
              >
              y dura
              <strong>{$arrayfiltrado2[$gatoEspecifico].Duracion}</strong> minutos.
            </p>
          {:else}
            <p>
              Esta película es parte de una saga de <strong
                >{$arrayfiltrado2[$gatoEspecifico].Tipo.toLowerCase()}</strong
              >
              películas y dura
              <strong>{$arrayfiltrado2[$gatoEspecifico].Duracion}</strong> minutos.
            </p>
          {/if}
          <p>
            Tiene un puntaje de <strong
              >{$arrayfiltrado2[$gatoEspecifico].Rating}</strong
            >
            en IMBD y recaudó
            <strong
              >{$arrayfiltrado2[
                $gatoEspecifico
              ].Ventas.toLocaleString()}</strong
            > millones de dólares en ventas de juguetes. ¡Un montón!
          </p>
          <p>
            ¿No te gustaría abrazar a <strong
              >{$arrayfiltrado2[$gatoEspecifico].Nombre}</strong
            >?
          </p>
        </div>
      {/if}
      <label for="down"></label>
    </div>
  {/if}
</main>

<style>
  .contenedor-intro {
    display: grid;
    grid-template-columns: 1fr auto;
    margin-top: 10%;
    gap: 80px;
  }

  main {
    width: 100%;
  }
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 80px;
  }
  .bajada {
    font-size: 24px;
    font-weight: 300;
    text-align: center;
    margin: 50px;
    padding-left: 25%;
    padding-right: 25%;
    margin-top: 10px;
  }
  .gatos-visualizacion {
    background: url("/images/cielo.svg");
    max-width: 3020px;
    background-size: cover;
  }

  .fondo-nube {
    height: 200px;
    position: absolute;
    align-self: center;
    top: 6%;
    transform: translate(-4%, -25%);
    z-index: 0;
  }
  .guia-button,
  .fondo-nube {
    transition: all 0.3s ease;
  }

  #guia-container:hover .fondo-nube {
    transform: scale(1.1) translate(-4%, -25%);
  }

  #guia-container:hover .guia-button {
    filter: brightness(150%);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    transform: scale(1.05) translateY(50%);
  }

  @keyframes flotar {
    0%,
    100% {
      transform: translate(0%, -40%);
    }
    50% {
      transform: translate(0%, -20%);
    }
  }
  #guia-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    max-width: 900px;
    gap: 30px;
    margin-bottom: 100px;
    flex-wrap: wrap;
    animation: flotar 2s ease-in-out infinite;
  }
  #guia-container:hover {
    animation-play-state: paused;
  }
  .guia-button {
    text-align: center;
    font-size: 1em;
    color: #3c3c3c;
    width: 300px;
    font-size: 22px;
    user-select: none;
    z-index: 50;
    transform: translateY(50%);
    font-family: "Pangolin", cursive;
    border-radius: 25px;
    transform-origin: center center;
  }
  @keyframes flotar2 {
    0%,
    100% {
      transform: translate(0%, -25%);
    }
    50% {
      transform: translate(0%, -20%);
    }
  }
  .bunni-container {
    position: relative;

    margin-top: 50px;
    margin-bottom: 50px;
  }

  .speech {
    background-image: url("/images/Speech_intro.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    padding: 20px 50px 60px 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: "Pangolin", cursive;
    font-size: 18px;
    min-width: 150px;
    min-height: 400px;
    max-width: 800px;
    flex-wrap: wrap;

    animation: flotar2 5s ease-in-out infinite;
    z-index: 10;
  }

  .conejo {
    width: 500px;
    height: 500px;
    margin-top: 0px;
    animation: flotar2 5s ease-in-out infinite;
  }

  .nube-izquierda {
    left: -350px;
    bottom: 200px;
    width: 200px;
    animation: flotar2 5s ease-in-out infinite;
  }

  .nube-derecha {
    right: -400px;
    width: 120px;
    animation: flotar2 5s ease-in-out infinite;
  }

  button {
    text-align: center;
    background-color: unset;
    font-size: 1em;
    color: #3c3c3c;
    width: auto;
    font-size: 18px;
    user-select: none;
    border: none;
    cursor: pointer;
  }
  .guia-visualizacion {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    padding: 20px;
    background: rgb(255, 255, 255);
    z-index: 2000;
    text-align: center;
    border-radius: 10%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    min-height: 600px;
  }
  .hidden {
    display: none;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background-color: #3c3c3c;
  }
  .guia-box {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .gatitoImg {
    width: 100px;
    height: 100px;
    box-sizing: border-box;
  }
  .gatito-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .gatito-colores {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .circulo-color {
    height: 25px;
    width: 25px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
  }

  .data-type-fijo {
    position: fixed;
    top: 120px;
    right: 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 1000;
  }

  .data-type-fijo .change-data-button img {
    width: 24px;
    height: 24px;
  }

  .seccion4 {
    display: grid;
    grid-template-columns: 2fr 2fr;
  }
  .cuadro-texto {
    display: inline-block;
    align-items: center;
    margin-left: 20%;
    margin-right: 20%;
    margin-top: 10%;
    padding: 12px 20px;
    box-sizing: content-box;
    background-color: #ffe4f0;
    color: #5b3c40;
    border: 2px solid #ffcce1;
    border-radius: 25px;
    font-size: 22px;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: "Pangolin", cursive;
    text-align: center;
    transition: all 0.3s ease;
    cursor: default;
  }

  .cuadro-texto:hover {
    box-shadow: 0px 0px 20px 10px #fff3f9;
  }
  .boton-cerrar-popup {
    margin-top: 20px;
    display: inline-block;
    padding: 14px 28px;
    background-color: #ffe4f0;
    color: #5b3c40;
    border: 2px solid #ffcce1;
    border-radius: 25px;
    font-size: 22px;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    font-family: "Pangolin", cursive;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .boton-cerrar-popup:hover {
    filter: brightness(150%);
    background-color: #ffd6ec;
    border-color: #ffb6d1;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
    transform: translateX(-50%) scale(1.05);
  }
  .fondo-nube-cuadro {
    position: absolute;
    height: 400px;
    bottom: 4%;
    z-index: -60;
    left: 45%;
  }
  .nav-arrow {
    background-color: #ffcce1;
    border: none;
    padding: 10px 15px;
    font-size: 28px;
    cursor: pointer;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
    z-index: 210;
    color: #8e2f1a;
  }

  .nav-arrow:hover:not(:disabled) {
    background-color: #ffd6ec;
    transform: scale(1.1);
  }

  .nav-arrow:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #eee;
  }

  .guia-image-wrapper {
    position: relative;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    min-height: 500px;
    width: calc(100% - 120px);
  }

  .guia-content-image {
    max-width: 79%;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .data-type-switcher {
    display: flex;
    justify-content: center;
    margin: 40px auto 20px auto;
    gap: 20px;
  }

  .data-type-fijo .change-data-button {
    padding: 10px;
    background-color: #ffe4f0;
    border-radius: 50%;
    border: 2px solid #ffcce1;
    box-shadow: 0 3px 6px rgba(255, 182, 193, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .data-type-fijo .change-data-button:hover {
    background-color: #ffd6e3;
    border-color: #ffb6cc;
    box-shadow: 0 5px 10px rgba(255, 182, 193, 0.5);
    transform: translateY(-2px);
  }

  .data-type-fijo .change-data-button.active {
    background-color: #f9a9be;
    border-color: #e4879f;
    box-shadow: 0 6px 12px rgba(249, 169, 190, 0.6);
    color: white;
    transform: translateY(-1px);
  }
</style>
