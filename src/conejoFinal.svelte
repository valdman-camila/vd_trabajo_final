<script>
  import { jugadorTipo } from "/src/store.js";
  import { jugadorColor } from "/src/store.js";
  import { resultadoJuego1 } from "/src/store.js";
  import { resultadoJuego2 } from "/src/store.js";

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
  <div class="bunni-container">
    <div class="speech">
      ¡Y llegamos al final! Ahora que has visto cómo le fue a tu serie en
      comparación con las demás, ¿cómo la ves? ¿Le fue bien o crees que necesita
      una mejora? ¡Quizás una secuela sea lo que necesita para brillar aún más!
    </div>
    <img
      src="./public/images/Ultimo_1.svg"
      alt="Conejo"
      style="width: 500px; height: 500px"
    />
  </div>
{:else}
  <!-- <section class="seccion-graficos"></section> -->

  <div class="bunni-container">
    <div class="speech">
      Y así termina este viajecito por tus recuerdos. Gracias por venir. Nos
      vemos en la próxima aventura animada!
    </div>
    <img
      src="./public/images/Ultimo_1.svg"
      alt="Conejo"
      style="width: 500px; height: 500px"
    />
  </div>
{/if}

<style>
  .cuadro-final {
    margin-top: 3%;
    text-align: center;

    font-size: 21px;
    scale: 1;
    background-color: azure;
    animation-name: example;
    width: 50%;
    height: 50%;
    margin-left: 25%;
    margin-right: 25%;
    margin-bottom: 2%;
    animation-iteration-count: 1;
    animation-duration: 2.5s;
    padding: 2%;
    border-radius: 25px;
  }
  @keyframes example {
    0% {
      width: 50%;
      height: 50%;
    }
    50% {
      /* width: 70%;
    height: 70%; */
      scale: 1.15;
    }
    100% {
      width: 50%;
      height: 50%;
    }
  }
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
    height: 250px;
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
