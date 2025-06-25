<script>
  //import {faPlay} from "@fortawesome/free-solid-svg-icons";
  //import {FontAwesomeIcon} from "@fortawesome/svelte-fontawesome";
  import {createEventDispatcher} from "svelte";

  export let cantidadManchas;

  const dispatch = createEventDispatcher();

  const incrementar = () => {
    if (cantidadManchas < 5) cantidadManchas += 1;
  };

  const decrementar = () => {
    if (cantidadManchas > 0) cantidadManchas -= 1;
  };

  const siguiente = () => {
    dispatch("next");
  };
</script>

<style>
  .selector-manchas {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .flechas {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .boton-flecha {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 2rem;
    padding: 0.2rem;
    transition: transform 0.2s;
  }

  .boton-flecha:hover {
    transform: scale(1.2);
  }

  .cantidad {
    font-size: 1.5rem;
    min-width: 2rem;
    text-align: center;
  }

  button {
    margin-top: 1rem;
  }
</style>

<div class="selector-manchas">
  <p>Elegí la cantidad de manchas</p>
  <div class="flechas">
    <button class="boton-flecha" on:click={decrementar}>
      <FontAwesomeIcon icon={faPlay} rotation={180} />
    </button>

    <span class="cantidad">{cantidadManchas}</span>

    <button class="boton-flecha" on:click={incrementar}>
      <FontAwesomeIcon icon={faPlay} />
    </button>
  </div>

  <button on:click={siguiente}>Siguiente</button>
</div>

