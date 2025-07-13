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



  }


  let orden = ""
  let filtro = "todas"
	let resaltar = "todas"
  $: seriePelicu = peliculas;
  function agruparCuatro( lista){
    let filas=[];
     let temp2=[];
  for(let i = 0; i < seriePelicu.length; i++){
            temp2.push(seriePelicu[i]);
      if((i+1) % 4 == 0 || (i + 1) == seriePelicu.length){
        filas.push(temp2);
        temp2=[];
      } 
  }
  return filas;
}
  
  let textoBotonO = 'Ordenar por ▾';
   let textoBtnF="Filtrar por ▾";
   let serieFiltrar=peliculas

  function orderSelection(opcion) {
    orden = opcion;

    // Cambiar el texto del botón basado en la opción seleccionada
    switch (opcion) {
      case 'orden_ventas':
        textoBotonO = 'Más ventas';
        seriePelicu = d3.sort(seriePelicu, s => s.Ventas)
        seriePelicu= d3.reverse(seriePelicu)
        
        
        break;
      case 'orden_tipo':
        textoBotonO = 'Por tipo';
        seriePelicu = d3.sort(seriePelicu, escena => escena.Tipo)
        
        break;
      case 'orden_rating':
        textoBotonO = 'Por rating';
        seriePelicu = d3.sort(seriePelicu, escena => escena.Rating)
        seriePelicu= d3.reverse(seriePelicu)
        
        break;
      case 'orden_duracion':
        textoBotonO = 'Por duración';
        seriePelicu = d3.sort(seriePelicu, escena => escena.Duracion)
        seriePelicu= d3.reverse(seriePelicu)
        
        break;
      default:
        textoBotonO = 'Ordenar por ▾';
        seriePelicu = peliculas


    }
    arr2=agruparCuatro(seriePelicu)
  }


  function manejarScroll2() {
    mostrarBoton = window.scrollY > 400 && window.scrollY < 2300; 
  }

  onMount(() => {
    window.addEventListener('scroll', manejarScroll2);
        arr2=agruparCuatro(peliculas)
    return () => window.removeEventListener('scroll', manejarScroll2);
  })
  function filtertresomas(elem){
    return elem =="4" && elem=="6"
  }

function filterSelection(valorFilter){
  filtro=valorFilter
    // Cambiar el texto del botón basado en la opción seleccionada
    switch (valorFilter) {
      case "1":
        textoBtnF = "Una pelicula";

    seriePelicu = peliculas.filter(p => p.Tipo == filtro)

        break;
      case "2":
        textoBtnF = "Dos peliculas";

         seriePelicu = peliculas.filter(p => p.Tipo == filtro)
        break;
     case "3":
        textoBtnF = "Tres o más películas";
        // Convertimos a número y filtramos si Tipo >= 3
        seriePelicu = peliculas.filter(p => Number(p.Tipo) >= 3);
        break;
      case 'todas':
        textoBtnF = 'Filtrar por ▾';

        seriePelicu = peliculas

        break;
      default:
        textoBtnF = 'Filtrar por ▾';

        seriePelicu = peliculas

    }
    arr2=agruparCuatro(seriePelicu)
  }
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
    currentGuideImage = 'peliculas';
    $gatoEspecifico = undefined;
    llamadoGato.set(false);
  }
