<script>
  import GatoJugador from './armarGato/GatoJugador.svelte';
  import { jugadorGatoTerminado, resultadoJuego1 } from './store.js';
  import { onMount } from 'svelte';

  let score = 0;
  let time = 30;
  let gameOver = false;
  let gameStart = true;

  let timerId;
  let isMovingLeft = false;
  let isMovingRight = false;

  let basket;
  let gameContainer;

  $: if (!gameStart && !gameOver) {
    moveLoop(); // activa el loop de movimiento continuo del gato
  }

  onMount(() => {
    basket = document.getElementById("basket");
    gameContainer = document.getElementById("game-container");

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  });

  function startGame() {
    if (!$jugadorGatoTerminado) return;

    score = 0;
    time = 30;
    gameOver = false;
    gameStart = false;
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

  function endGame() {
    clearInterval(timerId);
    gameOver = true;
    gameStart = true;
    alert(`Game Over! Your score: ${score}`);
    clearFruits();

    const altura = calcularAltura(score);
    resultadoJuego1.set(altura);
  }

  function calcularAltura(puntaje) {
    const min = 160;
    const max = 360;
    const maxPuntaje = 1000;
    return Math.round(min + ((Math.min(puntaje, maxPuntaje) / maxPuntaje) * (max - min)));
  }

  function createFruit() {
    if (gameOver) return;

    const fruit = document.createElement("div");
    fruit.className = "fruit";
    fruit.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 30)) + "px";
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
    } else if (isMovingRight && basketLeft + basket.offsetWidth < gameContainer.offsetWidth) {
      basket.style.left = basketLeft + 5 + "px";
    }
  }
</script>

<style>
  body {
    margin: 0;
    padding: 0;
    background: #121212;
    color: #eee;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .catch-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 40px;
    position: relative;
  }

  .titulo_juego {
    margin: 0 0 10px 0;
    font-size: 2.8rem;
    color: #4caf50;
    text-shadow: 0 0 8px #4caf50aa;
  }

  #tv-background {
    position: relative;
    width: 480px;
    height: 430px;
  }

  .bezel {
    position: absolute;
    width: 450px;
    height: 400px;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 2px 2px 8px #181818;
    background-image: radial-gradient(transparent 50%, #1e1d19);
    z-index: 10;
    border-radius: 12px;
  }

  .retro-tv {
    position: absolute;
    width: 480px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }

  #game-container {
    position: absolute;
    top: 15px;
    left: 50%;
    width: 400px;
    height: 400px;
    background: #000;
    border-radius: 10px;
    overflow: hidden;
    transform: translateX(-50%);
    z-index: 15;
  }

  .tv-interference {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 30;
    background: repeating-linear-gradient(
      0deg,
      rgba(255,255,255,0.1) 0px,
      rgba(255,255,255,0.1) 2px,
      rgba(0,0,0,0.1) 2px,
      rgba(0,0,0,0.1) 4px
    );
    animation: interferenceAnim 0.2s infinite;
    pointer-events: none;
    opacity: 0.9;
    mix-blend-mode: screen;
  }

  @keyframes interferenceAnim {
    0% { background-position: 0 0; }
    100% { background-position: 0 4px; }
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
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    user-select: none;
  }

  #start-button:disabled {
    background-color: #9ccc9c;
    cursor: not-allowed;
    box-shadow: none;
  }

  #start-button:hover:not(:disabled) {
    background-color: #45a049;
    box-shadow: 0 6px 14px rgba(69, 160, 73, 0.9);
  }

  .status-panel {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    gap: 25px;
    background: rgba(0,0,0,0.65);
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
    user-select: none;
  }
</style>

<div class="catch-container">
  <h1 class="titulo_juego">Catch the Fruit</h1>

  <div id="tv-background">
    <img class="bezel" src="/images/bezel.png" alt="TV Bezel" />
    <img class="retro-tv" src="/images/retro-tv.svg" alt="Retro TV" />

    <div id="game-container">
      {#if !$jugadorGatoTerminado}
        <div class="tv-interference"></div>
      {/if}

      <GatoJugador id="basket" />

      {#if $jugadorGatoTerminado && (gameStart || gameOver)}
        <button id="start-button" on:click={startGame}>
          {gameOver ? "Jugar otra vez" : "Comenzar juego"}
        </button>
      {/if}

      {#if !gameStart && !gameOver}
        <div class="status-panel">
          <div class="score">Score: {score}</div>
          <div class="time">Tiempo: {time}s</div>
        </div>
      {/if}
    </div>
  </div>
</div>
