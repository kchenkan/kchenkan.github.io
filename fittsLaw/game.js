const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('startButton');
const lastClickTimeDisplay = document.getElementById('lastClickTime');
const totalTimeDisplay = document.getElementById('totalTime');

let gameInProgress = false;
let lastClickTime = 0;
let startTime = 0;
let totalClicks = 0;
let targetSize;
let lastTarget = { x: 0, y: 0 }; // Store the last target's position

function resizeCanvas() {
	const overlayHeight = document.querySelector('.overlay').clientHeight;
    const availableHeight = window.innerHeight - overlayHeight;

    canvas.width = window.innerWidth;
    canvas.height = availableHeight; // Set height considering overlay

    if (gameInProgress) {
        newTarget(); // Adjust target if game is in progress
    }
}

function newTarget() {
    if (!gameInProgress) return;

    let furthestPoint = { x: 0, y: 0 };
    let maxDistance = 0;
    const numberOfRandomPoints = 10; // Increase for more randomness
	
	let difficultyFactor = 0.4 * (50 - parseInt(difficultySelect.value, 10))/20 + 0.2;
	
	console.log(difficultyFactor)

    // Generate random points and find the furthest one
    for (let i = 0; i < numberOfRandomPoints; i++) {
        let randomPoint = {
            x: Math.random() * (canvas.width - targetSize * 2) * difficultyFactor + targetSize,
            y: Math.random() * (canvas.height - targetSize * 2) * difficultyFactor + targetSize
        };

        let distance = Math.hypot(randomPoint.x - lastTarget.x, randomPoint.y - lastTarget.y);

        if (distance > maxDistance) {
            furthestPoint = randomPoint;
            maxDistance = distance;
        }
    }

    // Update last target position and draw new target
    lastTarget.x = furthestPoint.x;
    lastTarget.y = furthestPoint.y;
    drawTarget(furthestPoint.x, furthestPoint.y, targetSize);
}

function drawTarget(x, y, size) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('click', function(event) {
    if (!gameInProgress) return;

    const clickTime = Date.now();
    const timeTaken = clickTime - lastClickTime;
    lastClickTime = clickTime;

    lastClickTimeDisplay.textContent = timeTaken + " ms";
    totalClicks++;

    if (totalClicks >= 20) {
        endGame();
    } else {
        newTarget();
    }
});

function startGame() {
    targetSize = parseInt(difficultySelect.value, 10);
    gameInProgress = true;
    totalClicks = 0;
    startTime = Date.now();
    lastClickTime = startTime;
    newTarget();
}

function endGame() {
    gameInProgress = false;
    const totalTime = Date.now() - startTime;
    totalTimeDisplay.textContent = totalTime + " ms";
}

// Set the canvas size initially and adjust when the window is resized
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Start button event
startButton.addEventListener('click', startGame);
