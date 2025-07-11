<script>
  import {createEventDispatcher} from "svelte";
  export let tipo;
  import {faPlay} from "@fortawesome/free-solid-svg-icons";
  import {FontAwesomeIcon} from "@fortawesome/svelte-fontawesome";
  import {jugadorTipo} from '/src/store.js';

  const dispatch = createEventDispatcher();

  const opciones = ["Serializada", "Episodica", "Ambas"];
  let index = opciones.indexOf(tipo);

  const cambiar = (dir) => {
    index = (index + dir + opciones.length) % opciones.length;
    tipo = opciones[index];
    jugadorTipo.set(tipo);
  };

  const siguiente = () => {
    jugadorTipo.set(tipo);
    dispatch("next");
  };
</script>

<div class="selector-tipo">
  <div class="botones">
    <button class="boton-flecha" data-dir="left" on:click={() => cambiar(-1)}>
      <FontAwesomeIcon icon={faPlay} rotation={180} />
    </button>
    <span class="texto-tipo">{tipo}</span>
    <button class="boton-flecha" data-dir="right" on:click={() => cambiar(1)}>
      <FontAwesomeIcon icon={faPlay} />
    </button>
  </div>
  <button class="boton-siguiente" on:click={siguiente}>Siguiente</button>
</div>

<style>
  .selector-tipo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .botones {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    align-items: center;
  }

  .boton-flecha {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 2rem;
    padding: 0.2rem;
    transition: transform 0.2s ease;
  }

  .boton-flecha:hover {
    transform: scale(1.3);
  }

  .boton-flecha:active {
    transform: scale(0.9);
  }

  .boton-flecha[data-dir="left"]:active {
    transform: scale(0.9) translateX(-4px);
  }

  .boton-flecha[data-dir="right"]:active {
    transform: scale(0.9) translateX(4px);
  }

  .texto-tipo {
    font-size: 1.5rem;
    transition: opacity 0.3s ease;
  }
</style>
