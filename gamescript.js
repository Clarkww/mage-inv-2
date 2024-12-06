let canvas = document.getElementById('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let ctx = canvas.getContext('2d')


let playerImage = new Image()
playerImage.src = './img/space-wizard.png'

let alienBlueImg = new Image()
alienBlueImg.src = './img/Spaceship10-blue-02.png'

// let alienBlueImgTWO = new Image()
// alienBlueImg.src = './img/xenis-blue-a-2.png'

// let alienBlueImgTHREE = new Image()
// alienBlueImg.src = './img/xenis-blue-a-3.png'

let alienRedImg = new Image()
alienRedImg.src = './img/alien_spaceship_invasion_1.png'

let alienPurpleImg = new Image()
alienPurpleImg.src = './img/Spaceship10-purple-01.png'

let alienMineImg = new Image()
alienMineImg.src = './img/alien_spaceship_invasion_mine.png'



let fireballBitmap = new Image()
fireballBitmap.src = './spell-imgs/fireball.png'

let darknessOrbBitmap = new Image()
// darknessOrbBitmap.src = './spell-imgs/darknessOrb.png'

let healthPowerUpImg = new Image()
healthPowerUpImg.src = './img/health-powerup.png'

let scoreDiv = document.getElementById('score')
scoreDiv.textContent = 0
scoreDiv.style.display = 'none'


let targetX = canvas.width / 2
let targetY = canvas.height / 2

let gameover = false


let player = {
    x: 0,
    y: 0,
    health: 10,
    maxHealth: 10,
    width: 50,
    height: 50,
    color: 'red',
    firerate: 700,
    spell: 'fireball',
    fireType: 'single',
    seekingSpells: false,
    reverseControls: false,
    slowedMovement: false, // Added this property to avoid undefined error

}

let spells = []

let spellTimer

let maxBlueAliens = 3
let blueAliens = []
let blueAlienBullets = []

let blueAlien = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    color: 'blue',
    firerate: '1000',
    spell: 'fireball',
    fireType: 'single',
    seekingSpells: false,
    reverseControls: false,
    slowedMovement: false, // Added this property to avoid undefined error
    
}

let maxRedAliens = 3
let redAliens = []
let redAlienBullets = []

let redAlien = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    color: 'red',
    firerate: '1000',
    spell: 'fireball',
    fireType: 'single',
    seekingSpells: false,
    reverseControls: false,
    slowedMovement: false, // Added this property to avoid undefined error
}

let maxPurpleAliens = 2
let purpleAliens = []
let purpleAlienBullets = []

let purpleAlien = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    color: 'purple',
    firerate: '1000',
    spell: 'fireball',
    fireType: 'single',
    seekingSpells: false,
    reverseControls: false,
    slowedMovement: false, // Added this property to avoid undefined error
}

let maxMineShips = 2
let mineShips = []

let mineShip = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    color: 'purple',
    firerate: '1000',
    spell: 'fireball',
    fireType: 'single',
    seekingSpells: false,
    reverseControls: false,
    slowedMovement: false, // Added this property to avoid undefined error
}



const GameState = {
    START_SCREEN: 'startScreen',
    GAME_SCREEN: 'gameScreen',
    GAME_OVER: 'gameOverScreen'
};

let currentState = GameState.START_SCREEN;

let score = 0

let powerUpChance = 0.1

let stars = [];
let numStars = 50;

// Initialize stars with random positions and speeds
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 0.5 + 0.2,
        size: Math.random() * 2 + 1
    });
}

function renderBackground(ctx) {
    // Draw black background

    // console.log('rendering background')
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < stars.length; i++) {
        ctx.fillRect(stars[i].x, stars[i].y, stars[i].size, stars[i].size);
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

function renderHealthBar(ctx, player) {
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width - 120, 12, 100, 20);
    ctx.fillStyle = 'green';
    ctx.fillRect(canvas.width - 120, 12, player.health * 10, 20);
}

function updateHealthBar() {
    if (player.health <= 0) {
        gameover = true
    }
}



console.log(canvas.width, canvas.height)

let playerCollision =(player, objectColliededWith) => {
    let dx = player.x - objectColliededWith.x;
    let dy = player.y - objectColliededWith.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    // console.log('yes')
    return distance < player.width / 2 + objectColliededWith.width / 2;

}

let pickUpHealth = (player, healthPowerUp) => {
    let dx = player.x - healthPowerUp.x;
    let dy = player.y - healthPowerUp.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < player.width / 2 + healthPowerUp.width / 2;
}

