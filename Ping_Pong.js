const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetButton = document.querySelector("#resetButton");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "forestgreen";
const paddle1Color = "black";
const paddle2Color = "white";
const paddle1Border = "white";
const paddle2Border = "black";
let ballColor = "yellow";
const ballBorder = "black";
const ballRadius = 12.5; // full diameter is 25
const paddleSpeed = 5;
let intervalID;
let ballSpeed = 1.5;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1score = 0;
let player2score = 0;

let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
};

let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100
};

// Object to track the state of each key
const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.keyCode] = true;
});


window.addEventListener("keyup", (event) => {
    keys[event.keyCode] = false;
});

resetButton.addEventListener("click", resetGame);

startGame();

function startGame() {
    createBall();
    nextFrame();
}

function nextFrame() {
    intervalID = setTimeout(() => {
        clearBoard();
        drawField();
        drawPaddles();
        movePaddles(); // Update paddle positions based on key states
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextFrame();
    }, 10);
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawField() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    // Outer boundary
    ctx.strokeRect(0, 0, gameWidth, gameHeight);

    // Center line
    ctx.beginPath();
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(gameWidth / 2, gameHeight / 2, 70, 0, 2 * Math.PI);
    ctx.stroke();

    // Left penalty area
    ctx.strokeRect(0, gameHeight / 2 - 100, 130, 200);

    // Right penalty area
    ctx.strokeRect(gameWidth - 130, gameHeight / 2 - 100, 150, 200);

    // Left goal area
    ctx.strokeRect(0, gameHeight / 2 - 50, 50, 100);

    // Right goal area
    ctx.strokeRect(gameWidth - 50, gameHeight / 2 - 50, 50, 100);

    // Left penalty spot
    ctx.beginPath();
    ctx.arc(110, gameHeight / 2, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Right penalty spot
    ctx.beginPath();
    ctx.arc(gameWidth - 110, gameHeight / 2, 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawPaddles() {
    ctx.lineWidth = 2;

    ctx.strokeStyle = paddle1Border;
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.strokeStyle = paddle2Border;
    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall(){
    ballSpeed = 1;
    ballColor = "yellow";
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballXDirection = Math.random() < 0.5 ? 1 : -1;
    ballYDirection = Math.random() < 0.5 ? 1 : -1;
    drawBall(ballX, ballY);
}
 
function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
}

function drawBall(ballX, ballY) {
        drawFlames(ballX, ballY)
    
    
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill()
}

function drawFlames(ballX, ballY) {
    if (ballSpeed >= 4){
        ballColor = "orange";
        const flameColors = ["rgba(255, 69, 0, 0.8)", "rgba(255, 140, 0, 0.6)", "rgba(255, 215, 0, 0.4)"];
        const flameSizes = [ballRadius + 10, ballRadius + 20, ballRadius + 30];

        for (let i = 0; i < flameColors.length; i++) {
            let gradient = ctx.createRadialGradient(ballX, ballY, ballRadius, ballX, ballY, flameSizes[i]);
            gradient.addColorStop(0, flameColors[i]);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(ballX, ballY, flameSizes[i], 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    if (ballSpeed >= 7){
        ballColor = "red";
        const flameColors = ["rgba(255, 69, 0, 0.8)", "rgba(255, 140, 0, 0.6)", "rgba(255, 215, 0, 0.4)"];
        const flameSizes = [ballRadius + 20, ballRadius + 25, ballRadius + 33];

        for (let i = 0; i < flameColors.length; i++) {
            let gradient = ctx.createRadialGradient(ballX, ballY, ballRadius, ballX, ballY, flameSizes[i]);
            gradient.addColorStop(0, flameColors[i]);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(ballX, ballY, flameSizes[i], 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function checkCollision() {
    // Top and Bottom Wall Collision
    if (ballY <= ballRadius) {
        ballYDirection *= -1;
    }
    if (ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }

    // Left and Right Wall Collision (Score Update)
    if (ballX <= 0) {
        player2score += 1;
        updateScore();
        createBall();
        return;
    }
    if (ballX >= gameWidth) {
        player1score += 1;
        updateScore();
        createBall();
        return;
    }

    if (ballX <= paddle1.x + paddle1.width + ballRadius) {
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            ballXDirection *= -1;
            ballX = paddle1.x + paddle1.width + ballRadius; // Adjust ball position to prevent sticking
            ballSpeed += 0.5;
        }
    }

    if (ballX >= paddle2.x - ballRadius) {
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            ballXDirection *= -1;
            ballX = paddle2.x - ballRadius; // Adjust ball position to prevent sticking
            ballSpeed += 0.5;
        }
    }
}

function movePaddles() {
    const paddle1UpW = 87;
    const paddle1DownS = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;

    if (keys[paddle1UpW] && paddle1.y > 0) {
        paddle1.y -= paddleSpeed;
    }
    if (keys[paddle1DownS] && paddle1.y < gameHeight - paddle1.height) {
        paddle1.y += paddleSpeed;
    }
    if (keys[paddle2Up] && paddle2.y > 0) {
        paddle2.y -= paddleSpeed;
    }
    if (keys[paddle2Down] && paddle2.y < gameHeight - paddle2.height) {
        paddle2.y += paddleSpeed;
    }
}

function updateScore() {
    scoreText.textContent = `${player1score} : ${player2score}`
}

function resetGame() {
    player1score = 0;
    player2score = 0;
    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    };
    
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    };

    ballSpeed = 1;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    startGame();
} 
