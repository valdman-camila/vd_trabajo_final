<script>
    import {jugadorTipo} from '/src/store.js';
    import {jugadorColor} from '/src/store.js';
    import Color from "/src/color.svelte";
    
    export let altura = 91; // default del juego
    export let cantidadManchas = 0;

    $: serializacion = $jugadorTipo;
    $: colorJugador = $jugadorColor;
  
</script>

<!-- Este div reemplaza directamente al basket original -->
<div id="basket">
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
  />

    <div class="person-color">
      <Color tipo={serializacion} tamano={91 * 0.674} altura={91} color={colorJugador} />
    </div>
</div>

<style>
  #basket {
    width: 57px;
    height: 91px;
    position: absolute;
    bottom: 0;
    z-index: 10;
  }

  .gato {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
  }

  .manchas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
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
    bottom: -7%;
    left: -4%;
  }
</style>