// render and update player

function renderPlayer(ctx, player) {
    const maxHeight = canvas.height * 0.65 // Set the maximum height limit (e.g., 75% of the canvas height)

    if (player.slowedMovement) {
        const lerpFactor = 0.1 // Adjust this value to control the speed of interpolation
        player.x += (targetX - player.x) * lerpFactor
        player.y += (targetY - player.y) * lerpFactor
    } else {
        player.x = targetX
        player.y = targetY
    }

    // Apply the height limit
    // if (player.y < maxHeight) {
    //     player.y = maxHeight
    // }

    // ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas before drawing
    ctx.drawImage(playerImage, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height)
}

playerImage.onload = () => {
    gameLoop()
}

// check if enemy is hit by spell

function isColliding(spell, enemy) {
    let dx = spell.x - enemy.x;
    let dy = spell.y - enemy.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < spell.width / 2 + enemy.width / 2;
}

function updateScore(points) {
    score += points;
    scoreDiv.textContent = score;
    // console.log(score);
}

// create spell and fire upwards at interval

function fireBullet() {
    if (player.spell === 'fireball') {
        let spell = {
            x: player.x,
            y: player.y,
            width: 18,
            height: 18,
            color: 'orange',
            speed: 5,
            directionX: 0,
            directionY: -1,
            image: fireballBitmap
        };
        spells.push(spell);
    }
}

const frameWidth = 16;
const frameHeight = 16;
const totalFrames = 6; // Since the height is 96px and each frame is 16px, we have 6 frames
let currentFrame = 0;
const frameDuration = 100; // Duration of each frame in milliseconds
let lastFrameTime = 0;

function renderSpells(ctx, spells, timestamp) {
    if (timestamp - lastFrameTime > frameDuration) {
        currentFrame = (currentFrame + 1) % totalFrames;
        lastFrameTime = timestamp;
    }

    for (let i = 0; i < spells.length; i++) {
        ctx.drawImage(
            fireballBitmap,
            0, currentFrame * frameHeight, // Source x, y
            frameWidth, frameHeight, // Source width, height
            spells[i].x - spells[i].width / 2, spells[i].y - spells[i].height, // Destination x, y
            spells[i].width, spells[i].height // Destination width, height
        );
    }
}

let healthPowerUps = [];

// Function to create a health power-up
// Function to create a health power-up
function createHealthPowerUp(x, y) {
    healthPowerUps.push({
        x: x,
        y: y,
        width: 30,
        height: 30,
        speed: 1 // Speed at which the power-up moves down
    });
}

// Function to update health power-ups
function updateHealthPowerUps() {
    for (let i = 0; i < healthPowerUps.length; i++) {
        healthPowerUps[i].y += healthPowerUps[i].speed;

        // Remove the power-up if it goes off-screen
        if (healthPowerUps[i].y > canvas.height) {
            healthPowerUps.splice(i, 1);
            i--; // Adjust the index after removal
        }
    }
}

