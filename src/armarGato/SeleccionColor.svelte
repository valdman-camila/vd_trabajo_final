<script>
  import {createEventDispatcher} from "svelte";
  export let color;

  const dispatch = createEventDispatcher();

  const coloresDisponibles = [
    "#FDF8F2", 
    "#EFCFA9", 
    "#DF9F53", 
    "#AC6C20", 
    "#6C4414"  
  ];

  const seleccionar = (c) => {
    color = c;
  };

  const siguiente = () => {
    dispatch("next");
  };
</script>

<style>
  .selector-color {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .circulos {
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

<div class="selector-color">
  <p>Elegí el color del gato</p>
  <div class="circulos">
    {#each coloresDisponibles as c}
      <div
        class="circulo {c === color ? 'seleccionado' : ''}"
        style="background-color: {c}"
        on:click={() => seleccionar(c)}
      ></div>
    {/each}
  </div>

  <button on:click={siguiente}>Siguiente</button>
</div>



