// Global variables
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.querySelector('#score');
const restartGameButton = document.querySelector('#restartGameButton');

const directions = ['up', 'right', 'down', 'left'];

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

let direction;
let isReverseDirection;

let score = 0;

// Start game
nextArrow();

// Event listeners

// mousedown for mouse click
gameContainer.addEventListener('mousedown', lock);
// touchstart for touch screen, like mobile phones etc...
gameContainer.addEventListener('touchstart', lock);

gameContainer.addEventListener('mouseup', release);
gameContainer.addEventListener('touchend', release);

function lock(e) {
    // console.log(e.target);
    // if event is NOT on ARROW classlist, just exit the function with RETURN
    if (!e.target.classList.contains('arrow')) return;
    startX = e.type === 'mousedown' ? e.screenX : e.changedTouches[0].screenX;
    startY = e.type === 'mousedown' ? e.screenY : e.changedTouches[0].screenY;
}

function release(e) {
    if (!startX) return;
    endX = e.type === 'mouseup' ? e.screenX : e.changedTouches[0].screenX;
    endY = e.type === 'mouseup' ? e.screenY : e.changedTouches[0].screenY;
    handleArrowSwipe();
}

restartGameButton.addEventListener('click', restartGame);

function restartGame() {
    clearInterval(progressBarInterval);
    progressBarWidthNumerator = gameDuration * 1000;
    score = 0;
    scoreElement.innerText = score;
    document.querySelector('.arrow').remove();
    nextArrow();
    gameContainer.addEventListener('mousedown', lock);
    gameContainer.addEventListener('touchstart', lock);
    gameContainer.addEventListener('mouseup', release);
    gameContainer.addEventListener('touchend', release);
    startX = 0; startY = 0; endX = 0; endY = 0;
    progressBarInterval = setInterval(progressBarFrame, 15);
}

function handleArrowSwipe() {
    // Validation
    const result = getValidationResult();
    const arrowElement = document.querySelector('.arrow');
    if (result === 'correct') {
        score += 10;
        scoreElement.innerText = score;
        scoreElement.classList.remove('animate__pulse');
        setTimeout(() => {
            scoreElement.classList.add('animate__pulse');
        }, 10)


        document.querySelector('.arrow').remove();
        nextArrow();
    } else if (result === 'wrong') {
        if (score > 0) {
            score -= 10;
            scoreElement.innerText = score;
            // document.querySelector('.arrow').remove();
            // nextArrow();
            scoreElement.classList.remove('animate__pulse', 'animate__flash');
            setTimeout(() => {
                scoreElement.classList.add('animate__flash');
            }, 10)
        }

        arrowElement.classList.remove('animate__bounceIn', 'animate__shakeX');
        setTimeout(() => {
            arrowElement.classList.add('animate__shakeX');
        }, 10)

    }

    startX = 0; startY = 0; endX = 0; endY = 0;
}

function getValidationResult() {
    let result = '';
    // const sensitivityTreshhold = 10;
    if (correctDirection() === 'up') {
        // if (Math.abs(endY - startY) > sensitivityTreshhold) {
        if (endY < startY) result = 'correct'; // swiped up
        else if (endY > startY) result = 'wrong'; // swiped down
        // }
    }
    else if (correctDirection() === 'right') {
        if (endX > startX) result = 'correct'; // swiped right
        else if (endX < startX) result = 'wrong'; // swiped left
    }
    else if (correctDirection() === 'down') {
        if (endY > startY) result = 'correct'; // swiped down
        else if (endY < startY) result = 'wrong'; // swiped up
    }
    else if (correctDirection() === 'left') {
        if (endX < startX) result = 'correct'; // swiped left
        else if (endX > startX) result = 'wrong'; // swiped right
    }
    return result;
}


function correctDirection() {
    if (!isReverseDirection) return direction;
    // if (direction === 'up') return 'down';
    // if (direction === 'left') return 'right';
    // if (direction === 'down') return 'up';
    // if (direction === 'right') return 'left';
    if (direction === 'up') return 'up';
    if (direction === 'left') return 'left';
    if (direction === 'down') return 'down';
    if (direction === 'right') return 'right';
}

function nextArrow() {

    // calling random arrow direction with getRandomInt function
    direction = directions[getRandomInt(4)];
    isReverseDirection = getRandomInt(2);

    // Creating Arrow element
    const newElementI = document.createElement('i');
    // Adding new Arrow element with random class DIRECTION
    newElementI.classList.add('fas', `fa-arrow-circle-${direction}`, 'arrow', 'animate__animated', 'animate__bounceIn');
    // Adding new Color STYLE for Arrow element with random color, Blue or Red
    newElementI.setAttribute('style', `color: ${isReverseDirection ? "#36a2eb" : "#ff6384"}`);
    // newElementI.style.color = '#36a2eb';
    gameContainer.appendChild(newElementI);
};

// Creating random number to the MAX argument
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Progress bar count down timer

const progressBarElement = document.querySelector('#progress-bar');
const gameDuration = 15; // Game Duration in seconds
let progressBarWidthNumerator = gameDuration * 1000;
const progressBarWidthDenominator = gameDuration * 1000;

let progressBarInterval = setInterval(progressBarFrame, 15);

function progressBarFrame() {
    if (progressBarWidthNumerator <= 0) {
        clearInterval(progressBarInterval);
        // Stopping the game when timer reaches ZERO
        gameContainer.removeEventListener('mousedown', lock);
        gameContainer.removeEventListener('touchstart', lock);
        gameContainer.removeEventListener('mouseup', release);
        gameContainer.removeEventListener('touchend', release);
        // changing background to Green, because of reload/restart button
        progressBarElement.setAttribute('style', 'width: 0%; background-color: #00cc99');
    } else {
        progressBarWidthNumerator -= 10;
        const currentProgressBarWidth = progressBarWidthNumerator / progressBarWidthDenominator;
        // changing background to Red
        if (currentProgressBarWidth <= 0.15) {
            progressBarElement.setAttribute('style', `width: ${100 * currentProgressBarWidth}%; background-color: #ff3300;`);
            // changing background to Orange
        } else if (currentProgressBarWidth <= 0.35) {
            progressBarElement.setAttribute('style', `width: ${100 * currentProgressBarWidth}%; background-color: #ff9f40;`);
        } else {
            progressBarElement.setAttribute('style', `width: ${100 * currentProgressBarWidth}%`);
        }
    }
}
