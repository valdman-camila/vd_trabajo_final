<script>
  import SeleccionTipo from "/src/armarGato/SeleccionSerializacion.svelte";
  import SeleccionAltura from "/src/armarGato/SeleccionAltura.svelte";
  import SeleccionColor from "/src/armarGato/SeleccionColor.svelte";
  import SeleccionManchas from "/src/armarGato/SeleccionManchas.svelte";
  import Mancha from "/src/mancha.svelte";
  import Color from "/src/color.svelte";

  let paso = 0;

  let tipo = "Serializada";
  let altura = 260;
  let color;
  let cantidadManchas = 0;

  const avanzar = () => paso += 1;
</script>

<div class="contenedor">
  <!-- Contenedor del gato, fijo y separado del flujo -->
  <div class="person-container">
    {#if tipo === "Serializada"}
      <img class="person" src="/images/gatoDer.svg" alt="" style="width: {altura * 0.674}px; height: {altura}px;">
    {:else if tipo === "Episodica"}
      <img class="person" src="/images/gatoIzq.svg" alt="" style="width: {altura * 0.674}px; height: {altura}px;">
    {:else}
      <img class="person" src="/images/linea-gato-dos.svg" alt="" style="width: {altura * 0.674}px; height: {altura}px;">
    {/if}

    <div class="manchas">
      <Mancha tipo={tipo} cant={cantidadManchas} tamano={altura * 0.674} altura={altura} />
    </div>

    <div class="person-color">
      <Color tipo={tipo} tamano={altura * 0.674} altura={altura} color={color} />
    </div>
  </div>

  <!-- Componente actual según el paso -->
  {#if paso === 0}
    <SeleccionTipo bind:tipo on:next={avanzar} />
  {:else if paso === 1}
    <SeleccionAltura bind:altura on:next={avanzar} />
  {:else if paso === 2}
    <SeleccionColor bind:color on:next={avanzar} />
  {:else if paso === 3}
    <SeleccionManchas bind:cantidadManchas on:next={avanzar} />
  {/if}

  {#if paso >= 4}
    <p>¡Gato completo!</p>
  {/if}
</div>

<style>
  .contenedor {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    padding-bottom: 2rem;
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
    z-index: -1;
  }

  .selector-altura {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }
</style>
