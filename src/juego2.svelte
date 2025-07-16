<script>
  import * as d3 from "d3";
  import GatoJugador from "./armarGato/GatoJugador.svelte";
  import {
    jugadorGatoTerminado,
    resultadoJuego2,
    GatoTerminadoJuego1,
    Ventas,
  } from "./store.js";
  import { onMount } from "svelte";

  let tileSize = 32;
  let rows = 16;
  let columns = 16;
  let board, context, playerDiv;

  let boardWidth = tileSize * columns;
  let boardHeight = tileSize * rows;

  let shipWidth = tileSize * 2;
  let shipHeight = tileSize;
  let shipX = (tileSize * columns) / 2 - tileSize;
  let shipY = tileSize * rows - tileSize * 2;

  let ship = { x: shipX, y: shipY, width: shipWidth, height: shipHeight };
  let shipImg;
  let shipVelocityX = tileSize;

  let alienArray = [],
    alienImg;
  let alienWidth = tileSize * 2;
  let alienHeight = tileSize;
  let alienX = tileSize;
  let alienY = tileSize;
  let alienRows = 2,
    alienColumns = 3,
    alienCount = 0;
  let alienVelocityX = 0.5;

  let bulletArray = [];
  let bulletVelocityY = -10;

  let score = 0;
  let gameOver = false;
  let gameStarted = false;
  let ganancia = 0;
  const gananciaRangos = [
    { min: 0, max: 2000, gananciaMin: 0, gananciaMax: 50 },
    { min: 2000, max: 4000, gananciaMin: 50, gananciaMax: 120 },
    { min: 4000, max: 6000, gananciaMin: 120, gananciaMax: 200 },
    { min: 6000, max: 8000, gananciaMin: 200, gananciaMax: 320 },
    { min: 8000, max: 10000, gananciaMin: 320, gananciaMax: 450 },
    { min: 10000, max: 12000, gananciaMin: 450, gananciaMax: 600 },
    { min: 12000, max: 14000, gananciaMin: 600, gananciaMax: 720 },
    { min: 14000, max: 16000, gananciaMin: 720, gananciaMax: 830 },
    { min: 16000, max: 18000, gananciaMin: 830, gananciaMax: 930 },
    { min: 18000, max: Infinity, gananciaMin: 930, gananciaMax: 1000 },
  ];
  let manchaScore = d3.scaleLinear().domain([0, 20000]).range([1, 5]);

  onMount(() => {
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keydown", shoot);
  });

  function startGame() {
    if (!gameStarted && $GatoTerminadoJuego1) {
      board = document.getElementById("board");
      board.width = boardWidth;
      board.height = boardHeight;
      context = board.getContext("2d");

      playerDiv = document.getElementById("player-character");
      if (playerDiv) {
        playerDiv.style.position = "absolute";
        playerDiv.style.width = ship.width + "px";
        playerDiv.style.height = ship.height + "px";
        playerDiv.style.left = board.offsetLeft + ship.x + "px";
        playerDiv.style.top = board.offsetTop + ship.y + "px";
        playerDiv.style.display = "block";
      }

      shipImg = new Image();
      shipImg.src = "/images/ship.png";

      alienImg = new Image();
      alienImg.src = "/images/perro_malo_marron.svg";

      gameStarted = true;
      gameOver = false;
      score = 0;
      alienVelocityX = 3;
      alienRows = 2;
      alienColumns = 3;
      alienArray = [];
      bulletArray = [];
      ship.x = shipX;
      ship.y = shipY;

      createAliens();
      requestAnimationFrame(update);
    }
  }

  function update() {
    requestAnimationFrame(update);

    if (gameOver || !gameStarted) return;

    context.clearRect(0, 0, board.width, board.height);
    if (playerDiv) {
      playerDiv.style.left = board.offsetLeft + ship.x + "px";
      playerDiv.style.top = board.offsetTop + ship.y + "px";
    }

    for (let alien of alienArray) {
      if (alien.alive) {
        alien.x += alienVelocityX;
        if (alien.x + alien.width >= board.width || alien.x <= 0) {
          alienVelocityX *= -1;
          alien.x += alienVelocityX * 2;
          alienArray.forEach((a) => (a.y += alienHeight));
        }
        context.drawImage(
          alienImg,
          alien.x,
          alien.y,
          alien.width,
          alien.height
        );
        if (alien.y >= ship.y) endGame();
      }
    }

    for (let bullet of bulletArray) {
      bullet.y += bulletVelocityY;
      context.fillStyle = "#00B3FA";
      context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

      for (let alien of alienArray) {
        if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
          bullet.used = true;
          alien.alive = false;
          alienCount--;
          score += 100;
        }
      }
    }

    bulletArray = bulletArray.filter((b) => !b.used && b.y >= 0);

    if (alienCount == 0) {
      score += alienColumns * alienRows * 100;
      alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
      alienRows = Math.min(alienRows + 1, rows - 4);
      alienVelocityX += alienVelocityX > 0 ? 0.2 : -0.2;
      alienArray = [];
      bulletArray = [];
      createAliens();
    }

    context.fillStyle = "black";
    context.font = "16px Pangolin";
    context.fillText(score, 5, 20);
  }

  function endGame() {
    gameOver = true;
    gameStarted = false;

    let manchas = manchaScore(score);
    resultadoJuego2.set(manchas);
    ganancia = calcularVentas(score);
    Ventas.set(ganancia);
    document.getElementById("pasto").style.display = "none";
    setTimeout(() => {
      document.getElementById("gameOverModal").style.display = "flex";
      document.getElementById("scoreText").textContent =
        "Tus ganacias son: " + ganancia;
    }, 200);
  }
  function calcularVentas(puntaje) {
    for (const rango of gananciaRangos) {
      if (puntaje >= rango.min && puntaje < rango.max) {
        const progreso = (puntaje - rango.min) / (rango.max - rango.min);
        const ganancia =
          rango.gananciaMin +
          progreso * (rango.gananciaMax - rango.gananciaMin);
        return Number(ganancia.toFixed(1)); // en millones
      }
    }
    return 1000; // por si está fuera del rango
  }

  function cerrarModal() {
    document.getElementById("gameOverModal").style.display = "none";
  }

  function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
      for (let r = 0; r < alienRows; r++) {
        alienArray.push({
          img: alienImg,
          x: alienX + c * alienWidth,
          y: alienY + r * alienHeight,
          width: alienWidth,
          height: alienHeight,
          alive: true,
        });
      }
    }
    alienCount = alienArray.length;
  }

  function moveShip(e) {
    if (gameOver || !gameStarted) return;
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
      ship.x -= shipVelocityX;
    } else if (
      e.code == "ArrowRight" &&
      ship.x + shipVelocityX + ship.width <= board.width
    ) {
      ship.x += shipVelocityX;
    }
  }

  function shoot(e) {
    if (gameOver || !gameStarted) return;
    if (e.code == "Space") {
      e.preventDefault();
      bulletArray.push({
        x: ship.x + (shipWidth * 15) / 32,
        y: ship.y,
        width: tileSize / 8,
        height: tileSize / 2,
        used: false,
      });
    }
  }

  function detectCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
