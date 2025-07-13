<script>
    import GatoJugador from './armarGato/GatoJugador.svelte';
    import {jugadorGatoTerminado} from './store.js';
    import {resultadoJuego1, resultadoJuego2 } from './store.js';

    $: alturaJugador = $resultadoJuego1;

    let tileSize = 32;
    let rows = 16;
    let columns = 16;

    let board;
    let boardWidth = tileSize * columns;
    let boardHeight = tileSize * rows;
    let context;

    let shipWidth = tileSize * 2;
    let shipHeight = tileSize;
    let shipX = tileSize * columns / 2 - tileSize;
    let shipY = tileSize * rows - tileSize * 2;

    let ship = {
        x: shipX,
        y: shipY,
        width: shipWidth,
        height: shipHeight
    };

    let shipImg;
    let shipVelocityX = tileSize;

    let alienArray = [];
    let alienWidth = tileSize * 2;
    let alienHeight = tileSize;
    let alienX = tileSize;
    let alienY = tileSize;
    let alienImg;

    let alienRows = 2;
    let alienColumns = 3;
    let alienCount = 0;
    let alienVelocityX = 0.5;

    let bulletArray = [];
    let bulletVelocityY = -10;

    let score = 0;
    let gameOver = false;
    let gameStarted = false;

    let playerDiv;

    window.onload = function () {
        board = document.getElementById("board");
        board.width = boardWidth;
        board.height = boardHeight;
        context = board.getContext("2d");

        playerDiv = document.getElementById("player-character");
        if (playerDiv) {
            playerDiv.style.position = 'absolute';
            playerDiv.style.width = ship.width + 'px';
            playerDiv.style.height = ship.height + 'px';
            playerDiv.style.left = board.offsetLeft + ship.x + 'px';
            playerDiv.style.top = board.offsetTop + ship.y + 'px';
        }

        shipImg = new Image();
        shipImg.src = "/images/ship.png";

        alienImg = new Image();
        alienImg.src = "/images/perro_malo.svg";

        document.addEventListener("keydown", moveShip);
        document.addEventListener("keydown", shoot);

        const startButton = document.getElementById("start-button");
        if (startButton) {
            startButton.addEventListener("click", startGame);
        }

        requestAnimationFrame(update);
    };

    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            gameOver = false;
            score = 0;
            alienVelocityX = 1;
            alienRows = 2;
            alienColumns = 3;
            alienArray = [];
            bulletArray = [];
            ship.x = shipX;
            ship.y = shipY;

            createAliens();
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("game-over-text").style.display = 'none';

            if (playerDiv) {
                playerDiv.style.display = 'block';
            }

            requestAnimationFrame(update);
        }
    }

    function update() {
        requestAnimationFrame(update);

        if (gameOver) {
            document.getElementById("game-over-text").style.display = 'block';
            document.getElementById("start-button").style.display = 'block';

            if (score !== null && resultadoJuego2) {
                let manchas = Math.min(5, Math.floor(score / 1000));
                resultadoJuego2.set(manchas);
            }

            return;
        }

        if (!gameStarted) {
            context.clearRect(0, 0, board.width, board.height);
            context.fillStyle = "white";
            context.font = "16px Pangolin";
            context.fillText("", boardWidth / 2 - 80, boardHeight / 2);

            if (playerDiv) {
                playerDiv.style.display = 'none';
            }
            return;
        }

        context.clearRect(0, 0, board.width, board.height);

        if (playerDiv) {
            playerDiv.style.left = board.offsetLeft + ship.x + 'px';
            playerDiv.style.top = board.offsetTop + ship.y + 'px';
        }

        for (let i = 0; i < alienArray.length; i++) {
            let alien = alienArray[i];
            if (alien.alive) {
                alien.x += alienVelocityX;

                if (alien.x + alien.width >= board.width || alien.x <= 0) {
                    alienVelocityX *= -1;
                    alien.x += alienVelocityX * 2;

                    for (let j = 0; j < alienArray.length; j++) {
                        alienArray[j].y += alienHeight;
                    }
                }
                context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

                if (alien.y >= ship.y) {
                    gameOver = true;
                    gameStarted = false;
                }
            }
        }

        for (let i = 0; i < bulletArray.length; i++) {
            let bullet = bulletArray[i];
            bullet.y += bulletVelocityY;
            context.fillStyle = "white";
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

            for (let j = 0; j < alienArray.length; j++) {
                let alien = alienArray[j];
                if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                    bullet.used = true;
                    alien.alive = false;
                    alienCount--;
                    score += 100;
                }
            }
        }

        while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
            bulletArray.shift();
        }

        if (alienCount == 0) {
            score += alienColumns * alienRows * 100;
            alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
            alienRows = Math.min(alienRows + 1, rows - 4);
            if (alienVelocityX > 0) {
                alienVelocityX += 0.2;
            } else {
                alienVelocityX -= 0.2;
            }
            alienArray = [];
            bulletArray = [];
            createAliens();
        }

        context.fillStyle = "black";
        context.font = "16px Pangolin";
        context.fillText(score, 5, 20);
    }

    function moveShip(e) {
        if (gameOver || !gameStarted) {
            return;
        }
        if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
            ship.x -= shipVelocityX;
        } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
            ship.x += shipVelocityX;
        }
    }

    function createAliens() {
        for (let c = 0; c < alienColumns; c++) {
            for (let r = 0; r < alienRows; r++) {
                let alien = {
                    img: alienImg,
                    x: alienX + c * alienWidth,
                    y: alienY + r * alienHeight,
                    width: alienWidth,
                    height: alienHeight,
                    alive: true
                };
                alienArray.push(alien);
            }
        }
        alienCount = alienArray.length;
    }

    function shoot(e) {
        if (gameOver || !gameStarted) {
            return;
        }

        if (e.code == "Space") {
            e.preventDefault();
            let bullet = {
                x: ship.x + shipWidth * 15 / 32,
                y: ship.y,
                width: tileSize / 8,
                height: tileSize / 2,
                used: false
            };
            bulletArray.push(bullet);
        }
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }
</script>

<div class="space-container">
    <h1 class="titulo_juego">Vencé a tu competencia!</h1>
    <canvas id="board"></canvas>

    <div id="player-character" style="display: none;">
        <GatoJugador />
    </div>

    <h2 id="game-over-text" style="display:none; color:white; margin-top: 20px;">GAME OVER!</h2>

    {#if $jugadorGatoTerminado && !gameStarted}
      <button id="start-button" on:click={startGame}>Jugar</button>
    {/if}
</div>

<style>
    #board {
        margin: 0;
        background-color: black;
        background-image: url("/images/prueba_fondo2.jpg");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .space-container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        text-align: center;
        background-color: black;
        color: black;
        gap: 20px;
    }

    #player-character {
        position: absolute;
        z-index: 10;
    }

    #start-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 50000;
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 16px 36px;
        font-size: 20px;
        cursor: pointer;
        border-radius: 14px;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.7);
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        user-select: none;
        font-family: "Pangolin", cursive;
    }

    #start-button:hover {
        background-color: #45A049;
    }

    #start-button:disabled {
        background-color: #9ccc9c;
        cursor: not-allowed;
        box-shadow: none;
    }
</style>
