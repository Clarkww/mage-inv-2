const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// make canvas background black
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let title = new Image();
title.src = './img/title.png';

// draw title
function drawTitle() {
    const size = Math.min(canvas.width, canvas.height) * 0.5; // 50% of the smaller dimension
    ctx.drawImage(title, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
}

title.onload = drawTitle;

// animate stars
let stars = [];
let starCount = 200;

for (let i = 0; i < starCount; i++) {
    stars.push({
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

    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < stars.length; i++) {
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateStars() {
    for (let i = 0; i < stars.length; i++) {
        stars[i].y += stars[i].speed;
        if (stars[i].y > canvas.height) {
            stars[i].y = 0;
            stars[i].x = Math.random() * canvas.width;
        }
    }
}

const letters = 'mageinvaders';
const fontSize = 20;
const maxLetters = 50; // Reduce the number of falling letters
let fallingLetters = [];

// Initialize random letters
for (let i = 0; i < maxLetters; i++) {
    fallingLetters.push({
        x: Math.random() * canvas.width, // Random x position
        y: Math.random() * canvas.height, // Random initial y position
        speed: Math.random() * 0.5 + 0.1, // Slow speed
        char: letters.charAt(Math.floor(Math.random() * letters.length)), // Random letter
        opacity: Math.random() * 0.3 + 0.2 // Low opacity
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

        // Reset letter if it moves off-screen
        if (letter.y > canvas.height) {
            letter.y = -fontSize; // Restart above the canvas
            letter.x = Math.random() * canvas.width; // New random x position
            letter.char = letters.charAt(Math.floor(Math.random() * letters.length)); // New random letter
            letter.opacity = Math.random() * 0.3 + 0.2; // New random opacity
            letter.speed = Math.random() * 0.5 + 0.1; // New random slow speed
        }
    });
}








function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBackground(ctx);
    updateStars()
    drawMatrix()
    drawTitle();
    requestAnimationFrame(animate);
}

animate();




