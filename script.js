// 🎯 Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const restartBtn = document.getElementById("restartBtn");
const exitBtn = document.getElementById("exitBtn");

// 🎲 Game Settings
const box = 20; // grid cell size (px)
let snake, direction, score, food, game, speed, running = false;

// 🍎 Generate random food position (ensures grid alignment)
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// 🔍 Check whether a position is on the snake
function onSnake(pos) {
  return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}

// 🔄 Initialize / reset the game
function init() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT"; // Set initial direction here
  score = 0;
  speed = 150;
  food = randomFood();
  while (onSnake(food)) {
    food = randomFood();
  }
  scoreDisplay.innerText = "Score: " + score;
  clearInterval(game);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(); // Draw initial state
  running = false;
}

// ▶️ Start the game loop
function startGame() {
  if (game) clearInterval(game);
  game = setInterval(draw, speed);
  running = true;
}

// 🎮 Controls (arrow keys). Prevent reverse direction.
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
  if (!running) return; // Ignore keys if not running
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// 🔄 Main drawing & game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🐍 Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // 🍎 Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  if (!direction) return; // Wait for user input

  // 🐍 Compute new head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  else if (direction === "UP") snakeY -= box;
  else if (direction === "RIGHT") snakeX += box;
  else if (direction === "DOWN") snakeY += box;

  // ✅ Check if Snake Eats Food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.innerText = "Score: " + score;
    if (score % 5 === 0 && speed > 50) {
      speed -= 20;
      clearInterval(game);
      game = setInterval(draw, speed);
    }
    food = randomFood();
    while (onSnake(food)) {
      food = randomFood();
    }
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // 💀 Game over conditions
  if (
    snakeX < 0 || snakeY < 0 ||
    snakeX >= canvas.width || snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    running = false;
    restartBtn.style.display = "block";
    resetBtn.style.display = "none";
    startBtn.style.display = "block";
    return;
  }

  snake.unshift(newHead);
}

// 🔍 Check collision of head with the snake body
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Update button handlers to show/hide Exit button appropriately
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  resetBtn.style.display = "block";
  restartBtn.style.display = "none";
  exitBtn.style.display = "block";
  direction = "RIGHT";
  init();
  startGame();
});

resetBtn.addEventListener("click", () => {
  resetBtn.style.display = "block";
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  exitBtn.style.display = "block";
  direction = "RIGHT";
  init();
  startGame();
});

restartBtn.addEventListener("click", () => {
  restartBtn.style.display = "none";
  resetBtn.style.display = "block";
  startBtn.style.display = "none";
  exitBtn.style.display = "block";
  direction = "RIGHT";
  init();
  startGame();
});

// Exit/Stop button handler
exitBtn.addEventListener("click", () => {
  clearInterval(game);
  running = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scoreDisplay.innerText = "Score: 0";
  startBtn.style.display = "block";
  resetBtn.style.display = "none";
  restartBtn.style.display = "none";
  exitBtn.style.display = "none";
});

// 🚦 On load, show only Start
window.onload = () => {
  startBtn.style.display = "block";
  resetBtn.style.display = "none";
  restartBtn.style.display = "none";
  exitBtn.style.display = "none";
  init();
};
