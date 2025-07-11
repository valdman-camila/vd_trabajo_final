    <style>
        body {

            text-align: center;
            margin: 0;
            padding: 0;
        }
        
        .titulo_juego {
            margin-top: 50px;
            text-align: center;
            margin: 0;
            padding: 0;
        }
        
        #game-container {
            width: 400px;
            height: 316px;
            position: relative;
            margin-top: 109px;
            margin-right: auto;
            margin-bottom: 100px;
            margin-left: auto;

            background-image: url("./images/fondo_juego2.svg");
            
        }
        
        #basket {
            width: 57px;
            height: 91px;
            position: absolute;
            bottom: 50;
            margin-bottom: 50%;
        }
        
        .fruit {
            width: 30px;
            height: 30px;
            position: absolute;
            background-image: url("./images/pez.svg");
            top: 0;
        }
        
        .texto_juego {
            margin-top: 20px;
            font-size: 18px;
            text-align: center;
            margin: 0;
            padding: 0;
        }
        
        button {
            background-color: #4CAF50;

            color: #FFFFFF;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        button:hover {
            background-color: #45A049;
        }

        .retro-tv {
            position: absolute;
            width: 481px;
             transform: translateX(-50%) translateY(-15%);
        }
        .screen {
            position: relative;
            width: 400px;
            height: 400px;
            transform: translateX(120%);
            /* background-image: url("./images/fondo_juego.svg");  */

        }
        .bezel {
            position: absolute;
            height: 400px;
            width: 450px;
            z-index: 5;
             transform: translateX(-50%) translateY(18%);
            box-shadow: 2px 2px 8px rgb(24, 24, 24);
            background-image: radial-gradient(transparent 50%, rgb(30, 29, 25));
        }
        /*https://stackoverflow.com/questions/70498819/retro-crt-curved-screen-effect-for-website-ccs
        https://codepen.io/msriki12/pen/wBwMzjq*/

        .catch-container {
            display: flex;
            flex-direction: column;
            justify-content: center; 
            align-items: center;    
            min-height: 100vh;   
            text-align: center;
        }
        #tv-background{
            margin-top: 10%;

        }
        .modal {
  display: none; /* Oculto por defecto */
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
}

.modal-content {
  background-color: #fff;
  margin: 15% auto;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  text-align: center;
}
 

    </style>

<div class="catch-container">
    <h1 class="titulo_juego">Entretené a tu audencia!</h1>
    <div id="tv-background">          
        <!-- <img class="bezel"
          src="/images/bezel.png"
          alt=""> -->
          <img class="retro-tv"
          src="/images/retro-tv.svg"
          alt="">

    </div>
    <div id="game-container">
        <GatoJugador id="basket" />
    </div>


    <p class="texto_juego">Score: <span id="score">0</span></p>
    <p class="texto_juego">Time: <span id="time">30</span></p>
    <button id="start-button" disabled={!$jugadorGatoTerminado}>Start Game</button>
</div>
<!-- Modal -->
<div id="gameOverModal" class="modal">
  <div class="modal-content">
    <h2>¡Juego terminado!</h2>
    <p id="scoreText"></p>
    <button onclick="cerrarModal()">Cerrar</button> 
  </div>
</div>




    <script>
        import GatoJugador from './armarGato/GatoJugador.svelte';
        import {jugadorGatoTerminado} from './store.js';
        import { resultadoJuego1 } from './store.js';
        import { onMount } from 'svelte';
 
        document.addEventListener("DOMContentLoaded", function () {

        var basket = document.getElementById("basket");
        var scoreLabel = document.getElementById("score");
        var timeLabel = document.getElementById("time");
        var startButton = document.getElementById("start-button");
        var gameContainer = document.getElementById("game-container");
        var score = 0;
        var time = 30;
        var timerId;
        var isMovingLeft = false;
        var isMovingRight = false;
        var gameOver = false;
        var gameStart = true;
        let showModal = false;
        
        startButton.addEventListener("click", startGame);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        onMount(() => {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);
        });
        
        function startGame() {
            startButton.disabled = true;
            gameStart = false;
            resetGame();
            timerId = setInterval(updateTime, 1000);
            createFruit();
        }
        
        function resetGame() {
            score = 0;
            time = 30;
            scoreLabel.textContent = score;
            timeLabel.textContent = time;
            basket.style.left = "175px";
            gameOver = false;
            clearFruits();
        }
        
        function updateTime() {
            if (!gameOver) {
                time--;
                timeLabel.textContent = time;
            }
            if (time === -1) {
                endGame(); 
                timeLabel.textContent = 0;

            }
        }
        function mostrarModal(score) {
            document.getElementById("scoreText").textContent = "Tu rating es: " + score;
            document.getElementById("gameOverModal").style.display = "block";

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
            startButton.disabled = false;
            // alert("Game Over! Tu rating es: " + score);
            clearFruits();

            const altura = calcularAltura(score);
            resultadoJuego1.set(altura);
            mostrarModal(score); 
        }

        function calcularAltura(puntaje) {
            const min = 160;
            const max = 360;
            const maxPuntaje = 600; 

            const altura = min + ((Math.min(puntaje, maxPuntaje) / maxPuntaje) * (max - min));
            return Math.round(altura);
        }
        
        function createFruit() {
            var fruit = document.createElement("div");
            fruit.className = "fruit";
            fruit.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 30)) + "px";
            gameContainer.appendChild(fruit);
        
            moveFruit(fruit);
        }
        
        function moveFruit(fruit) {
            var fruitIntervalId = setInterval(function() {
                var fruitBottom = fruit.offsetTop + fruit.offsetHeight;
                var fruitLeft = fruit.offsetLeft;
                var fruitRight = fruitLeft + fruit.offsetWidth;
                var basketLeft = basket.offsetLeft;
                var basketRight = basketLeft + basket.offsetWidth;
                var basketTop = basket.offsetTop;
                var basketBottom = basketTop + basket.offsetHeight;
        
                if (fruitBottom >= gameContainer.offsetHeight) {
                    clearInterval(fruitIntervalId);
                    fruit.remove();
                    createFruit();
                } else if (fruitBottom >= basketTop && fruitLeft >= basketLeft && fruitRight <= basketRight && fruitBottom <= basketBottom) {
                    clearInterval(fruitIntervalId);
                    fruit.remove();
                    score=score+50;
                    scoreLabel.textContent = score;
                    createFruit();
                }
        
                fruit.style.top = fruit.offsetTop + 10 + "px";
            }, 50);
        }
        
        function clearFruits() {
            var fruits = document.getElementsByClassName("fruit");
            while (fruits.length > 0) {
                fruits[0].remove();
            }
        }
        
        function handleKeyDown(event) {
            if (event.key === "ArrowLeft") {
                isMovingLeft = true;
            } else if (event.key === "ArrowRight") {
                isMovingRight = true;
            }
        
            moveBasket();
        }
        
        function handleKeyUp(event) {
            if (event.key === "ArrowLeft") {
                isMovingLeft = false;
            } else if (event.key === "ArrowRight") {
                isMovingRight = false;
            }
        }
        
        function moveBasket() {
            var basketLeft = basket.offsetLeft;
        
            if (isMovingLeft && basketLeft > 0 && !gameOver &&!gameStart) {
                basket.style.left = basketLeft - 5 + "px";
            } else if (isMovingRight && basketLeft + basket.offsetWidth < gameContainer.offsetWidth && !gameOver && !gameStart) {
                basket.style.left = basketLeft + 5  + "px";
            }
        }


    });
    window.cerrarModal = function () {
    document.getElementById("gameOverModal").style.display = "none";
    };
    </script>