// Function to draw health power-ups
function drawHealthPowerUps(ctx) {
    for (let i = 0; i < healthPowerUps.length; i++) {
        // Save the current context state
        ctx.save();

        // Set the shadow properties for the subtle glow effect
        ctx.shadowColor = 'rgba(0, 255, 0, 0.3)'; // Subtle green glow
        ctx.shadowBlur = 10;

        // Draw the circular glow
        ctx.beginPath();
        ctx.arc(
            healthPowerUps[i].x + healthPowerUps[i].width / 2,
            healthPowerUps[i].y + healthPowerUps[i].height / 2,
            healthPowerUps[i].width / 2,
            0, Math.PI * 2
        );
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)'; // More transparent green
        ctx.fill();

        // Draw the health power-up image
        ctx.drawImage(
            healthPowerUpImg,
            healthPowerUps[i].x, healthPowerUps[i].y,
            healthPowerUps[i].width, healthPowerUps[i].height
        );

        // Restore the context state
        ctx.restore();
    }
}
function updateSpells() {
    let spellsToRemove = [];

    for (let i = 0; i < spells.length; i++) {
        spells[i].x += spells[i].directionX * spells[i].speed;
        spells[i].y += spells[i].directionY * spells[i].speed;

        // Check for collisions with blue aliens and remove the alien and add score
        for (let j = 0; j < blueAliens.length; j++) {
            if (isColliding(spells[i], blueAliens[j])) {
                const enemyX = blueAliens[j].x;
                const enemyY = blueAliens[j].y;
                blueAliens.splice(j, 1);
                spellsToRemove.push(i);
                j--;
                updateScore(10);
                if(Math.random() < powerUpChance) {
                    createHealthPowerUp(enemyX, enemyY);
                }
                break; // Exit the inner loop since the spell is removed
            }
        }

        // Check for collisions with red aliens and remove the alien and add score
        for (let j = 0; j < redAliens.length; j++) {
            if (isColliding(spells[i], redAliens[j])) {
                redAliens.splice(j, 1);
                spellsToRemove.push(i);
                j--;
                updateScore(20);
                break; // Exit the inner loop since the spell is removed
            }
        }

        // Check for collisions with purple aliens and remove the alien and add score
        for (let j = 0; j < purpleAliens.length; j++) {
            if (isColliding(spells[i], purpleAliens[j])) {
                purpleAliens.splice(j, 1);
                spellsToRemove.push(i);
                j--;
                updateScore(30);
                break; // Exit the inner loop since the spell is removed
            }
        }

        // Check for collisions with mine ships and remove the alien and add score
        for (let j = 0; j < mineShips.length; j++) {
            if (isColliding(spells[i], mineShips[j])) {
                mineShips.splice(j, 1);
                spellsToRemove.push(i);
                j--;
                updateScore(40);
                break; // Exit the inner loop since the spell is removed
            }
        }

        // Remove spells that are out of bounds
        if (spells[i].y < 0 || spells[i].y > canvas.height) {
            spellsToRemove.push(i);
        }
    }

    // Remove spells after the loop to avoid modifying the array while iterating
    for (let i = spellsToRemove.length - 1; i >= 0; i--) {
        spells.splice(spellsToRemove[i], 1);
    }
}

// Set the interval to fire bullets based on the player's firerate
setInterval(fireBullet, player.firerate);




// render and update blueAliens

function spawnBlueAlien() {
    if (blueAliens.length < maxBlueAliens) {
        let blueAlien = {
            x: Math.random() * canvas.width,
            y: Math.min(Math.random() * canvas.height, 300),
            // y: 10,
            width: 50,
            height: 50,
            color: 'blue',
            firerate: '1000',
            spell: 'fireball',
            fireType: 'single',
            seekingSpells: false,
            reverseControls: false,
            slowedMovement: false // Added this property to avoid undefined error
        }
        blueAliens.push(blueAlien)
        renderBlueAliens(ctx, blueAliens)

    }
}

setInterval(spawnBlueAlien, 1000)

function renderBlueAliens(ctx, blueAliens) {
    for (let i = 0; i < blueAliens.length; i++) {
        ctx.drawImage(alienBlueImg, blueAliens[i].x - blueAliens[i].width / 2, blueAliens[i].y - blueAliens[i].height / 2, blueAliens[i].width, blueAliens[i].height)
    }
}

let updateBlueAliens = () => {
    for (let i = 0; i < blueAliens.length; i++) {
        // Calculate direction towards player
        let directionX = player.x - blueAliens[i].x;
        let directionY = player.y - blueAliens[i].y;

        // Normalize the direction vector
        let length = Math.sqrt(directionX * directionX + directionY * directionY);
        if (length > 0) {
            directionX /= length;
            directionY /= length;
        }

        // Add randomness to movement
        let randomFactor = 0.5; // Adjust to control randomness strength
        let horizontalSpeed = 3; // Increase horizontal speed
        let verticalSpeed = 1; // Decrease vertical speed
        blueAliens[i].x += (directionX * horizontalSpeed + Math.random() * randomFactor - randomFactor / 2);
        blueAliens[i].y += (directionY * verticalSpeed + Math.random() * randomFactor - randomFactor / 2);

        // Avoid overlap with other blue aliens
        for (let j = 0; j < blueAliens.length; j++) {
            if (i !== j) {
                let dx = blueAliens[j].x - blueAliens[i].x;
                let dy = blueAliens[j].y - blueAliens[i].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < blueAliens[i].width) { // Assuming width = height for aliens
                    let overlap = blueAliens[i].width - distance;
                    blueAliens[i].x -= dx / distance * overlap / 2;
                    blueAliens[i].y -= dy / distance * overlap / 2;
                    blueAliens[j].x += dx / distance * overlap / 2;
                    blueAliens[j].y += dy / distance * overlap / 2;
                }
            }
        }



        // Optional: Keep the aliens within the canvas horizontally
        if (blueAliens[i].x < 0) {
            blueAliens[i].x = 0;
        } else if (blueAliens[i].x > canvas.width) {
            blueAliens[i].x = canvas.width;
        }

        // Ensure aliens don't get too close to the player
        let minDistanceToPlayer = 100; // Adjust as needed
        let dx = player.x - blueAliens[i].x;
        let dy = player.y - blueAliens[i].y;
        let distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        if (distanceToPlayer < minDistanceToPlayer) {
            blueAliens[i].x -= dx / distanceToPlayer * (minDistanceToPlayer - distanceToPlayer);
            blueAliens[i].y -= dy / distanceToPlayer * (minDistanceToPlayer - distanceToPlayer);
        }

        // ensure aliens dont overlap with red aliens

        for (let j = 0; j < redAliens.length; j++) {
            let dx = redAliens[j].x - blueAliens[i].x;
            let dy = redAliens[j].y - blueAliens[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < blueAliens[i].width) { // Assuming width = height for aliens
                let overlap = blueAliens[i].width - distance;
                blueAliens[i].x -= dx / distance * overlap / 2;
                blueAliens[i].y -= dy / distance * overlap / 2;
                redAliens[j].x += dx / distance * overlap / 2;
                redAliens[j].y += dy / distance * overlap / 2;
            }
        }

    }
}

