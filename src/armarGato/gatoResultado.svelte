<script>
  import { jugadorTipo } from "/src/store.js";
  import { jugadorColor } from "/src/store.js";
  import { resultadoJuego1 } from "/src/store.js";
  import { resultadoJuego2 } from "/src/store.js";
  import { Rating } from "/src/store.js";
  import { Ventas } from "/src/store.js";
  import Color from "/src/color.svelte";
  import Mancha from "/src/mancha.svelte";

  export let altura = 90;
  export let cantidadManchas = 0;

  let min_episodios = 0;
  let max_episodios = 0;

  $: serializacion = $jugadorTipo;
  $: colorJugador = $jugadorColor;
  $: alturaJugador = $resultadoJuego1;
  $: manchasJugador = $resultadoJuego2;
  $: rating = $Rating;
  $: ventas = $Ventas;

  const duracionColores = [
    { rango: "< 50", min: 0, max: 49, color: "#FDF8F2" },
    { rango: "50 - 99", min: 50, max: 99, color: "#EFCFA9" },
    { rango: "100 - 149", min: 100, max: 149, color: "#DF9F53" },
    { rango: "150 - 199", min: 150, max: 199, color: "#AC6C20" },
    { rango: "≥ 200", min: 200, max: 400, color: "#6C4414" },
  ];
  function obtenerRangoPorColor(color) {
    if (!color) return null;

    const colorLimpio = color.trim().toLowerCase();
    const rango = duracionColores.find(
      (r) => r.color.toLowerCase() === colorLimpio
    );

    return rango
      ? { min: rango.min, max: rango.max, rangoTexto: rango.rango }
      : null;
  }
  $: {
    const rango = obtenerRangoPorColor($jugadorColor);
    console.log("Color actual:", $jugadorColor);
    console.log("Rango detectado:", rango);
    min_episodios = rango?.min ?? 0;
    max_episodios = rango?.max ?? 0;
  }
</script>

{#if alturaJugador !== null && manchasJugador !== null}
  <div class="final">
    <div class="cuadro-final">
      <div class="cuadro-texto">
        <h2>Este es tu gato!</h2>

        <p>
          Tu serie es {serializacion} y tiene entre {min_episodios} y {max_episodios}
          episodios.
        </p>

        <p>Un rating de: {rating}/10.</p>
        <p>Una ganancia de: {ventas} millones de dolares.</p>
      </div>
      <div class="contenedor">
        <div class="person-container">
          <img
            src={serializacion === "Serializada"
              ? "/images/gatoDer.svg"
              : serializacion === "Episodica"
                ? "/images/gatoIzq.svg"
                : "/images/linea-gato-dos.svg"}
            alt="Gato"
            class="gato"
            style="height: {alturaJugador}px"
          />

          <div class="person-color">
            <Color
              tipo={serializacion}
              tamano={alturaJugador * 0.674}
              altura={alturaJugador}
              color={colorJugador}
            />
          </div>

          <div class="manchas">
            <Mancha
              tipo={serializacion}
              cant={manchasJugador}
              tamano={alturaJugador * 0.674}
              altura={alturaJugador}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="message2">
    <img class="conejofoto" src="/images/WinkConejo.svg" alt="Conejo" />
    <div class="mensajedeconejo">
      ¡Excelente! Estos son los resultados de tu serie. Pero, ¿Por qué tuviste
      que participar en estos juegos para saber el rating y las ventas de tu
      serie? Bueno, veamos las estadísticas...
    </div>
  </div>

  <img class="piso-pasto" src="/images/piso-tierra.svg" alt="" />
{/if}

<style>
  .piso-pasto {
    position: absolute;
  }
  .final {
    background-color: #4caf50;
    display: flex;
    justify-content: center;
    padding: 2rem;
  }

  .cuadro-final {
    display: flex;
    flex-direction: column; /* ¡Ahora en columna! */
    align-items: center;
    justify-content: center;
    background-color: rgb(255, 255, 255);
    padding: 2rem;
    border-radius: 25px;
    animation-name: example;
    animation-duration: 2.5s;
    animation-iteration-count: 1;
    max-width: 800px;
    width: 100%;
    text-align: center;
    gap: 2rem;
    color: rgb(9, 9, 9);
  }

  .cuadro-texto {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
  }

  .person-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .gato {
    position: relative;
    z-index: 1;
    height: auto;
    max-width: 100%;
  }

  .manchas {
    position: absolute;
    z-index: 0;
    transform: translateX(-1%);
    bottom: -4%;
    mix-blend-mode: multiply;
  }

  .person-color {
    z-index: 0;
    position: absolute;

    bottom: -4%;
  }

  @keyframes example {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }

  .message2 {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    font-size: 1.1rem;
    text-align: left;
  }

  .conejofoto {
    height: 300px;
    width: auto;
  }
</style>
