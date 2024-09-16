const soulElement = document.getElementById("soul");
const battleBox = document.getElementById("battle-box");

let keysPressed = {};
let playerHP = 20;
const maxHP = 20;

function createProjectile() {
    const projectile = document.createElement("div");
    projectile.classList.add("projectile");
    battleBox.appendChild(projectile);

    const startPosition = Math.random() * battleBox.offsetWidth;
    projectile.style.left = `${startPosition}px`;
    projectile.style.top = "-10px";

    return projectile;
}

function moveProjectile(projectile) {
    const currentTop = parseInt(projectile.style.top);
    projectile.style.top = `${currentTop + 5}px`;

    if (currentTop > battleBox.offsetHeight) {
        battleBox.removeChild(projectile);
        return false;
    }

    return true;
}

function checkCollision(projectile) {
    const projectileRect = projectile.getBoundingClientRect();
    const soulRect = soulElement.getBoundingClientRect();

    return !(projectileRect.right < soulRect.left || 
             projectileRect.left > soulRect.right || 
             projectileRect.bottom < soulRect.top || 
             projectileRect.top > soulRect.bottom);
}

function updateHP(damage) {
    const oldHP = playerHP;
    playerHP = Math.max(0, playerHP - damage);
    const hpValueElement = document.querySelector('.hp-value');
    const playerBarElement = document.querySelector('.player-bar');

    hpValueElement.textContent = `${playerHP} / ${maxHP}`;
    
    const damagedPercentage = ((maxHP - playerHP) / maxHP) * 100;
    playerBarElement.style.setProperty('--damaged-width', `${damagedPercentage}%`);

    console.log(`HP updated: ${playerHP} / ${maxHP}`);

    if (playerHP === 0 && !document.body.classList.contains('game-over')) {
        console.log('Player HP reached 0, triggering game over');
        showGameOverOptions();
    }
}

function showGameOverOptions() {
    console.log('Showing game over options');
    const gameOverOptions = document.querySelector('.game-over-options');
    gameOverOptions.style.display = 'flex';
    gameOverOptions.style.zIndex = '9999';

    soulElement.style.position = 'fixed';
    soulElement.style.left = '50%';
    soulElement.style.top = '50%';
    soulElement.style.transform = 'translate(-50%, -50%)';
    soulElement.style.width = '20px';
    soulElement.style.height = '20px';
    soulElement.style.backgroundColor = 'red';
    soulElement.style.backgroundImage = 'none';
    soulElement.style.display = 'block';
    soulElement.style.zIndex = '10000';

    // Force a reflow to ensure the changes are applied
    void gameOverOptions.offsetWidth;

    console.log('Game over options displayed');
    console.log('Game over options element:', gameOverOptions);
    console.log('Game over options display:', gameOverOptions.style.display);
    console.log('Game over options z-index:', gameOverOptions.style.zIndex);

    // Stop the game loop
    cancelAnimationFrame(gameLoopId);

    // Clear all projectiles
    projectiles.forEach(projectile => battleBox.removeChild(projectile));
    projectiles = [];

    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('keyup', handleKeyRelease);
    document.addEventListener('keydown', handleGameOverKeyPress);

    // Add this line to ensure the game over options are visible
    document.body.classList.add('game-over');
}

function handleGameOverKeyPress(event) {
    const continueOption = document.getElementById('continue');
    const giveUpOption = document.getElementById('give-up');
    const soulRect = soulElement.getBoundingClientRect();
    const continueRect = continueOption.getBoundingClientRect();
    const giveUpRect = giveUpOption.getBoundingClientRect();

    if (event.key === 'ArrowLeft') {
        soulElement.style.left = `${continueRect.left + continueRect.width / 2}px`;
        soulElement.style.top = `${continueRect.top + continueRect.height / 2}px`;
    } else if (event.key === 'ArrowRight') {
        soulElement.style.left = `${giveUpRect.left + giveUpRect.width / 2}px`;
        soulElement.style.top = `${giveUpRect.top + giveUpRect.height / 2}px`;
    }

    updateOptionColors();
}

function updateOptionColors() {
    const continueOption = document.getElementById('continue');
    const giveUpOption = document.getElementById('give-up');
    const soulRect = soulElement.getBoundingClientRect();
    const continueRect = continueOption.getBoundingClientRect();
    const giveUpRect = giveUpOption.getBoundingClientRect();

    const distanceToContinue = Math.abs(soulRect.left - continueRect.left);
    const distanceToGiveUp = Math.abs(soulRect.left - giveUpRect.left);

    continueOption.style.color = distanceToContinue <= 10 ? '#f0fc04' : 'white';
    giveUpOption.style.color = distanceToGiveUp <= 10 ? '#f0fc04' : 'white';
}

let projectiles = [];

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyRelease);
document.addEventListener("keydown", handleQPress);

function typeText(element, text, speed) {
    let i = 0;
    element.innerHTML = '';
    function typing() {
        if (i < text.length) {
            if (text.substr(i, 8) === '<strong>') {
                element.innerHTML += '<strong>';
                i += 8;
            } else if (text.substr(i, 9) === '</strong>') {
                element.innerHTML += '</strong>';
                i += 9;
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(typing, speed);
        }
    }
    typing();
}

function handleQPress(event) {
    if (event.key === 'q') {
        const helloWorld = document.getElementById('hello-world');
        const text = "* The air crackles with <strong>E.</strong>";
        typeText(helloWorld, text, 30);
    }
}

function handleKeyPress(event) {
    keysPressed[event.key] = true;
    console.log("Key pressed:", event.key);
}

function handleKeyRelease(event) {
    keysPressed[event.key] = false;
    console.log("Key released:", event.key);
}

function updateSoulPosition() {
    const speed = 6;
    let dx = 0;
    let dy = 0;
    
    if (keysPressed['ArrowLeft']) dx -= speed;
    if (keysPressed['ArrowRight']) dx += speed;
    if (keysPressed['ArrowUp']) dy -= speed;
    if (keysPressed['ArrowDown']) dy += speed;
    
    if (dx !== 0 || dy !== 0) {
        moveSoul(dx, dy);
    }
}

function moveSoul(dx, dy) {
    const battleBoxRect = battleBox.getBoundingClientRect();
    const soulRect = soulElement.getBoundingClientRect();

    let newLeft = soulElement.offsetLeft + dx;
    let newTop = soulElement.offsetTop + dy;

    newLeft = Math.max(0, Math.min(newLeft, battleBoxRect.width - soulRect.width));
    newTop = Math.max(0, Math.min(newTop, battleBoxRect.height - soulRect.height));

    soulElement.style.left = `${newLeft}px`;
    soulElement.style.top = `${newTop}px`;

    console.log("Soul position:", newLeft, newTop);
}

function gameLoop() {
    updateSoulPosition();

    if (Math.random() < 0.02) {
        projectiles.push(createProjectile());
    }

    projectiles = projectiles.filter(projectile => {
        if (moveProjectile(projectile)) {
            if (checkCollision(projectile)) {
                battleBox.removeChild(projectile);
                updateHP(3);
                return false;
            }
            return true;
        }
        return false;
    });

    gameLoopId = requestAnimationFrame(gameLoop);
}

// Initialize soul position
soulElement.style.left = '235px';
soulElement.style.top = '235px';
soulElement.style.transform = 'translate(-50%, -50%)';

gameLoopId = requestAnimationFrame(gameLoop);

console.log("Script loaded");