</script>

{#if $GatoTerminadoJuego1}
  <div class="space-container">
    <h1 class="titulo_juego">Vencé a tu competencia!</h1>
    <div class="instrucciones-juego">
      Movete con las flechas ⬅️ ➡️ y presioná <strong>ESPACIO</strong> para disparar.
      ¡Derrotá a los perros y ganá puntos antes de que se te acabe el tiempo!
    </div>
    <canvas id="board"></canvas>

    <div id="player-character" style="display: none;">
      <GatoJugador />
    </div>

    {#if $jugadorGatoTerminado && !gameStarted && !gameOver}
      <button id="start-button" on:click={startGame}>Jugar</button>
    {/if}
  </div>
  <img id="pasto" class="piso-pasto" src="/images/piso-tierra.svg" alt="" />
{/if}

<div id="gameOverModal" class="modal">
  <div class="modal-content">
    <h2>¡Juego terminado!</h2>
    <p id="scoreText"></p>
    <button class="btn-cerrar" on:click={cerrarModal}>Cerrar</button>
  </div>
</div>

<style>
  .piso-pasto {
    position: absolute;
  }
  .space-container {
    box-sizing: border-box;
    padding: 4rem 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #4caf50;
    color: white;
    gap: 20px;
  }
  .titulo_juego {
    font-size: 2.5rem;
    font-family: "Pangolin", cursive;
    margin: 2rem;
  }
  #board {
    background-color: black;
    background-image: url("/images/prueba_fondo2.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  #start-button {
    background-color: #ffe4f0;
    color: #5b3c40;
    border: 2px solid #ffcce1;
    border-radius: 30px;
    padding: 12px 24px;
    font-size: 1.25rem;
    font-weight: bold;
    font-family: "Pangolin", cursive;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    margin: -125px 37%;
  }

  #start-button:hover {
    background-color: #ffd6ec;
    border-color: #ffb6d1;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    filter: brightness(150%);
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
  .instrucciones-juego {
    background-color: #ffffff;
    border: 2px #4caf50;
    color: #333;
    padding: 10px 20px;
    border-radius: 15px;
    font-size: 18px;
    font-family: "Pangolin", cursive;
    text-align: center;
    margin-bottom: 1rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
