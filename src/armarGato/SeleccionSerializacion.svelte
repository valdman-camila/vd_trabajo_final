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
  <p>Elegí si tu serie va a ser serializada o no</p>
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

  .boton-flecha {
    margin-top: 20px;
    height: 56px;
    width: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background-color: #ffe4f0;
    color: #5b3c40;
    border-radius: 50%;
    font-size: 22px;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    font-family: "Pangolin", cursive;
  }


  .boton-flecha:hover {
    transform: scale(1.3);
    filter: brightness(150%);
    background-color: #ffd6ec;
    border-color: #ffb6d1;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
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

  .botones {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    align-items: center; /* Esto ya está bien */
    justify-content: center;
  }

  .texto-tipo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px; /* Igual altura que .boton-flecha */
    padding: 0 24px; /* Margen horizontal */
    font-size: 1.5rem;
    font-family: "Pangolin", cursive;
    color: white;
    border-radius: 30px;
    line-height: 1;
    margin-top: 20px; /* igual que .boton-flecha para alineación vertical */
  }
  p {
    color: white;
    font-size: 1.5rem;
  }
</style>