function fireBlueAliensBullets () {
    for (let i = 0; i < blueAliens.length; i++) {
        let bullet = {
            x: blueAliens[i].x,
            y: blueAliens[i].y,
            width: 5,
            height: 5,
            color: 'blue',
            speed: 3,
            directionX: 0,
            directionY: 1,
        };
        blueAlienBullets.push(bullet);
    }
}

setInterval(fireBlueAliensBullets, 4000);



function renderBlueAlienBullets(ctx, blueAlienBullets) {
    for (let i = 0; i < blueAlienBullets.length; i++) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(blueAlienBullets[i].x, blueAlienBullets[i].y, 5, 5);
    }
}

function updateBlueAlienBullets() {
    for (let i = 0; i < blueAlienBullets.length; i++) {
        blueAlienBullets[i].y += 3;

        // Check if the bullet is out of bounds
        if (blueAlienBullets[i].y > canvas.height) {
            blueAlienBullets.splice(i, 1);
            i--;
        }
    }
}


// render and update redAliens

function spawnRedAlien() {
    if (redAliens.length < maxRedAliens) {
        let redAlien = {
            x: Math.random() * canvas.width,
            y: Math.min(Math.random() * canvas.height, 20),
            // y: 10,
            width: 50,
            height: 50,
            color: 'red',
            firerate: '1000',
            spell: 'fireball',
            fireType: 'single',
            seekingSpells: false,
            reverseControls: false,
            slowedMovement: false // Added this property to avoid undefined error
        }
        redAliens.push(redAlien)
        renderRedAliens(ctx, redAliens)

    }
}

setInterval(spawnRedAlien, 1000)

function renderRedAliens(ctx, redAliens) {
    for (let i = 0; i < redAliens.length; i++) {
        ctx.drawImage(alienRedImg, redAliens[i].x - redAliens[i].width / 2, redAliens[i].y - redAliens[i].height / 2, redAliens[i].width, redAliens[i].height)
    }
}

let updateRedAliens = () => {
    for (let i = 0; i < redAliens.length; i++) {
        // Calculate direction towards player
        let directionX = player.x - redAliens[i].x;
        let directionY = player.y - redAliens[i].y;

        // Normalize the direction vector
        let length = Math.sqrt(directionX * directionX + directionY * directionY);
        if (length > 0) {
            directionX /= length;
            directionY /= length;
        }

        // Add randomness to movement
        let randomFactor = 0.2; // Adjust to control randomness strength
        redAliens[i].x += (directionX + Math.random() * randomFactor - randomFactor / 2) * 2;
        redAliens[i].y += (directionY + Math.random() * randomFactor - randomFactor / 2) * 2;

        // Avoid overlap with other red aliens
        const minDistance = redAliens[i].width * 2; // Define a minimum distance

        for (let j = 0; j < redAliens.length; j++) {
            if (i !== j) {
                let dx = redAliens[j].x - redAliens[i].x;
                let dy = redAliens[j].y - redAliens[i].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
        
                if (distance < minDistance) { // Use the minimum distance
                    let overlap = minDistance - distance;
                    redAliens[i].x -= dx / distance * overlap / 2;
                    redAliens[i].y -= dy / distance * overlap / 2;
                    redAliens[j].x += dx / distance * overlap / 2;
                    redAliens[j].y += dy / distance * overlap / 2;
                }
            }
        }

        // Ensure the aliens stay within the top portion of the canvas
        // and keep distance from each other 
        if (redAliens[i].y > canvas.height * 0.15) {
            redAliens[i].y = canvas.height * 0.15
        }

        // Optional: Keep the aliens within the canvas horizontally
        if (redAliens[i].x < 0) {
            redAliens[i].x = 0;
        } else if (redAliens[i].x > canvas.width) {
            redAliens[i].x = canvas.width;
        }
    }
}

