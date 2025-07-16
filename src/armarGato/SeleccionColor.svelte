<script>
  import { createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";
  import { jugadorColor } from "/src/store.js";

  export let color;

  const dispatch = createEventDispatcher();

  const coloresDisponibles = [
    "#FDF8F2",
    "#EFCFA9",
    "#DF9F53",
    "#AC6C20",
    "#6C4414",
  ];

  const seleccionar = (c) => {
    color = c;
    jugadorColor.set(color);
  };

  const siguiente = () => {
    dispatch("next");
    jugadorColor.set(color);
  };
</script>

<div class="selector-color">
  <p>Elegí el color del gato</p>
  <div class="circulos">
    {#each coloresDisponibles as c (c)}
      <div
        class="circulo {c === color ? 'seleccionado' : ''}"
        style="background-color: {c}"
        on:click={() => seleccionar(c)}
        in:scale={{ duration: 300 }}
      ></div>
    {/each}
  </div>

  <button class="boton-siguiente" on:click={siguiente} disabled={!color}
    >Siguiente</button
  >
</div>

<style>
  .selector-color {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .circulos {
    display: flex;
    gap: 1.5rem;
    margin: 1.5rem 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .circulo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .circulo:hover {
    transform: scale(1.2);
  }

  .seleccionado {
    border-color: white;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
    transform: scale(1.1);
  }

  button {
    margin-top: 1rem;
  }

  p {
    color: white;
    font-size: 1.5rem;
  }
</style>
