<script>
  import {jugadorTipo} from '/src/store.js';
  import {jugadorColor} from '/src/store.js';
  import {resultadoJuego1} from '/src/store.js';
  import {resultadoJuego2} from '/src/store.js';

  import Color from "/src/color.svelte";
  import Mancha from "/src/mancha.svelte";

  export let altura = 90;
  export let cantidadManchas = 0;

  $: serializacion = $jugadorTipo;
  $: colorJugador = $jugadorColor;
  $: alturaJugador = $resultadoJuego1;
  $: manchasJugador = $resultadoJuego2;
</script>

{#if alturaJugador !== null && manchasJugador !== null}
<div class="contenedor">
  <div class="person-container">
    <img
      src={
        serializacion === "Serializada"
          ? "/images/gatoDer.svg"
          : serializacion === "Episodica"
          ? "/images/gatoIzq.svg"
          : "/images/linea-gato-dos.svg"
      }
      alt="Gato"
      class="gato"
      style="height: {alturaJugador}px"
    />

    <div class="person-color">
      <Color tipo={serializacion} tamano={alturaJugador * 0.674} altura={alturaJugador} color={colorJugador} />
    </div>

    <div class="manchas">
      <Mancha tipo={serializacion} cant={manchasJugador} tamano={alturaJugador * 0.674} altura={alturaJugador} />
    </div>
  </div>
</div>
{/if}

<style>
  .contenedor {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    padding-bottom: 2rem;
  }

  .person-container {
    position: relative;
    height: 360px; 
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 2rem;
  }

  .gato {
    position: relative;
    z-index: 1;
  }

  .manchas {
    position: absolute;
    z-index: 0;
    transform: translateX(2%);
    bottom: -2%;
    mix-blend-mode: multiply;
  }

  .mancha {
    width: 10px;
    height: 10px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    position: absolute;
  }

  .person-color {
    z-index: -1;
    position: absolute;
    transform: translateX(2%);
    bottom: -2%;
  }
</style>
