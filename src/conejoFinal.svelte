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
      src="/public/images/Ultimo_1.svg"
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
      src="/public/images/Ultimo_1.svg"
      alt="Conejo"
      style="width: 500px; height: 500px"
    />
  </div>
{/if}

<style>
  .speech {
    position: absolute;
    bottom: 450px;
    left: 0%;

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
    font-size: 25px;
    min-width: 150px;
    min-height: 400px;
    max-width: 800px;
    flex-wrap: wrap;
    width: 600px;
    z-index: 10;
  }
  .bunni-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 400px auto 0 auto;
    width: fit-content;
  }
</style>
