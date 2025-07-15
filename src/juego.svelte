<script>
  import GatoJugador from "./armarGato/GatoJugador.svelte";

  import {
    jugadorGatoTerminado,
    resultadoJuego1,
    GatoTerminadoJuego1,
    Rating,
  } from "./store.js";
  import { onMount } from "svelte";

  let score = 0;
  let time = 30;
  let gameOver = false;
  let gameStart = true;
  let rating = 0.0;
  let timerId;
  let isMovingLeft = false;
  let isMovingRight = false;
  let empezar = false;
  let basket;
  let gameContainer;
  let gameStarted = false;
  const ratingRangos = [
    { min: 0, max: 100, ratingMin: 1.0, ratingMax: 2.0 },
    { min: 100, max: 250, ratingMin: 2.0, ratingMax: 3.2 },
    { min: 250, max: 400, ratingMin: 3.2, ratingMax: 4.3 },
    { min: 400, max: 550, ratingMin: 4.3, ratingMax: 5.8 },
    { min: 550, max: 700, ratingMin: 5.8, ratingMax: 6.5 },
    { min: 700, max: 850, ratingMin: 6.5, ratingMax: 7.2 },
    { min: 850, max: 950, ratingMin: 7.2, ratingMax: 7.9 },
    { min: 950, max: 1050, ratingMin: 7.9, ratingMax: 8.5 },
    { min: 1050, max: 1150, ratingMin: 8.5, ratingMax: 9.2 },
    { min: 1150, max: 1300, ratingMin: 9.2, ratingMax: 9.8 },
  ];
  $: if (!gameStart && !gameOver) {
    moveLoop();
  }

  onMount(() => {
    basket = document.getElementById("basket");
    gameContainer = document.getElementById("game-container");

    //   document.getElementById("catch-container").style.display = "none";

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  });

  function startGame() {
    if (!$jugadorGatoTerminado) return;
    // Asegurarse de que el basket esté en el DOM ahora
    basket = document.getElementById("basket");
    gameContainer = document.getElementById("game-container");
    score = 0;
    time = 2;
    gameOver = false;
    gameStart = false;
    gameStarted = true;
    clearFruits();
    if (basket) basket.style.left = "175px";

    timerId = setInterval(() => {
      if (time > 0) {
        time--;
      } else {
        endGame();
      }
    }, 1000);

    createFruit();
  }
  function mostrarModal(score) {
    document.getElementById("scoreText").textContent =
      "Tu rating es: " + rating;
    document.getElementById("gameOverModal").style.display = "flex";

    // setTimeout(() => {
    //     document.getElementById("gameOverModal").style.display = "none";
    // }, 2000); // 2000 milisegundos = 2 segundos
  }
  function cerrarModal() {
    document.getElementById("gameOverModal").style.display = "none";
  }
  function endGame() {
    clearInterval(timerId);
    gameOver = true;
    gameStart = true;
    clearFruits();

    const altura = calcularAltura(score);
    rating = calcularRating(score);
    Rating.set(rating);
    resultadoJuego1.set(altura);
    GatoTerminadoJuego1.set(true);
    mostrarModal(score);
    document.getElementById("basket").style.display = "none";
  }

  function calcularAltura(puntaje) {
    const min = 160;
    const max = 360;
    const maxPuntaje = 1000;
    return Math.round(
      min + (Math.min(puntaje, maxPuntaje) / maxPuntaje) * (max - min)
    );
  }
  function calcularRating(puntaje) {
    for (const rango of ratingRangos) {
      if (puntaje >= rango.min && puntaje < rango.max) {
        const progreso = (puntaje - rango.min) / (rango.max - rango.min);
        const rating =
          rango.ratingMin + progreso * (rango.ratingMax - rango.ratingMin);
        return Number(rating.toFixed(1)); // redondeamos a 1 decimal
      }
    }
    return 9.8; // si pasa el máximo
  }

  function createFruit() {
    if (gameOver) return;

    const fruit = document.createElement("div");
    fruit.className = "fruit";
    fruit.style.left =
      Math.floor(Math.random() * (gameContainer.offsetWidth - 30)) + "px";
    gameContainer.appendChild(fruit);

    moveFruit(fruit);
  }

  function moveFruit(fruit) {
    const fruitIntervalId = setInterval(() => {
      const fruitBottom = fruit.offsetTop + fruit.offsetHeight;
      const fruitLeft = fruit.offsetLeft;
      const fruitRight = fruitLeft + fruit.offsetWidth;
      const basketLeft = basket.offsetLeft;
      const basketRight = basketLeft + basket.offsetWidth;
      const basketTop = basket.offsetTop;
      const basketBottom = basketTop + basket.offsetHeight;

      if (fruitBottom >= gameContainer.offsetHeight) {
        clearInterval(fruitIntervalId);
        fruit.remove();
        if (!gameOver) createFruit();
      } else if (
        fruitBottom >= basketTop &&
        fruitLeft >= basketLeft &&
        fruitRight <= basketRight &&
        fruitBottom <= basketBottom
      ) {
        clearInterval(fruitIntervalId);
        fruit.remove();
        score += 50;
        if (!gameOver) createFruit();
      }

      fruit.style.top = fruit.offsetTop + 10 + "px";
    }, 50);
  }

  function clearFruits() {
    const fruits = document.getElementsByClassName("fruit");
    while (fruits.length > 0) {
      fruits[0].remove();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") isMovingLeft = true;
    if (event.key === "ArrowRight") isMovingRight = true;
  }

  function handleKeyUp(event) {
    if (event.key === "ArrowLeft") isMovingLeft = false;
    if (event.key === "ArrowRight") isMovingRight = false;
  }

  function moveLoop() {
    if (gameOver || gameStart) return;
    requestAnimationFrame(() => {
      moveBasket();
      moveLoop();
    });
  }

  function moveBasket() {
    if (!basket) return;

    let basketLeft = basket.offsetLeft;

    if (isMovingLeft && basketLeft > 0) {
      basket.style.left = basketLeft - 5 + "px";
    } else if (
      isMovingRight &&
      basketLeft + basket.offsetWidth < gameContainer.offsetWidth
    ) {
      basket.style.left = basketLeft + 5 + "px";
    }
  }
</script>

{#if $jugadorGatoTerminado}
  <div class="catch-container">
    <h1 class="titulo_juego">Entretené a tu audencia!</h1>

    <div id="tv-background">
      <img class="retro-tv" src="/images/tele_vieja3.svg" alt="Retro TV" />

      <div id="game-container">
        {#if !$jugadorGatoTerminado || gameOver}
          <div class="tv-interference-fondo"></div>
          <div class="tapar-gato"></div>
          <div class="tv-interference"></div>
        {/if}

        <GatoJugador id="basket" />
        <img class="bezel" src="/images/bezel.png" alt="TV Bezel" />

        {#if $jugadorGatoTerminado && !gameStarted}
          <button id="start-button" on:click={startGame}>Jugar</button>
        {/if}

        {#if !gameStart && !gameOver}
          <div class="status-panel">
            <div class="score">Puntaje: {score}</div>
            <div class="time">Tiempo: {time}s</div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
<div id="gameOverModal" class="modal">
  <div class="modal-content">
    <h2>¡Juego terminado!</h2>
    <p id="scoreText"></p>
    <button class="btn-cerrar" on:click={cerrarModal}>Cerrar</button>
  </div>
</div>

<style>
  body {
    margin: 0;
    padding: 0;

    color: #eee;
  }

  .catch-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 50px;
    position: relative;
    background-color: #4caf50;
  }

  .titulo_juego {
    margin: 0 0 10px 0;
    font-size: 2.8rem;
    color: white;
    text-shadow: 0 0 8px #4caf50;
  }

  #tv-background {
    position: relative;
    width: 456px;
    height: 334px;
  }

  .bezel {
    position: absolute;
    width: 450px;
    height: 100%;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);

    box-shadow: 2px 2px 8px #181818;
    background-image: radial-gradient(transparent 50%, #1e1d19);
    z-index: 20;
    border-radius: 12px;
  }

  .retro-tv {
    position: absolute;
    width: 633px;
    top: 77px;
    left: 50%;
    height: 512px;
    transform: translateX(-50%);
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }

  #game-container {
    position: absolute;
    top: 15%;
    left: 50%;
    width: 400px;
    height: 100%;
    margin-top: 20%;
    padding-top: 10%;
    border-radius: 15px;
    overflow: hidden;
    background-image: url("/images/fondo_juego.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transform: translateX(-50%);
    z-index: 15;
  }
  .tv-interference-fondo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: #1e1d19;
  }
  .tv-interference {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 19;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.1) 0px,
      rgba(255, 255, 255, 0.1) 2px,
      rgba(0, 0, 0, 0.1) 2px,
      rgba(0, 0, 0, 0.1) 4px
    );
    animation: interferenceAnim 0.2s infinite;
    pointer-events: none;
    opacity: 0.9;
    mix-blend-mode: screen;
  }

  @keyframes interferenceAnim {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 4px;
    }
  }

  #start-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50000;
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 16px 36px;
    font-size: 20px;
    cursor: pointer;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.7);
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
    user-select: none;
  }

  #start-button:disabled {
    background-color: #9ccc9c;
    cursor: not-allowed;
    box-shadow: none;
  }

  #start-button:hover:not(:disabled) {
    background-color: #ebf1e2;
    box-shadow: 0 6px 14px rgba(197, 227, 199, 0.9);
  }

  .status-panel {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    gap: 25px;
    background: rgba(0, 0, 0, 0.65);
    padding: 10px 20px;
    border-radius: 16px;
    box-shadow: 0 0 12px #4caf50aa;
    color: #4caf50;
    font-weight: 700;
    font-size: 1.3rem;
    user-select: none;
    z-index: 50;
  }

  #basket {
    width: 57px;
    height: 91px;
    position: absolute;
    bottom: 0;
    left: 175px;
    z-index: 45;
    user-select: none;
  }

  .fruit {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    background-image: url("/images/pez.svg");
    user-select: none;
  }
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.6);
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    animation: fadeInUp 0.4s ease;
    font-family: "Pangolin", cursive;
  }

  .modal-content h2 {
    font-size: 32px;
    color: #333;
    margin-bottom: 1rem;
  }

  .modal-content p {
    font-size: 20px;
    color: #555;
    margin-bottom: 2rem;
  }

  .btn-cerrar {
    background-color: #cc4c3b;
    color: white;
    border: none;
    padding: 14px 28px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(155, 49, 49, 0.7);
    transition:
      transform 0.2s ease,
      background-color 0.2s ease;
    font-family: "Pangolin", cursive;
  }

  .btn-cerrar:hover {
    transform: scale(1.05);
    background-color: #b93c2d;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tapar-gato {
    width: 70px;
    height: 91px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 19;
    user-select: none;
    background-color: #1e1d19;
  }
</style>
