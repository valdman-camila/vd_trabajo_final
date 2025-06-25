<script>
  import * as d3 from "d3"
  import atletas from "/src/data/athletes.csv"
  import series from "/src/data/SeriesYJuguetes.json"
  import peliculas from "/src/data/PeliculasYJuguetes.json"
  import Gatos from "/src/gatos.svelte"
  import Gatos2 from "/src/gatos2.svelte"
  import {llamadoGato, gatoEspecifico} from "/src/store.js"
  import CuadroGato from "/src/CuadroGato.svelte"
  import CuadroGato2 from "/src/CuadroGato2.svelte"
  import { fade, slide } from 'svelte/transition';

  console.log("series", series)
  console.log("peliculas", peliculas)

  /* 1. Escala para participaciones (cuantitativo > grosor) */
  const minMaxParticipations = d3.extent(atletas, (d) => d.participations)
  let grosorPartic = d3.scaleLinear()
    .domain(minMaxParticipations).range([2, 18])

  /* 2. Escala para medallas (cuantitativo > diámetro círculo) */
  const maxMedallas = d3.max(atletas, (d) => d.medallas)
  const diamMedallas = d3.scaleRadial()
    .domain([0, maxMedallas]).range([0, 100])

  /* 3. Escala para genero (categórico > color) */
  const colorGenero = d3.scaleOrdinal()
    .domain(["F", "M"])
    .range(["#F7DDBA", "#E4D9F2"])

  /* 4. Escala para continentes (categórico > color)   */
  const colorContinentes = d3
    .scaleOrdinal()
    .domain(["América", "África", "Asia", "Europa", "Oceanía"])
    .range(["#ed334e", "#000000", "#fbb132", "#009fe3", "#00963f"])

  let currentGuideImage = 'series';

  let currentDataType = 'series';

  $: currentData = currentDataType === 'series' ? series : peliculas;

  function abrirPopup() {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.getElementById('guia-visualizacion').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = '${scrollBarWidth}px';
  }

  function cerrarPopup() {
    document.getElementById('guia-visualizacion').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    currentGuideImage = 'series';
    $gatoEspecifico = undefined;
    llamadoGato.set(false);
  }

  function showPreviousGuideImage() {
        if (currentGuideImage === 'peliculas') {
            currentGuideImage = 'series';
        }
    }

  function showNextGuideImage() {
        if (currentGuideImage === 'series') {
            currentGuideImage = 'peliculas';
        }
    }

  function changeDataType(type) {
        currentDataType = type;
        $gatoEspecifico = undefined;
        llamadoGato.set(false);

  }
  document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.guia-button');
  const nube = document.querySelector('.fondo-nube'); 

  if (button && nube) {
    button.addEventListener('mouseenter', () => {
      nube.classList.add('nube-escalada');
    });

    button.addEventListener('mouseleave', () => {
      nube.classList.remove('nube-escalada');
    });
  }
});


</script>


