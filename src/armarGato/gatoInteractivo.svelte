<script>
  import SeleccionTipo from "/src/armarGato/SeleccionSerializacion.svelte";
  import SeleccionAltura from "/src/armarGato/SeleccionAltura.svelte";
  import SeleccionColor from "/src/armarGato/SeleccionColor.svelte";
  import SeleccionManchas from "/src/armarGato/SeleccionManchas.svelte";
  import Mancha from "/src/mancha.svelte";
  import Color from "/src/color.svelte";

  import { tick } from "svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { jugadorGatoTerminado } from "/src/store.js";

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
      <h1>Queres hacer tu propia serie?</h1>
      <p>Acompañame en este vieje</p>
    </div>
    <img class="conejo-guia" src="/images/DosOjosCerradosConejo.svg" alt="" />
    <button class="boton-empezar" on:click={empezar}>Empezar</button>
  </div>
{/if}
{#if comenzar}
  <div class="contenedor" id="crea-tu-propio-gato">
    <!-- Contenedor del gato, fijo y separado del flujo -->
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

    <!-- Componente actual según el paso -->
    {#if paso === 0}
      <SeleccionTipo bind:tipo on:next={avanzar} />
      <!--{:else if paso === 2}
    <SeleccionAltura bind:altura on:next={avanzar} />
  {:else if paso === 1}
    <SeleccionColor bind:color on:next={avanzar} />
  {:else if paso === 3}
    <SeleccionManchas bind:cantidadManchas on:next={avanzar} />-->
    {:else if paso === 1}
      <SeleccionColor bind:color on:next={avanzar} />
    {/if}

    {#if paso >= 2}
      <p>¡Gato completo!</p>
    {/if}
  </div>
{/if}

<style>
  .pasto {
    position: relative;

    bottom: -10px;
  }
  .texto-empezar h1 {
    font-size: 80px;
    font-weight: bold;
    color: #fdfeff;
    margin-top: 7%;
    margin-bottom: 2%;
  }
  .texto-empezar p {
    font-size: 50px;

    color: #fdfeff;
  }

  .empezar {
    text-align: justify;
    background-color: #4caf50;

    /* border-radius: 10px; */
    padding: 2rem;

    /* max-width: 1000px;
    max-height: 1000px; */

    font-size: large;
    font-weight: 100;
  }
  .conejo-guia {
    width: 250px;
    position: absolute;
    margin-left: 70%;
    margin-top: -15%;
    /* animation: saltito 2s infinite; */
  }

  @keyframes saltito {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  .boton-empezar {
    background-color: #ffffff;
    color: #000000;
    padding: 2rem;
    font-size: 1.2rem;
    margin: 20px 2px;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }

  .boton-empezar:hover {
    transform: scale(1.1);
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
</style>