function fireRedAliensBullets () {
    for (let i = 0; i < redAliens.length; i++) {
        let bullet = {
            x: redAliens[i].x,
            y: redAliens[i].y,
            width: 5,
            height: 5,
            color: 'red',
            speed: 1,
            directionX: 0,
            directionY: 0,
        };
        redAlienBullets.push(bullet);
    }
}

setInterval(fireRedAliensBullets, 15000)

function renderRedAlienBullets(ctx, redAlienBullets) {
    for (let i = 0; i < redAlienBullets.length; i++) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(redAlienBullets[i].x, redAlienBullets[i].y, 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateRedAlienBullets() {
    for (let i = 0; i < redAlienBullets.length; i++) {
        redAlienBullets[i].y += redAlienBullets[i].speed;

        // Check if the bullet is out of bounds
        if (redAlienBullets[i].y > canvas.height) {
            redAlienBullets.splice(i, 1);
            i--;
        }
    }
}

// render and update purpleAliens
// they need to have a more random movement

function spawnPurpleAlien() {
    if (purpleAliens.length < maxPurpleAliens) {
        let purpleAlien = {
            x: Math.random() * canvas.width,
            y: Math.min(Math.random() * canvas.height, 20),
            // y: 10,
            width: 50,
            height: 50,
            color: 'purple',
            firerate: '1000',
            spell: 'fireball',
            fireType: 'single',
            seekingSpells: false,
            reverseControls: false,
            slowedMovement: false // Added this property to avoid undefined error
        }
        purpleAliens.push(purpleAlien)
        renderPurpleAliens(ctx, purpleAliens)

    }
}

setInterval(spawnPurpleAlien, 1000)

function renderPurpleAliens(ctx, purpleAliens) {
    for (let i = 0; i < purpleAliens.length; i++) {
        ctx.save(); // Save the current context state

        // Translate to the alien's position
        ctx.translate(purpleAliens[i].x, purpleAliens[i].y);

        // Rotate the context by the alien's rotation angle
        ctx.rotate(purpleAliens[i].rotation || 0);

        // Draw the alien image, adjusting for the center
        ctx.drawImage(alienPurpleImg, -purpleAliens[i].width / 2, -purpleAliens[i].height / 2, purpleAliens[i].width, purpleAliens[i].height);

        ctx.restore(); // Restore the context state
    }
}

let updatePurpleAliens = () => {
    for (let i = 0; i < purpleAliens.length; i++) {
        // Check if the alien has a direction, if not, assign a random direction
        if (!purpleAliens[i].direction) {
            let randomAngle = Math.random() * 2 * Math.PI;
            purpleAliens[i].direction = {
                x: Math.cos(randomAngle),
                y: Math.sin(randomAngle)
            };
        }

        // Slow speed factor
        let speed = 0.9; // Adjust to control speed

        // Update position with slow speed
        purpleAliens[i].x += purpleAliens[i].direction.x * speed;
        purpleAliens[i].y += purpleAliens[i].direction.y * speed;

        // Update rotation continuously at a faster speed
        let rotationSpeed = 0.037; // Adjust to control rotation speed
        purpleAliens[i].rotation = (purpleAliens[i].rotation || 0) + rotationSpeed;

        // Keep within canvas bounds
        if (purpleAliens[i].x < 0) {
            purpleAliens[i].x = 0;
            purpleAliens[i].direction.x *= -1;
        } else if (purpleAliens[i].x > canvas.width) {
            purpleAliens[i].x = canvas.width;
            purpleAliens[i].direction.x *= -1;
        }
        if (purpleAliens[i].y < 0) {
            purpleAliens[i].y = 0;
            purpleAliens[i].direction.y *= -1;
        } else if (purpleAliens[i].y > canvas.height) {
            purpleAliens[i].y = canvas.height;
            purpleAliens[i].direction.y *= -1;
        }

        // Ensure the aliens do not overlap with each other or other types of aliens
        for (let j = 0; j < purpleAliens.length; j++) {
            if (i !== j) {
                let dx = purpleAliens[j].x - purpleAliens[i].x;
                let dy = purpleAliens[j].y - purpleAliens[i].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < purpleAliens[i].width) { // Assuming width = height for aliens
                    let overlap = purpleAliens[i].width - distance;
                    purpleAliens[i].x -= dx / distance * overlap / 2;
                    purpleAliens[i].y -= dy / distance * overlap / 2;
                    purpleAliens[j].x += dx / distance * overlap / 2;
                    purpleAliens[j].y += dy / distance * overlap / 2;
                }
            }
        }

        for (let j = 0; j < blueAliens.length; j++) {
            let dx = blueAliens[j].x - purpleAliens[i].x;
            let dy = blueAliens[j].y - purpleAliens[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < purpleAliens[i].width) { // Assuming width = height for aliens
                let overlap = purpleAliens[i].width - distance;
                purpleAliens[i].x -= dx / distance * overlap / 2;
                purpleAliens[i].y -= dy / distance * overlap / 2;
                blueAliens[j].x += dx / distance * overlap / 2;
                blueAliens[j].y += dy / distance * overlap / 2;
            }
        }

        for (let j = 0; j < redAliens.length; j++) {
            let dx = redAliens[j].x - purpleAliens[i].x;
            let dy = redAliens[j].y - purpleAliens[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < purpleAliens[i].width) { // Assuming width = height for aliens
                let overlap = purpleAliens[i].width - distance;
                purpleAliens[i].x -= dx / distance * overlap / 2;
                purpleAliens[i].y -= dy / distance * overlap / 2;
                redAliens[j].x += dx / distance * overlap / 2;
                redAliens[j].y += dy / distance * overlap / 2;
            }
        }

        for (let j = 0; j < mineShips.length; j++) {
            let dx = mineShips[j].x - purpleAliens[i].x;
            let dy = mineShips[j].y - purpleAliens[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < purpleAliens[i].width) { // Assuming width = height for aliens
                let overlap = purpleAliens[i].width - distance;
                purpleAliens[i].x -= dx / distance * overlap / 2;
                purpleAliens[i].y -= dy / distance * overlap / 2;
                mineShips[j].x += dx / distance * overlap / 2;
                mineShips[j].y += dy / distance * overlap / 2;
            }
        }
    }
}

// purple need to always shoot from the direction it is facing

function firePurpleAliensBullets() {
    for (let i = 0; i < purpleAliens.length; i++) {
        let alien = purpleAliens[i];

        // Alien's rotation angle (in radians)
        let angle = alien.rotation || 0;

        // Calculate the spawn position (bottom center of the sprite, rotated)
        let spawnX = alien.x - Math.sin(angle) * (alien.height / 2);
        let spawnY = alien.y + Math.cos(angle) * (alien.height / 2);

        // Create the bullet object
        let bullet = {
            x: spawnX,
            y: spawnY,
            width: 4,
            height: 4,
            color: 'purple',
            speed: 3, // Adjust speed as needed
            directionX: -Math.sin(angle), // Bullet travels in the alien's rotated direction
            directionY: Math.cos(angle),
        };

        purpleAlienBullets.push(bullet);
    }
}

setInterval(firePurpleAliensBullets, 1000);

function renderPurpleAlienBullets(ctx, purpleAlienBullets) {
    for (let i = 0; i < purpleAlienBullets.length; i++) {
        let bullet = purpleAlienBullets[i];

        // Draw the bullet as a small circle
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 6, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updatePurpleAlienBullets() {
    for (let i = 0; i < purpleAlienBullets.length; i++) {
        let bullet = purpleAlienBullets[i];

        // Update bullet position based on its direction
        bullet.x += bullet.directionX * bullet.speed;
        bullet.y += bullet.directionY * bullet.speed;

        // Remove bullets if they go out of bounds
        if (
            bullet.y > canvas.height ||
            bullet.y < 0 ||
            bullet.x > canvas.width ||
            bullet.x < 0
        ) {
            purpleAlienBullets.splice(i, 1);
            i--;
        }
    }
}

// render and update mineShips



function spawnMineShip() {
    if (mineShips.length < maxMineShips) {
        let mineShip = {
            x: Math.random() * canvas.width,
            y: Math.min(Math.random() * canvas.height, 500),
            // y: 10,
            width: 50,
            height: 50,
            color: 'purple',
            firerate: '1000',
            spell: 'fireball',
            fireType: 'single',
            seekingSpells: false,
            reverseControls: false,
            slowedMovement: false // Added this property to avoid undefined error
        }
        mineShips.push(mineShip)
        renderMineShips(ctx, mineShips)

    }
}

setInterval(spawnMineShip, 16000)

function renderMineShips(ctx, mineShips) {
    for (let i = 0; i < mineShips.length; i++) {
        ctx.save(); // Save the current context state

        // Translate to the mine ship's position
        ctx.translate(mineShips[i].x, mineShips[i].y);

        // Rotate the context by the mine ship's rotation angle
        ctx.rotate(mineShips[i].rotation || 0);

        // Draw the mine ship image, adjusting for the center
        ctx.drawImage(alienMineImg, -mineShips[i].width / 2, -mineShips[i].height / 2, mineShips[i].width, mineShips[i].height);

        ctx.restore(); // Restore the context state
    }
}

let updateMineShips = () => {
    for (let i = 0; i < mineShips.length; i++) {
        // Calculate direction towards player
        let directionX = player.x - mineShips[i].x;
        let directionY = player.y - mineShips[i].y;

        // Normalize the direction vector
        let length = Math.sqrt(directionX * directionX + directionY * directionY);
        if (length > 0) {
            directionX /= length;
            directionY /= length;
        }

        // Move the mine ship towards the player
        let speed = 5; // Adjust speed as needed
        mineShips[i].x += directionX * speed;
        mineShips[i].y += directionY * speed;

        // Calculate the rotation angle
        mineShips[i].rotation = Math.atan2(directionY, directionX);

        // Ensure the mine ships do not overlap with each other
        for (let j = 0; j < mineShips.length; j++) {
            if (i !== j) {
                let dx = mineShips[j].x - mineShips[i].x;
                let dy = mineShips[j].y - mineShips[i].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mineShips[i].width) { // Assuming width = height for mine ships
                    let overlap = mineShips[i].width - distance;
                    mineShips[i].x -= dx / distance * overlap / 2;
                    mineShips[i].y -= dy / distance * overlap / 2;
                    mineShips[j].x += dx / distance * overlap / 2;
                    mineShips[j].y += dy / distance * overlap / 2;
                }
            }
        }

        // Ensure the mine ships do not overlap with other aliens
        for (let j = 0; j < purpleAliens.length; j++) {
            let dx = purpleAliens[j].x - mineShips[i].x;
            let dy = purpleAliens[j].y - mineShips[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mineShips[i].width) { // Assuming width = height for mine ships
                let overlap = mineShips[i].width - distance;
                mineShips[i].x -= dx / distance * overlap / 2;
                mineShips[i].y -= dy / distance * overlap / 2;
                purpleAliens[j].x += dx / distance * overlap / 2;
                purpleAliens[j].y += dy / distance * overlap / 2;
            }
        }

        for (let j = 0; j < blueAliens.length; j++) {
            let dx = blueAliens[j].x - mineShips[i].x;
            let dy = blueAliens[j].y - mineShips[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mineShips[i].width) { // Assuming width = height for mine ships
                let overlap = mineShips[i].width - distance;
                mineShips[i].x -= dx / distance * overlap / 2;
                mineShips[i].y -= dy / distance * overlap / 2;
                blueAliens[j].x += dx / distance * overlap / 2;
                blueAliens[j].y += dy / distance * overlap / 2;
            }
        }
    }

}


let renderGameScreen = (ctx, timestamp) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    renderBackground(ctx);
    
    
    renderPlayer(ctx, player);
    renderSpells(ctx, spells, timestamp);
    updateSpells();
    
    
    renderBlueAliens(ctx, blueAliens)
    updateBlueAliens()
    renderBlueAlienBullets(ctx, blueAlienBullets)
    updateBlueAlienBullets()
    
    renderRedAliens(ctx, redAliens)
    updateRedAliens()
    renderRedAlienBullets(ctx, redAlienBullets)
    updateRedAlienBullets()
    
    
    renderPurpleAliens(ctx, purpleAliens)
    updatePurpleAliens()
    renderPurpleAlienBullets(ctx, purpleAlienBullets)
    updatePurpleAlienBullets()
    
    renderMineShips(ctx, mineShips)
    updateMineShips()
    
    updateHealthPowerUps();
    drawHealthPowerUps(ctx);
    
    updateStars();
    
    renderHealthBar(ctx, player)
    
    // playerCollision(player, mineShips)
    console.log(`player health: ${player.health}`)
    mineShips.forEach((mineShip) => {
        if (playerCollision(player, mineShip)) {
            mineShips.splice(mineShip, 1)
            player.health -= 1
            updateHealthBar()
        }
    }
    )
    
    purpleAlienBullets.forEach((bullet) => {
        if (playerCollision(player, bullet)) {
            purpleAlienBullets.splice(bullet, 1)
            player.health -= 1
            updateHealthBar()
        }
    }
    
    )
    
    blueAlienBullets.forEach((bullet) => {
        if (playerCollision(player, bullet)) {
            blueAlienBullets.splice(bullet, 1)
            player.health -= 1
            updateHealthBar()
        }
    }
    )
    
    redAlienBullets.forEach((bullet) => {
        if (playerCollision(player, bullet)) {
            redAlienBullets.splice(bullet, 1)
            player.health -= 2
            updateHealthBar()
        }
    }
    
    )
    
    healthPowerUps.forEach((powerUp) => {
        if (playerCollision(player, powerUp)) {
    
            if(player.health <= player.maxHealth) {
                healthPowerUps.splice(powerUp, 1)
                player.health += 1
                updateHealthBar()
    
            }
        }
    }
    )

    if (player.health <= 0) {
        console.log('game over')
        currentState = 'gameOverScreen'
    }
}



// start screen code

let title = new Image();
title.src = './img/title.png';

let mage = new Image();
mage.src = './img/space-wizard.png';

function drawTitle() {
    const size = Math.min(canvas.width, canvas.height) * 0.5; // 50% of the smaller dimension
    ctx.drawImage(title, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
}

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

function renderBackgroundStartScreen(ctx) {
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
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = canvas.height - 100;

    // Draw button rectangle
    ctx.fillStyle = 'white';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Draw button text
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Start', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

let drawCreditsButton = () => {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = canvas.height - 200;

    // Draw button rectangle
    ctx.fillStyle = 'white';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Draw button text
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Credits', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

let renderStartScreen = (ctx) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!isAnimating) return;
    renderBackgroundStartScreen(ctx);
    updatestarz()
    drawMatrix()
    drawTitle()
    drawStartScreenText();
    // drawCreditsButton();
    drawMage();
    updateMage();
}

// game over screen code

let renderGameOverScreen = (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the background with black
    ctx.font = '48px serif';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    gameRestartButton(ctx);
}

let gameRestartButton = (ctx) => {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = canvas.height / 2 + 60;

    // Draw button rectangle
    ctx.fillStyle = 'white';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Draw button text
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Restart', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

    // Add event listener for button click
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
            restartGame();
        }
    }, { once: true });
}

