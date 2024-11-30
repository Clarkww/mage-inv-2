const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// make canvas background black
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let title = new Image();
title.src = './img/title.png';

let mage = new Image();
mage.src = './img/space-wizard.png';

// draw title
function drawTitle() {
    const size = Math.min(canvas.width, canvas.height) * 0.5; // 50% of the smaller dimension
    ctx.drawImage(title, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
}

title.onload = drawTitle;

// animate starz
let starz = [];
let starCount = 200;

for (let i = 0; i < starCount; i++) {
    starz.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1,
        color: 'white',
        speed: Math.random() * 0.4
    });
}

function renderBackground(ctx) {
    // Draw black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw starz
    ctx.fillStyle = 'white';
    for (let i = 0; i < starz.length; i++) {
        ctx.beginPath();
        ctx.arc(starz[i].x, starz[i].y, starz[i].radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updatestarz() {
    for (let i = 0; i < starz.length; i++) {
        starz[i].y += starz[i].speed;
        if (starz[i].y > canvas.height) {
            starz[i].y = 0;
            starz[i].x = Math.random() * canvas.width;
        }
    }
}

const letters = 'mageinvaders';
const fontSize = 20;
const maxLetters = 25; // Reduce the number of falling letters
let fallingLetters = [];

// Initialize random letters
for (let i = 0; i < maxLetters; i++) {
    fallingLetters.push({
        x: Math.random() * canvas.width, // Random x position
        y: Math.random() * canvas.height, // Random initial y position
        speed: Math.random() * 0.5 + 0.1, // Slow speed
        char: letters.charAt(Math.floor(Math.random() * letters.length)), // Random letter
        opacity: Math.random() * 0.3 + 0.2, // Low opacity
        changeInterval: Math.floor(Math.random() * 100) + 50, // Random interval for changing the letter
        changeCounter: 0 // Counter to track when to change the letter
    });
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Subtle fade effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;
    fallingLetters.forEach((letter) => {
        ctx.fillStyle = `rgba(0, 255, 0, ${letter.opacity})`;
        ctx.fillText(letter.char, letter.x, letter.y);

        // Move the letter down
        letter.y += letter.speed;

        // Increment the change counter
        letter.changeCounter++;

        // Change the letter if the change counter exceeds the change interval
        if (letter.changeCounter > letter.changeInterval) {
            letter.char = letters.charAt(Math.floor(Math.random() * letters.length)); // New random letter
            letter.changeCounter = 0; // Reset the change counter
        }

        // Reset letter if it moves off-screen
        if (letter.y > canvas.height) {
            letter.y = -fontSize; // Restart above the canvas
            letter.x = Math.random() * canvas.width; // New random x position
            letter.char = letters.charAt(Math.floor(Math.random() * letters.length)); // New random letter
            letter.opacity = Math.random() * 0.3 + 0.2; // New random opacity
            letter.speed = Math.random() * 0.5 + 0.1; // New random slow speed
            letter.changeInterval = Math.floor(Math.random() * 100) + 50; // New random interval for changing the letter
            letter.changeCounter = 0; // Reset the change counter
        }
    });
}

// let drawMage = () => {
//     ctx.drawImage(mage, 60, 50, 60, 60);
// }

//  update mage so it is rotating in place and floating across the screen 

let mageX = 0;
let mageY = 0;
let mageSpeed = 0.1;
let mageDirection = 1;
let mageRotation = 0;
let mageRotationSpeed = 0.02;

function updateMage() {
    mageX += mageSpeed * mageDirection;
    mageY += mageSpeed * mageDirection;
    mageRotation += mageRotationSpeed;

    if (mageX > canvas.width - 60) {
        mageDirection = -1;
    } else if (mageX < 0) {
        mageDirection = 1;
    }
}

function drawMage() {
    ctx.save();
    ctx.translate(mageX, mageY);
    ctx.rotate(mageRotation);
    ctx.drawImage(mage, -30, -30, 60, 60);
    ctx.restore();
}




let isAnimating = true;

let drawStartScreenText = () => {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click to start', canvas.width / 2, canvas.height - 50);
}







if (canvas) {
    canvas.addEventListener('click', () => {
        console.log('Canvas clicked');
        if (!document.getElementById('gameScript')) {
            document.getElementById('startScreen').remove();
            console.log('Loading game script');
            const gameScript = document.createElement('script');
            gameScript.id = 'gameScript';
            gameScript.src = './gamescript.js';
            gameScript.onload = () => console.log('Game script loaded successfully');
            gameScript.onerror = () => console.error('Failed to load game script');
            document.body.appendChild(gameScript);
            isAnimating = false;
        } else {
            console.log('Game script already loaded');
        }
    });
} else {
    console.error('Canvas element not found');
}

function animate() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!isAnimating) return;
    renderBackground(ctx);
    updatestarz()
    drawMatrix()
    drawTitle()
    drawStartScreenText();
    drawMage();
    updateMage();
    requestAnimationFrame(animate);
}

animate();




