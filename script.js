let inputDir = { x: 0, y: 0 };
let speed = 8;
let level = 1;
let baseSpeed = 8;
let gameStarted = false;
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
let score = 0;
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }];
let board = document.getElementsByClassName('board')[0];
let food = { x: 6, y: 7 };
let scoreElement = document.getElementById('scoreBox');
let levelElement = document.getElementById('levelBox');
let startLevelSelect = document.getElementById('startLevel');
let newGameBtn = document.getElementById('newGameBtn');
let toastElement = document.getElementById('toast');
let autoSpeedIncreaseCheckbox = document.getElementById('autoSpeedIncrease');

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}
function isCollide(snake) {
    // If snake collides with itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If snake collides with walls (grid is 1 to 18)
    if (snake[0].x < 1 || snake[0].x > 18 || snake[0].y < 1 || snake[0].y > 18) {
        return true;
    }
    return false;
}

function showToast(message, type = 'success') {
    toastElement.textContent = message;
    toastElement.className = `toast ${type}`;
    toastElement.classList.add('show');

    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

function updateLevel() {
    // Increase level every 5 points, but don't go below starting level
    let startingLevel = parseInt(startLevelSelect.value);
    let newLevel = Math.max(startingLevel, Math.floor(score / 5) + startingLevel);
    if (newLevel !== level) {
        level = newLevel;
        levelElement.innerHTML = "Level: " + level;

        // Only increase speed if auto speed increase is enabled
        if (autoSpeedIncreaseCheckbox.checked) {
            // Increase speed with each level (max speed cap at level 15)
            speed = Math.min(baseSpeed + (level - 1) * 2, baseSpeed + 28);

            // Show level up notification with speed increase
            if (level > startingLevel) {
                showToast(`Level Up! Welcome to Level ${level}! Speed increased!`, 'success');
            }
        } else {
            // Show level up notification without speed increase
            if (level > startingLevel) {
                showToast(`Level Up! Welcome to Level ${level}! Speed remains constant.`, 'success');
            }
        }
    }
}

function setStartingLevel(selectedLevel) {
    level = selectedLevel;
    // Set initial speed based on selected level
    speed = baseSpeed + (level - 1) * 2;
    levelElement.innerHTML = "Level: " + level;
}

function resetGame() {
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    let startingLevel = parseInt(startLevelSelect.value);
    setStartingLevel(startingLevel);
    scoreElement.innerHTML = "Score: " + score;
    gameStarted = false;
    inputDir = { x: 0, y: 0 };
}

function startNewGame() {
    resetGame();
    let speedMessage = autoSpeedIncreaseCheckbox.checked ?
        "Speed will increase with levels." :
        "Speed will remain constant.";
    showToast(`New game started at Level ${level}! ${speedMessage} Use arrow keys to begin.`, 'success');
}

function gameEngine() {
    // Updating the snake array and food
    highScore();
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        showToast(`Game Over! You reached Level ${level} with ${score} points! Click "New Game" to play again.`, 'error');
        gameStarted = false;
        return;
    }
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        scoreElement.innerHTML = "Score: " + score;
        updateLevel();
        highScore();
        // Generate new food
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
    }
    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] }

    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Updating the snake array
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.x;
        snakeElement.style.gridColumnStart = e.y;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);



    })
    // Updating the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.x;
    foodElement.style.gridColumnStart = food.y;
    foodElement.classList.add('food');
    board.appendChild(foodElement);



}

function highScore() {
    let highScore = localStorage.getItem("highScore");
    if (highScore === null) {
        highScore = 0;
    } else {
        highScore = JSON.parse(highScore);
    }
    if (score > highScore) {
        localStorage.setItem("highScore", JSON.stringify(score));
        document.getElementById('highScoreBox').innerHTML = "High Score: " + score;
    } else {
        document.getElementById('highScoreBox').innerHTML = "High Score: " + highScore;
    }
}


window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    if (!gameStarted && (e.key.startsWith('Arrow') || e.key === ' ')) {
        gameStarted = true;
        musicSound.play();
        showToast('Game started! Good luck!', 'success');
    }

    if (gameStarted) {
        moveSound.play();
        switch (e.key) {
            case "ArrowUp":
                if (inputDir.x !== 1) { // Prevent reverse direction
                    inputDir.x = -1;
                    inputDir.y = 0;
                }
                break;
            case "ArrowDown":
                if (inputDir.x !== -1) { // Prevent reverse direction
                    inputDir.x = 1;
                    inputDir.y = 0;
                }
                break;
            case "ArrowLeft":
                if (inputDir.y !== 1) { // Prevent reverse direction
                    inputDir.x = 0;
                    inputDir.y = -1;
                }
                break;
            case "ArrowRight":
                if (inputDir.y !== -1) { // Prevent reverse direction
                    inputDir.x = 0;
                    inputDir.y = 1;
                }
                break;
            default:
                break;
        }
    }
})

// Add event listeners for arrow buttons
const arrowUp = document.getElementById('arrow-up');
const arrowDown = document.getElementById('arrow-down');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');

function handleArrow(direction) {
    if (!gameStarted) {
        gameStarted = true;
        musicSound.play();
        showToast('Game started! Good luck!', 'success');
    }

    if (gameStarted) {
        moveSound.play();
        switch (direction) {
            case 'up':
                if (inputDir.x !== 1) { // Prevent reverse direction
                    inputDir.x = -1;
                    inputDir.y = 0;
                }
                break;
            case 'down':
                if (inputDir.x !== -1) { // Prevent reverse direction
                    inputDir.x = 1;
                    inputDir.y = 0;
                }
                break;
            case 'left':
                if (inputDir.y !== 1) { // Prevent reverse direction
                    inputDir.x = 0;
                    inputDir.y = -1;
                }
                break;
            case 'right':
                if (inputDir.y !== -1) { // Prevent reverse direction
                    inputDir.x = 0;
                    inputDir.y = 1;
                }
                break;
        }
    }
}

// Event listeners
arrowUp.addEventListener('click', () => handleArrow('up'));
arrowDown.addEventListener('click', () => handleArrow('down'));
arrowLeft.addEventListener('click', () => handleArrow('left'));
arrowRight.addEventListener('click', () => handleArrow('right'));

newGameBtn.addEventListener('click', function () {
    startNewGame();
    // Remove focus from button after clicking
    this.blur();
});

// Add blur functionality to checkbox
autoSpeedIncreaseCheckbox.addEventListener('change', function () {
    // Remove focus from checkbox after changing
    this.blur();
});

// Add event listener for level selection change
startLevelSelect.addEventListener('change', function () {
    if (!gameStarted) {
        // Update level display immediately when selection changes
        let selectedLevel = parseInt(this.value);
        setStartingLevel(selectedLevel);
        showToast(`Level ${selectedLevel} selected! Click "New Game" to start.`, 'warning');

        // Remove focus from dropdown to prevent it staying selected on Windows
        this.blur();
    }
});

// Initialize game
resetGame();
showToast('Welcome to Snake Mania! Select your starting level and click "New Game" to begin.', 'success');