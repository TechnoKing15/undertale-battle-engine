const soulElement = document.getElementById("soul");
const battleBox = document.getElementById("battle-box");

let keysPressed = {};

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyRelease);

function handleKeyPress(event) {
    keysPressed[event.key] = true;
    console.log("Key pressed:", event.key);
}

function handleKeyRelease(event) {
    keysPressed[event.key] = false;
    console.log("Key released:", event.key);
}

function updateSoulPosition() {
    const speed = 5;
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
    requestAnimationFrame(gameLoop);
}

// Initialize soul position
soulElement.style.left = '235px';
soulElement.style.top = '235px';
soulElement.style.transform = 'translate(-50%, -50%)';

gameLoop();

console.log("Script loaded");