<script>
  import {createEventDispatcher} from "svelte";
  export let altura;

  const dispatch = createEventDispatcher();

  const siguiente = () => {
    dispatch("next");
  };
</script>

<div class="selector-altura">
  <label for="altura-slider">Altura del gato</label>
  <input
    id="altura-slider"
    type="range"
    min="160"
    max="360"
    bind:value={altura}
  />
  <p>{altura}px</p>
</div>

<button on:click={siguiente}>Siguiente</button>

<style>
    .selector-altura {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

  .botones {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  .circulo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
  }

  .seleccionado {
    border-color: black;
  }

</style>