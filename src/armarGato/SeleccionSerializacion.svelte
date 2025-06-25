<script>
  import {createEventDispatcher} from "svelte";
  export let tipo;
  //import {faPlay} from "@fortawesome/free-solid-svg-icons";
  //import {FontAwesomeIcon} from "@fortawesome/svelte-fontawesome";

  const dispatch = createEventDispatcher();

  const opciones = ["Serializada", "Episodica", "Ambas"];
  let index = opciones.indexOf(tipo);

  const cambiar = (dir) => {
    index = (index + dir + opciones.length) % opciones.length;
    tipo = opciones[index];
  };

  const siguiente = () => {
    dispatch("next");
  };
  
</script>

<div class="selector-tipo">
<div class="botones">
  <button class="boton-flecha" on:click={() => cambiar(-1)}><FontAwesomeIcon icon={faPlay} rotation={180} /></button>
  <span>{tipo}</span>
  <button class="boton-flecha" on:click={() => cambiar(1)}><FontAwesomeIcon icon={faPlay} /></button>
</div>
<button on:click={siguiente}>Siguiente</button>
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
</style>