<script>
  export let serializacion;
  export let altura;
  export let color;
  export let cantidadManchas;
</script>

<div class="container">
<div class="gato-preview">
  <img
    src={
      serializacion === "Serializada"
        ? "/images/gatoDer.svg"
        : serializacion === "Episodica"
        ? "/images/gatoIzq.svg"
        : "/images/linea-gato-dos.svg"
    }
    alt="Gato"
    style="height: {altura}px; filter: drop-shadow(2px 2px 0 {color});"
  />

  <div class="manchas">
    {#each Array(cantidadManchas) as _, i}
      <div
        class="mancha"
        style="top: {Math.random() * altura}px; left: {Math.random() * 150}px"
      ></div>
    {/each}
  </div>
</div>
</div>

<style>
  .gato-preview {
    position: absolute;
  }
  .manchas {
    position: absolute;
    top: 0;
    left: 0;
  }
  .mancha {
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    position: absolute;
  }
</style>