let restartGame = () => {
    // Reset game state and variables
    // player.health = player.maxHealth;
    // player.x = canvas.width / 2;
    // player.y = canvas.height - 50;
    // player.spells = [];
    // blueAliens = [];
    // redAliens = [];
    // purpleAliens = [];
    // mineShips = [];
    // blueAlienBullets = [];
    // redAlienBullets = [];
    // purpleAlienBullets = [];
    // healthPowerUps = [];
    // stars = [];
    // isAnimating = true;

    // score = 0;
    // currentState = GameState.START_SCREEN;
    // // Reset other game variables as needed

    location.reload();
    
}



let gameLoop = (timestamp) => {

    switch (currentState) {
        case GameState.START_SCREEN:
            renderStartScreen(ctx);
            break;
        case GameState.GAME_SCREEN:
            renderGameScreen(ctx, timestamp);
            break;
        case GameState.GAME_OVER:
            renderGameOverScreen(ctx);
            break;
    }

    // renderGameScreen(ctx, timestamp)

    // if(gameover) {
    //     ctx.font = '48px serif';
    //     ctx.fillStyle = 'red';
    //     ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);

    //     return;
    // }

    requestAnimationFrame(gameLoop);
};





canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (currentState === GameState.START_SCREEN) {
        if (mouseX >= (canvas.width - 200) / 2 && mouseX <= (canvas.width - 200) / 2 + 200 &&
            mouseY >= canvas.height - 100 && mouseY <= canvas.height - 50) {
            currentState = GameState.GAME_SCREEN;
            isAnimating = true;
            scoreDiv.style.display = 'block';
        }
    }
}
)


canvas.addEventListener('mousemove', (event) => {
    handleMouseMove(event.clientX, event.clientY);
});

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault()
    const touch = event.touches[0];
    handleMouseMove(touch.clientX, touch.clientY - 10 );
});

function handleMouseMove(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    if (player.reverseControls) {
        // Reverse the movement direction
        targetX = canvas.width - mouseX;
        targetY = canvas.height - mouseY;
    } else {
        // Normal movement
        targetX = mouseX;
        targetY = mouseY;
    }
}