<main>
  <div id="overlay" class="hidden">
    <div id="guia-visualizacion" class="guia-visualizacion hidden">
                  <button class="nav-arrow left-arrow" on:click={showPreviousGuideImage} disabled={currentGuideImage === 'series'}>&lt;</button>

            <div class="guia-image-wrapper">
                {#if currentGuideImage === 'series'}
                    <img
                        src="/images/GuiaVisualDeSeriesFinal.svg"
                        alt="Guía Visual de Series"
                        width="950"
                        in:fade={{ duration: 500 }}
                        out:fade={{ duration: 500 }}
                        class="guia-content-image"
                    />
                {:else if currentGuideImage === 'peliculas'}
                    <img
                        src="/images/GuiaVisualDePeliculasFinal2.svg"
                        alt="Guía Visual de Películas"
                        width="950"
                        in:fade={{ duration: 500 }}
                        out:fade={{ duration: 500 }}
                        class="guia-content-image"
                    />
                {/if}
            </div>

            <button class="nav-arrow right-arrow" on:click={showNextGuideImage} disabled={currentGuideImage === 'peliculas'}>&gt;</button>

    <button class="boton-cerrar-popup" on:click={cerrarPopup}>Cerrar</button>
  </div>
  </div>
  
  <div class="header">
    <p class="bajada">
     Durante décadas, muchas líneas de juguetes dieron origen a series animadas pensadas para promocionarlos. Esta colección recorre esas historias que nacieron del marketing y terminaron marcando infancias.
    </p>
  </div>

  
    <div id="guia-container">
      <img src="/images/nube.svg" class="fondo-nube" alt=""/>
      <button class="guia-button" on:click={abrirPopup}>
        <p>Guía de visualización</p>
      </button>
    </div>

 <div class="data-type-switcher">
        <button
            class="change-data-button"
            class:active={currentDataType === 'series'}
            on:click={() => changeDataType('series')}
        >
            Ver Series
        </button>
        
        <button
            class="change-data-button"
            class:active={currentDataType === 'peliculas'}
            on:click={() => changeDataType('peliculas')}
        >
            Ver Películas
        </button>
    </div>

    <div class="gatos-visualizacion">
   {#if currentDataType === 'series'}
           <Gatos series={series} />
    {:else if currentDataType === 'peliculas'}
      <Gatos2 peliculas={peliculas} />
   {/if}
 

    </div>
  
 <!--<Gatos series={series} />-->

{#if currentDataType === 'series'}
  <input type="checkbox" id="down" />
  <div class="seccion4" >
      {#if $gatoEspecifico !== undefined && series[$gatoEspecifico]}
        
          <CuadroGato/>
          <img class="fondo-nube-cuadro"
          src="./images/nube.svg"
          alt="">
          <div class="cuadro-texto"> 
            <h2>¿{series[$gatoEspecifico].Nombre} marcó tu infancia?</h2>
            {#if series[$gatoEspecifico].Tipo == "Ambas"}
              <p>Esta serie es tanto <strong>Episódica</strong> como <strong>Serializada</strong> y tiene <strong>{series[$gatoEspecifico].Duracion}</strong> episodios en total.</p>
            {:else}
              <p>Esta serie es <strong>{series[$gatoEspecifico].Tipo.toLowerCase()}</strong> y tiene <strong>{series[$gatoEspecifico].Duracion}</strong> episodios en total.</p>
            {/if}
            <p>Tiene un puntaje de <strong>{series[$gatoEspecifico].Rating}</strong> en IMBD y recaudó <strong>{series[$gatoEspecifico].Ventas.toLocaleString()}</strong> millones de dólares en ventas de juguetes. ¡Un montón!</p>
            <p>¿No te gustaría abrazar a <strong>{series[$gatoEspecifico].Nombre}</strong>?</p>
          </div>

      {/if}
      <label for="down"></label>
  </div>

  {:else if currentDataType === 'peliculas'}

     <input type="checkbox" id="down" />
  <div class="seccion4" >
      {#if $gatoEspecifico !== undefined && peliculas[$gatoEspecifico]}
        
          <CuadroGato2/>
          <img class="fondo-nube-cuadro"
          src="./images/nube.svg"
          alt="">
          <div class="cuadro-texto"> 
            <h2>¿{peliculas[$gatoEspecifico].Nombre} marcó tu infancia?</h2>
            {#if peliculas[$gatoEspecifico].Tipo =="2"}
              <p>Esta pelicula es parte de una saga de <strong>tres o más</strong> películas y dura <strong>{peliculas[$gatoEspecifico].Duracion}</strong> minutos.</p>
            {:else if peliculas[$gatoEspecifico].Tipo =="1"}
              <p>Esta pelicula no cuenta con otras que siguen su historia, es solo <strong>{peliculas[$gatoEspecifico].Tipo.toLowerCase()}</strong> y dura <strong>{peliculas[$gatoEspecifico].Duracion}</strong> minutos.</p>
             {:else}
              <p>Esta pelicula es parte de una saga de <strong>{peliculas[$gatoEspecifico].Tipo.toLowerCase()}</strong> películas y dura <strong>{peliculas[$gatoEspecifico].Duracion}</strong> minutos.</p>
              {/if}
            <p>Tiene un puntaje de <strong>{peliculas[$gatoEspecifico].Rating}</strong> en IMBD y recaudó <strong>{peliculas[$gatoEspecifico].Ventas.toLocaleString()}</strong> millones de dólares en ventas de juguetes. ¡Un montón!</p>
            <p>¿No te gustaría abrazar a <strong>{peliculas[$gatoEspecifico].Nombre}</strong>?</p>
          </div>

      {/if}
      <label for="down"></label>
  </div>
  

{/if}

</main>

<style>
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
    margin-top:10px;
  }
  .gatos-visualizacion{
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
  .guia-button, .fondo-nube {
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
    0%, 100% {transform: translate(0%, -40%);}
    50% {transform: translate(0%, -20%);}
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
    background:rgb(255, 255, 255);    
    z-index: 200;
    text-align: center;
    border-radius: 10%;
     display: flex; 
        align-items: center; 
        justify-content: space-between; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.2); 
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
  
  .seccion4 {
 
    display: grid;
    grid-template-columns: 2fr 2fr;
    margin-top: 60px;
    margin-bottom: 50px;
    
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
    cursor:default;
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
        transition: background-color 0.3s ease, transform 0.3s ease;
        z-index: 210; 
        color: #8E2F1A; 
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
        max-width: 100%; 
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

      .change-data-button {
        padding: 10px 25px;
        background-color: #ffffff; 
        color: #5b3c40; 
        border: 2px solid #7786e8; 
        border-radius: 25px;
        font-family: "Pangolin", cursive;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }

    .change-data-button:hover {
        background-color: #e9e9ff;
        border-color: #1e2c99;
        transform: translateY(-2px);
        box-shadow: 0 5px 10px rgba(0,0,0,0.15);
    }

    .change-data-button.active {
        background-color: #908cff;
        color: white;
        border-color: #1e209a;
        box-shadow: 0 5px 10px rgba(0,0,0,0.2);
        transform: translateY(-1px);
    }

</style>