</script>
{#if mostrarBoton}
  <button class="volver-a-guia"
          on:click={abrirPopup}
          transition:fade>
    Guía
  </button>
{/if}
<div class="techo-container">
<div class="ordenar">
  <img class="imagen_orden" src="./images/orden_boton.svg" alt="">
  <div class="container_btn_ordenar">
    <!-- El texto del botón cambia según la selección -->
    <button class="boton_ordenar">{textoBotonO}</button>

    <div class="ops_ordenar">
      <button on:click={() => orderSelection("orden_ventas")} class:active={orden == "orden_ventas"}>Más ventas</button>
      <button on:click={() => orderSelection("orden_tipo")} class:active={orden == "orden_tipo"}>Por tipo</button>
      <button on:click={() => orderSelection("orden_rating")} class:active={orden == "orden_rating"}>Por rating</button>
      <button on:click={() => orderSelection("orden_duracion")} class:active={orden == "orden_duracion"}>Por duración</button>
    </div>
  </div>
</div>

  <div class="filtrar">
    <img class="imagen_filtrar" src="./images/filtro_boton.svg" alt="">
    <button class="boton_filtrar">{textoBtnF}</button>
    <div class=ops_filtrar>
      <button on:click={() => filterSelection("todas")} class:active={filtro == "todas"}>Todas</button>
      <button on:click={() => filterSelection("1")} class:active={filtro == "1"}>Una pelicula</button>
      <button on:click={() => filterSelection("2")} class:active={filtro == "2"}>Dos peliculas</button>
      <button on:click={() => filterSelection("3")} class:active={filtro == "3"}>Tres o más peliculas</button>
    </div>
  </div> 
    <img class="techo" src="./images/techoo.svg" alt="">
</div>         
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
  <img class="piso" src="./images/piso-mueble.svg" alt=""> 

<style>
    .ordenar {
      position: relative;

              margin-top: 20%;
    margin-left: 35%;



    }

    .imagen_orden{
    width: 250px;
    /* top: 610%; 
    left: 50%; */
margin-top: 23%;
    margin-left: 39%;
    position: absolute;

    z-index: 1;
    }

    .boton_ordenar {
      position: absolute;
        /* box-shadow: 0 5px 10px rgba(0,0,0,0.2); */
      height: 50px;
          width: 160px;
     margin-top: 25%;
    margin-left: 47%;
    /* top: 496px;
    left: 38%; */
      background-color: #F6F5EA;
      color: black;
      /* padding: 10px 16px; */
      font-size: 23px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
    user-select: none;
    z-index: 50;
        font-family: "Pangolin", cursive;

    }

    .ops_ordenar {

      width: 150px;
    font-family: "Pangolin", cursive;
      display: none;
    margin-top: 30%;
    margin-left: 48%;
    position: absolute;
      background-color: #F6F5EA;
  
      /* box-shadow: 0px 8px 16px rgba(0,0,0,0.2); */
      border-radius: 4px;
      z-index: 1;
    }

    .ops_ordenar button {
      font-family: "Pangolin", cursive;
      color: black;
      padding: 10px 14px;
      text-align: left;
      text-decoration: none;
      background: none;
      border: none;
      width: 100%;
      cursor: pointer;
    }

    .ops_ordenar button:hover {
      background-color: #F0D786;
    }

    .ordenar:hover .ops_ordenar {
      display: block;
    }
    
    .filtrar {
      position: relative;
     

    margin-left: 35%;
    margin-bottom: 20%;


    }
    .imagen_filtrar{
    width: 250px;
    /* top: 610%; 
    left: 50%; */
    margin-top: 23%;
    margin-left: -5%;
    position: absolute;

    z-index: 1;
    }

    .boton_filtrar {

      position: absolute;
    font-family: "Pangolin", cursive;
      height: 50px;
          width: 160px;
margin-top: 25%;
    margin-left: 2%;
      background-color: #F6F5EA;
      color: black;
      /* padding: 10px 16px; */
      font-size: 23px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
    user-select: none;
    z-index: 50;
    }

    .ops_filtrar {

      background-color: #F6F5EA;
        width: 150px;
    font-family: "Pangolin", cursive;
      display: none;
    margin-top: 30%;
    margin-left: 2%;
    position: absolute;
      /* box-shadow: 0px 8px 16px rgba(0,0,0,0.2); */
      border-radius: 4px;
      z-index: 1;
    }

    .ops_filtrar button {
          font-family: "Pangolin", cursive;
      color: black;
      padding: 10px 14px;
      text-align: left;
      text-decoration: none;
      background: none;
      border: none;
      width: 100%;
      cursor: pointer;
    }

    .ops_filtrar button:hover {
      background-color: #F0D786;
    }

    .filtrar:hover .ops_filtrar {
      display: block;
    }


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
        background-color: #F0D786;
    margin: 0px 70px;

    border: 50px solid transparent;
          border-image-slice: 60;
      border-image-source:url("/images/estante-borde.svg"); 
    }
  .estante{
    
      height: 100%;
      width: 100%;
      
  }
  .piso{
          margin: auto;
          position: relative;
  margin: 0px 5px;
            bottom: 8px;
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