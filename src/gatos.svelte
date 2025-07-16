<script>
  import * as d3 from "d3";
  export let series = "";
  import Color from "/src/color.svelte";
  import Mancha from "/src/mancha.svelte";
  import { llamadoGato, gatoEspecifico } from "/src/store.js";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { arrayfiltrado } from "./store.js";

  let arrdos = [];

  function manejarClick(i, j) {
    llamadoGato.update((n) => n + 1);
    gatoEspecifico.set(i + j * 4);
  }

  let mostrarBoton = false;

  onMount(() => {
    const seccionGatos = document.querySelector(".mueble");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          mostrarBoton = entry.isIntersecting;
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (seccionGatos) observer.observe(seccionGatos);

    arrdos = agruparCuatro(series);
    arrayfiltrado.set(series);

    return () => {
      if (seccionGatos) observer.unobserve(seccionGatos);
    };
  });

  let gatos = "series";
  let orden = "";
  let filtro = "todas";
  let resaltar = "todas";
  $: seriePelicu = series;

  const maxRating = d3.max(series, (d) => d.Rating);
  const minRating = d3.min(series, (d) => d.Rating);
  const diamRating = d3.scaleLinear().domain([minRating, maxRating]).range([80, 180]);

  const maxDuracion = d3.max(series, (d) => d.Duracion);
  let colorDuracion = d3.scaleThreshold().domain([50, 100, 150, 200]).range(["#FDF8F2", "#EFCFA9", "#DF9F53", "#AC6C20", "#6C4414"]);

  const maxVentas = d3.max(series, (d) => d.Ventas);
  const minVentas = d3.min(series, (d) => d.Ventas);
  let manchaVentas = d3.scaleLinear().domain([minVentas, maxVentas]).range([1, 5]);

  function agruparCuatro(lista) {
    let filas = [];
    let temp2 = [];
    for (let i = 0; i < seriePelicu.length; i++) {
      temp2.push(seriePelicu[i]);
      if ((i + 1) % 4 == 0 || i + 1 == seriePelicu.length) {
        filas.push(temp2);
        temp2 = [];
      }
    }
    return filas;
  }

  let textoBotonO = "Ordenar por ▾";
  let textoBtnF = "Filtrar por ▾";

  function orderSelection(opcion) {
    orden = opcion;
    switch (opcion) {
      case "orden_ventas":
        textoBotonO = "Más ventas";
        seriePelicu = d3.sort(seriePelicu, (s) => s.Ventas);
        seriePelicu = d3.reverse(seriePelicu);
        break;
      case "orden_tipo":
        textoBotonO = "Por tipo";
        seriePelicu = d3.sort(seriePelicu, (escena) => escena.Tipo);
        break;
      case "orden_rating":
        textoBotonO = "Por rating";
        seriePelicu = d3.sort(seriePelicu, (escena) => escena.Rating);
        seriePelicu = d3.reverse(seriePelicu);
        break;
      case "orden_duracion":
        textoBotonO = "Por duración";
        seriePelicu = d3.sort(seriePelicu, (escena) => escena.D);
        seriePelicu = d3.reverse(seriePelicu);
        break;
      default:
        textoBotonO = "Ordenar por ▾";
        seriePelicu = series;
    }

    arrdos = agruparCuatro(seriePelicu);
    arrayfiltrado.set(seriePelicu);
  }

  function filterSelection(valorFilter) {
    filtro = valorFilter;
    switch (valorFilter) {
      case "Episodica":
        textoBtnF = "Episódicas";
        seriePelicu = series.filter((p) => p.Tipo == filtro);
        break;
      case "Serializada":
        textoBtnF = "Serializadas";
        seriePelicu = series.filter((p) => p.Tipo == filtro);
        break;
      case "Ambas":
        textoBtnF = "Ambas";
        seriePelicu = series.filter((p) => p.Tipo == filtro);
        break;
      case "todas":
      default:
        textoBtnF = "Filtrar por ▾";
        seriePelicu = series;
    }
    arrdos = agruparCuatro(seriePelicu);
    arrayfiltrado.set(seriePelicu);
  }

  function abrirPopup() {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.getElementById("guia-visualizacion").classList.remove("hidden");
    document.getElementById("overlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;
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
</script>

{#if mostrarBoton}
  <button class="volver-a-guia" on:click={abrirPopup} transition:fade>
    Guía
  </button>
{/if}


<div class="techo-container">
  <div class="controles">
    <div class="ordenar">
      <div class="imagen-con-boton">
        <img class="imagen_orden" src="./images/orden_boton.svg" alt="" />
        <button class="boton_ordenar">{textoBotonO}</button>

        <div class="ops_ordenar">
          <button
            on:click={() => orderSelection("orden_ventas")}
            class:active={orden == "orden_ventas"}>Más ventas</button
          >
          <button
            on:click={() => orderSelection("orden_tipo")}
            class:active={orden == "orden_tipo"}>Por tipo</button
          >
          <button
            on:click={() => orderSelection("orden_rating")}
            class:active={orden == "orden_rating"}>Por rating</button
          >
          <button
            on:click={() => orderSelection("orden_duracion")}
            class:active={orden == "orden_duracion"}>Por duración</button
          >
        </div>
      </div>
    </div>

    <div class="filtrar">
      <div class="imagen-con-boton">
        <img class="imagen_filtrar" src="./images/filtro_boton.svg" alt="" />
        <button class="boton_filtrar">{textoBtnF}</button>

        <div class="ops_filtrar">
          <button
            on:click={() => filterSelection("todas")}
            class:active={filtro == "todas"}>Todas</button
          >
          <button
            on:click={() => filterSelection("Ambas")}
            class:active={filtro == "Ambas"}>Ambas</button
          >
          <button
            on:click={() => filterSelection("Serializada")}
            class:active={filtro == "Serializada"}>Serializadas</button
          >
          <button
            on:click={() => filterSelection("Episodica")}
            class:active={filtro == "Episodica"}>Episódicas</button
          >
        </div>
      </div>
    </div>
  </div>

  <img class="techo" src="./images/techoo.svg" alt="" />
</div>

<div class="mueble">
  <div class="container">
    {#each arrdos as cuatroG, j}
      <!-- Iteramos la data para visualizar c/ entidad -->
      <div class="gatos-con-estante">
        {#each cuatroG as serie, i}
          <div class="gato-wrapper">
            <div class="person-container">
              <button
                class="gato-interactivo"
                style="
              width: {diamRating(serie.Rating) * 0.634}px; 
              height: {diamRating(serie.Rating)}px; "
                on:click={() => manejarClick(i, j)}
                ><a href="#down">Click Here to Smoothly Scroll Down</a></button
              >

              {#if serie.Tipo == "Serializada"}
                <img
                  class="person"
                  src="./images/gatoDer.svg"
                  alt=""
                  style="
              width: {diamRating(serie.Rating) * 0.634}px; 
              height: {diamRating(serie.Rating)}px; "
                />
              {/if}
              {#if serie.Tipo == "Episodica"}
                <img
                  class="person"
                  src="./images/gatoIzq.svg"
                  alt=""
                  style="
              width: {diamRating(serie.Rating) * 0.634}px; 
              height: {diamRating(serie.Rating)}px; 

            "
                />
              {/if}
              {#if serie.Tipo == "Ambas"}
                <img
                  class="person"
                  src="./images/linea-gato-dos.svg"
                  alt=""
                  style="
              width: {diamRating(serie.Rating) * 0.634}px; 
              height: {diamRating(serie.Rating)}px; 

            "
                />
              {/if}

              <div class="manchas">
                <Mancha
                  tipo={serie.Tipo}
                  cant={manchaVentas(serie.Ventas)}
                  tamano={diamRating(serie.Rating) * 0.634}
                  altura={diamRating(serie.Rating)}
                />
              </div>
              <div class="person-color">
                <Color
                  tipo={serie.Tipo}
                  tamano={diamRating(serie.Rating) * 0.634}
                  altura={diamRating(serie.Rating)}
                  color={colorDuracion(serie.Duracion)}
                />
              </div>
            </div>
            <div class="nombre-container">
              <p>{serie.Nombre}</p>
            </div>
          </div>
        {/each}
        <img class="estante" src="./images/estante.svg" alt="" />
      </div>
    {/each}
  </div>
</div>
<img class="piso" src="./images/piso-mueble.svg" alt="" />

<style>
  .techo-container {
    position: relative;
    z-index: 1;
    overflow: visible;
  }

  .controles {
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 32%;

    display: flex;
    gap: 10rem;
  }

  .imagen-con-boton {
    position: relative;
    display: inline-block;
  }

  .imagen_orden,
  .imagen_filtrar {
    width: 250px;
    display: block;
  }

  .boton_ordenar,
  .boton_filtrar {
    position: absolute;
    top: 34%;
    left: 64%;
    transform: translate(-50%, -50%);
    height: 50px;
    width: 160px;
    background-color: #f6f5ea;
    color: black;
    font-size: 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    font-family: "Pangolin", cursive;
    z-index: 2;
  }

  /* Dropdowns */
  .ops_ordenar,
  .ops_filtrar {
    display: none;
    background-color: #f6f5ea;
    width: 150px;
    position: absolute;
    top: 62%;
    left: 57%;
    transform: translateX(-50%);
    border-radius: 4px;
    z-index: 3;
  }

  .ops_ordenar button,
  .ops_filtrar button {
    width: 100%;
    background: none;
    border: none;
    color: black;
    padding: 10px 14px;
    cursor: pointer;
    font-family: "Pangolin", cursive;
  }

  .ops_ordenar button:hover,
  .ops_filtrar button:hover {
    background-color: #f0d786;
  }

  /* Mostrar dropdowns al hacer hover */
  .imagen-con-boton:hover .ops_ordenar,
  .imagen-con-boton:hover .ops_filtrar {
    display: block;
  }

  button {
    cursor: pointer;
  }
  .active {
    color: black;
    background: white;
  }
  .gatos-con-estante {
    display: flex;
    justify-content: center;
    align-items: end;
    margin: auto;
    flex-wrap: wrap;
    row-gap: 0px;
    column-gap: 50px;
  }
  .techo {
    margin: auto;
    position: relative;

    bottom: -16px;
  }
  .mueble {
    margin: auto;
    background-color: #f0d786;
    margin: 0px 70px;

    border: 50px solid transparent;
    border-image-slice: 60;
    border-image-source: url("/images/estante-borde.svg");
  }
  .estante {
    height: 100%;
    width: 100%;
  }
  .piso {
    margin: auto;
    position: relative;
    margin: 0px 5px;
    bottom: 8px;
    z-index: 10;  
  }
  .container {
    display: flex;
    justify-content: center;
    align-items: end;
    margin: auto;
    flex-wrap: wrap;
    row-gap: 50px;
    column-gap: 50px;
  }
  .person-container {
    display: flex;
    position: relative;
    align-items: flex-end;
    justify-content: center;
    flex: 180px 0 0;
    width: 120px;

    height: 180px;
    margin: auto;
    height: 200px;

    /*
    display: flex;
    
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 180px 0 0;
    */
  }
  .person {
    position: absolute;
    /*
    bottom: -10px;
    */

    z-index: 3;
  }
  .manchas {
    bottom: -3.5%;
    position: absolute;
    mix-blend-mode: multiply;
    z-index: 3;
  }
  .person-color {
    position: absolute;
    /*
    left: 2%;
    right: 3.10%;
     */
    bottom: -4%;
  }

  .nombre-container {
    position: relative;   
    z-index: 100;         
    margin-top: 30px;
    text-align: center;
    background-image: url("/images/fondo-sticker.png");
    background-size: 190px;
    background-repeat: no-repeat;
    background-position: center;
    font-size: 16px;
    width: 150px;
    padding: 10px;
    transform: translateY(-20%);
    transition: all 0.3s ease;
    cursor: default;
  }

  .gato-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 176px;
    width: 200px;
    z-index: 100;
    transition: transform 0.4s ease-in-out;
  }
  .gato-interactivo {
    z-index: 900;
    position: absolute;
    opacity: 0;
  }
  @keyframes salto {
    0% {
      transform: translateY(0px);
    }
    15% {
      transform: translateY(-20px);
    }
    30% {
      transform: translateY(0px);
    }
    45% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .person-container,
  .nombre-container {
    transition: all 0.6s ease;
  }

  .gato-wrapper:hover {
    transform: scale(1.1);
    z-index: 1000;
  }

  .gato-wrapper:hover .nombre-container {
    transform: translateY(-20%);
    z-index: 1000;
  }

  .gato-wrapper:hover .person-container {
    animation: salto 1.4s ease-in-out infinite;
    z-index: 1000;
  }

  .gato-wrapper:hover {
    animation-play-state: paused;
    z-index: 1000;
  }

  .volver-a-guia {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 12px 20px;
    z-index: 1000;
    cursor: pointer;
    width: 100px;
    height: 60px;

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
  }
  .volver-a-guia:hover {
    filter: brightness(150%);
    background-color: #ffd6ec;
    border-color: #ffb6d1;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }
</style>
