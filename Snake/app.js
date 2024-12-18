// Game Variables
const board = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const gameOverMessage = document.getElementById("gameOverMessage");
const finalScoreInline = document.getElementById("finalScoreInline");
const restartInlineButton = document.getElementById("restartInlineButton");

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = 0; // High score variable
let speed = 200; // Initial speed in milliseconds
const minSpeed = 50; // Minimum delay between frames
let isGameOver = false; // Tracks whether the game is running
let gameLoopInterval; // For managing the game loop

// Initialize Game Board
function drawBoard() {
    board.innerHTML = ""; // Clear the board
    snake.forEach((segment) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add("snake");
        board.appendChild(snakeElement);
    });

    // Draw Food
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

// Update Snake Position
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head); // Add the new head position to the snake

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
        generateFood();

        // Adjust speed as score increases
        if (speed > 100) { // Cap the minimum speed at 100ms
            speed -= Math.max(1, Math.floor(10 / (score + 1))); // Decrease speed incrementally
            console.log(`Speed increased! New speed: ${speed} ms per frame`);
            restartGameLoop(); // Restart the game loop with the new speed
        }
    } else {
        snake.pop(); // Remove the tail if no food is eaten
    }

    // Check for collisions
    if (checkCollision()) {
        isGameOver = true; // Mark the game as over
        updateHighScore(); // Check if high score needs updating
        showGameOverMessage();
    }
}

// Generate Random Food Position
function generateFood() {
    let newFoodPosition;
    let isOnSnake;

    do {
        // Generate random position
        newFoodPosition = {
            x: Math.floor(Math.random() * 20) + 1,
            y: Math.floor(Math.random() * 20) + 1
        };

        // Check if the food overlaps with the snake
        isOnSnake = snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y);
    } while (isOnSnake); // Repeat if the food spawns on the snake

    // Set the food position
    food = newFoodPosition;
}


// Check for Collisions
function checkCollision() {
    const head = snake[0];
    // Wall collision
    if (head.x < 1 || head.x > 20 || head.y < 1 || head.y > 20) return true;
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

// Update High Score
function updateHighScore() {
    if (score > highScore) {
        highScore = score; // Update the high score
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
}

// Show Inline Game Over Message
function showGameOverMessage() {
    finalScoreInline.textContent = score; // Update the final score
    gameOverMessage.classList.remove("hidden"); // Show the game over message
    clearInterval(gameLoopInterval); // Stop the game loop
}

// Reset Game
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    direction = { x: 0, y: 0 };
    score = 0;
    speed = 200; // Reset speed
    isGameOver = false; // Reset game status
    scoreDisplay.textContent = "Score: 0";
    gameOverMessage.classList.add("hidden"); // Hide the game over message
    drawBoard();

    // Restart the game loop
    clearInterval(gameLoopInterval);
    gameLoop();
}

// Restart Game Loop
function restartGameLoop() {
    clearInterval(gameLoopInterval); // Stop the current game loop
    gameLoop(); // Restart the game loop with the new speed
}

// Handle Key Press
function handleKeyPress(event) {
    // Prevent the default action of arrow keys (scrolling)
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }

    if (isGameOver) {
        if (event.key === "Enter") {
            resetGame(); // Restart the game when Enter is pressed on Game Over
        }
        return; // Prevent other key actions when game is over
    }

    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}
// Array of alternate game over messages
const gameOverMessages = [
    "You died :(",
    "Booooooo",
    "Ya done goofed",
    "You really screwed that one up",
    "Be better",
    "Snake really shouldn't be this hard for you",
    "womp womp",
];

// Show Inline Game Over Message
function showGameOverMessage() {
    // Randomly pick a message
    const randomIndex = Math.floor(Math.random() * gameOverMessages.length);
    const randomMessage = gameOverMessages[randomIndex];

    // Update the message in the modal
    const messageElement = gameOverMessage.querySelector("p:first-of-type");
    messageElement.textContent = randomMessage;

    // Update the final score and show the modal
    finalScoreInline.textContent = score;
    gameOverMessage.classList.remove("hidden");
    clearInterval(gameLoopInterval); // Stop the game loop
}


// Game Loop
function gameLoop() {
    gameLoopInterval = setInterval(() => {
        if (!isGameOver) {
            moveSnake();
            drawBoard();
        }
    }, speed); // Use the dynamic speed variable
}

// Restart Button Logic
restartInlineButton.addEventListener("click", resetGame);

// Event Listeners
window.addEventListener("keydown", handleKeyPress);

// Start the Game
drawBoard();
gameLoop();
