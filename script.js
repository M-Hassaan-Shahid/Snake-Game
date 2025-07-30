let inputDir = { x: 0, y: 0 };
let speed = 8;
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

function gameEngine() {
    // Updating the snake ar
    // ray and food
    highScore();
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        musicSound.play();
    }
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        scoreElement.innerHTML = "Score: " + score;
        highScore(); //
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
    musicSound.play();
    inputDir = { x: 0, y: 1 }; // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowDown":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        case "ArrowLeft":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowRight":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        default:
            break;
    }
})

// Add event listeners for arrow buttons
const arrowUp = document.getElementById('arrow-up');
const arrowDown = document.getElementById('arrow-down');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');

function handleArrow(direction) {
    musicSound.play();
    moveSound.play();
    switch (direction) {
        case 'up':
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case 'down':
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        case 'left':
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case 'right':
            inputDir.x = 0;
            inputDir.y = 1;
            break;
    }
}

arrowUp.addEventListener('click', () => handleArrow('up'));
arrowDown.addEventListener('click', () => handleArrow('down'));
arrowLeft.addEventListener('click', () => handleArrow('left'));
arrowRight.addEventListener('click', () => handleArrow('right'));