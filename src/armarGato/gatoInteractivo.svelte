<script>
  import SeleccionTipo from "/src/armarGato/SeleccionSerializacion.svelte";
  import SeleccionAltura from "/src/armarGato/SeleccionAltura.svelte";
  import SeleccionColor from "/src/armarGato/SeleccionColor.svelte";
  import SeleccionManchas from "/src/armarGato/SeleccionManchas.svelte";
  import Mancha from "/src/mancha.svelte";
  import Color from "/src/color.svelte";

  import { tick } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { jugadorGatoTerminado } from "/src/store.js";

  const dispatch = createEventDispatcher();

  let paso = 0;
  let tipo = "Serializada";
  let altura = 260;
  let color;
  let cantidadManchas = 0;
  let comenzar = false;

  const avanzar = () => (paso += 1);

  $: if (paso >= 2) {
    terminado();
  }

  function terminado() {
    jugadorGatoTerminado.set(true);
    dispatch("completo");
  }

  function empezar() {
    comenzar = true;
    tick().then(() => {
      const destino = document.getElementById("crea-tu-propio-gato");
      destino?.scrollIntoView({ behavior: "smooth" });
    });
  }
</script>

<img class="pasto" src="/images/pasto.png" alt="" />

{#if !comenzar}
  <div class="empezar">
    <div class="texto-empezar">
      <h1>¿Querés hacer tu propia serie?</h1>
      <p>Acompañame en este viaje</p>
    </div>

    <button class="boton-empezar" on:click={empezar}>Empezar</button>

    <img class="conejo-guia" src="/images/DosOjosCerradosConejo.svg" alt="" />
  </div>
  <div class="fondo-pasto"></div>
  <img class="piso-pasto" src="/images/piso-tierra.svg" alt="" />
{/if}

{#if comenzar}
  <div class="contenedor" id="crea-tu-propio-gato">
    <div class="person-container">
      {#if tipo === "Serializada"}
        <img
          class="person"
          src="/images/gatoDer.svg"
          alt=""
          style="width: {altura * 0.674}px; height: {altura}px;"
        />
      {:else if tipo === "Episodica"}
        <img
          class="person"
          src="/images/gatoIzq.svg"
          alt=""
          style="width: {altura * 0.674}px; height: {altura}px;"
        />
      {:else}
        <img
          class="person"
          src="/images/linea-gato-dos.svg"
          alt=""
          style="width: {altura * 0.674}px; height: {altura}px;"
        />
      {/if}

      <div class="manchas">
        <Mancha
          {tipo}
          cant={cantidadManchas}
          tamano={altura * 0.674}
          {altura}
        />
      </div>

      <div class="person-color">
        <Color {tipo} tamano={altura * 0.674} {altura} {color} />
      </div>
    </div>

    {#if paso === 0}
      <SeleccionTipo bind:tipo on:next={avanzar} />
    {:else if paso === 1}
      <SeleccionColor bind:color on:next={avanzar} />
    {/if}

    {#if paso >= 2}
      <p>Tu michi está listo!</p>
    {/if}
  </div>

  <img class="piso-pasto" src="/images/piso-tierra.svg" alt="" />
{/if}

<style>
  .piso-pasto {
    position: absolute;
  }
  .pasto {
    position: relative;
    bottom: -10px;
  }

  .empezar {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: #4caf50;
    padding: 2rem;
    font-size: large;
    font-weight: 100;
  }

  .texto-empezar h1 {
    font-size: 60px;
    font-weight: bold;
    color: #fdfeff;
    margin-bottom: 10px;
  }

  .texto-empezar p {
    font-size: 32px;
    color: #fdfeff;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .boton-empezar {
    background-color: #ffe4f0;
    color: #5b3c40;
    border: 2px solid #ffcce1;
    border-radius: 30px;
    padding: 12px 24px;
    font-size: 20px;
    font-weight: bold;
    font-family: "Pangolin", cursive;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .boton-empezar:hover {
    transform: scale(1.05);
    filter: brightness(150%);
  }

  .conejo-guia {
    width: 220px;
    margin-top: 2rem;
  }

  .contenedor {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    padding-bottom: 2rem;
    background-color: #4caf50;
  }

  .person-container {
    position: relative;
    height: 360px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 2rem;
  }

  .person {
    position: absolute;
    bottom: 0;
    z-index: 2;
  }

  .manchas,
  .person-color {
    position: absolute;
    bottom: -2%;
  }

  .manchas {
    z-index: 0;
  }

  .person-color {
    z-index: 1;
  }

  .selector-altura {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }

  p {
    color: white;
    font-size: 1.5rem;
  }
</style>
