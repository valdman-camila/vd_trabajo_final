<script>
  import * as d3 from "d3";
  export let peliculas = [];

  import Color from "/src/color.svelte";
  import Mancha from "/src/mancha.svelte";
  import { llamadoGato, gatoEspecifico } from '/src/store.js';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  function manejarClick(i, j) {
    llamadoGato.update(n => n + 1);
    gatoEspecifico.set(i + j * 4);
  }

  let mostrarBoton = false;

  function manejarScroll() {
    mostrarBoton = window.scrollY > 400;
  }

  onMount(() => {
    window.addEventListener('scroll', manejarScroll);
    return () => window.removeEventListener('scroll', manejarScroll);
  });

  let arr2 = [];
  let temp2 = [];

  let maxRating2, minRating2, diamRating2;
  let maxDuracion2, colorDuracion2;
  let maxVentas2, minVentas2, manchaVentas2;


  $: if (peliculas && peliculas.length > 0) {
    maxRating2 = d3.max(peliculas, d => +d.Rating);
    minRating2 = d3.min(peliculas, d => +d.Rating);
    diamRating2 = d3.scaleLinear().domain([minRating2, maxRating2]).range([80, 180]);

    maxDuracion2 = d3.max(peliculas, d => d.Duracion);
    colorDuracion2 = d3.scaleThreshold()
      .domain([50, 100, 150, 200])
      .range(["#FDF8F2", "#EFCFA9", "#DF9F53", "#AC6C20", "#6C4414"]);

    maxVentas2 = d3.max(peliculas, d => d.Ventas);
    minVentas2 = d3.min(peliculas, d => d.Ventas);
    manchaVentas2 = d3.scaleLinear().domain([minVentas2, maxVentas2]).range([1, 5]);


    arr2 = [];
    temp2 = [];
    for (let i = 0; i < peliculas.length; i++) {
      temp2.push(peliculas[i]);
      if ((i + 1) % 4 === 0 || (i + 1) === peliculas.length) {
        arr2.push(temp2);
        temp2 = [];
      }
    }
  }
</script>
{#if mostrarBoton}
  <button class="volver-a-guia"
          on:click={() => window.scrollTo({ top: document.getElementById("guia-container").offsetTop, behavior: "smooth" })}
          transition:fade>
    Volver a la guía
  </button>
{/if}
                    <img
            class="techo"
            src="./images/techoo.svg"
            alt="">
            
          <div class="mueble">
            
<div class="container">
    {#each arr2 as cuatroG, j}
      <!-- Iteramos la data para visualizar c/ entidad -->
      <div class= "gatos-con-estante">
      {#each cuatroG as pelicula,i}
      <div class="gato-wrapper">
      <div class="person-container">
        <button class="gato-interactivo" style="
              width: {diamRating2(pelicula.Rating)*0.634}px; 
              height: {diamRating2(pelicula.Rating)}px; " on:click={() => manejarClick(i,j)}><a href="#down">Click Here to Smoothly Scroll Down</a></button>

        {#if pelicula.Tipo == "1"}
          <img
            class="person"
            src="./images/gatoDer.svg"
            alt=""
            style="
              width: {diamRating2(pelicula.Rating)*0.634}px; 
              height: {diamRating2(pelicula.Rating)}px; ">

        {/if}
        {#if pelicula.Tipo == "2"}
 
          <img
            class="person"
            src="./images/gatoIzq.svg"
            alt=""
            style="
              width: {diamRating2(pelicula.Rating)*0.634}px; 
              height: {diamRating2(pelicula.Rating)}px; 

            ">
  
      {/if}
      {#if pelicula.Tipo =="3" || pelicula.Tipo=="4" ||pelicula.Tipo=="6"}
          <img
            class="person"
            src="./images/linea-gato-dos.svg"
            alt=""
            style="
              width: {diamRating2(pelicula.Rating)*0.634}px; 
              height: {diamRating2(pelicula.Rating)}px; 

            ">
      {/if}

        <div class= "manchas">
        <Mancha tipo={pelicula.Tipo} cant={manchaVentas2(pelicula.Ventas)} tamano={diamRating2(pelicula.Rating)*0.634} altura= {diamRating2(pelicula.Rating)}/>
        </div>
        <div class="person-color">
        <Color tipo={pelicula.Tipo} tamano={diamRating2(pelicula.Rating)*0.634} altura= {diamRating2(pelicula.Rating)} color={colorDuracion2(pelicula.Duracion)}/>
        </div>

      </div>
      <div class="nombre-container">
        <p>{pelicula.Nombre}</p>
      </div>
      </div>
      {/each}
          <img
        class="estante"
        src="./images/estante.svg"
        alt="">
       </div>     
    {/each}
    </div>
    </div>

<style>
  .gatos-con-estante{
            display: flex;
    justify-content: center;
    align-items: end;
    margin: auto;
    flex-wrap: wrap;
   row-gap: 0px;
    column-gap: 50px;
  }
  .techo{
      margin: auto;
        position: relative;
     width: 10011px;
     bottom: -16px;
  }
  .mueble{
  margin: auto;
    background-color: #dfcdaf;
      width: 1230px;
    height: 1420px;
 border: 50px solid transparent;
      border-image-slice: 60;
  border-image-source:url("/images/estante-borde.svg"); 
  }
.estante{
  
    height: 100%;
     width: 100%;
}
      .container{
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
    margin:auto;
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
  .manchas{
      bottom: -3.5%;
         position: absolute;
    mix-blend-mode: multiply;
    z-index: 3;
  }
    .person-color{
    position: absolute;
    /*
    left: 2%;
    right: 3.10%;
     */
    bottom: -4%;  



    

 
 

   

     
  }

  .nombre-container {
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
    transition: transform 0.4s ease-in-out;
  }
  .gato-interactivo{
    z-index: 900;
    position: absolute;
    opacity: 0;
  }
  @keyframes salto {
    0%   {transform: translateY(0px);}
    15%  {transform: translateY(-20px);}
    30%  {transform: translateY(0px);}
    45%  {transform: translateY(-10px);}
    60%  {transform: translateY(0px);}
    100% {transform: translateY(0px);}
  }


  .person-container, .nombre-container {
    transition: all 0.6s ease; 
  }

  .gato-wrapper:hover  {
    transform: scale(1.1);
  }

  .gato-wrapper:hover .nombre-container {
    transform: translateY(-20%);
  }

  .gato-wrapper:hover .person-container {
    animation: salto 1.4s ease-in-out infinite;
  }
  
  .gato-wrapper:hover {

     animation-play-state: paused;
  }

.volver-a-guia {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 12px 20px;
  z-index: 1000;
  cursor: pointer;

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