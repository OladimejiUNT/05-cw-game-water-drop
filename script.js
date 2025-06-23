// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval; // Add this at the top with other variables

// Arrays for win and lose messages
const winMessages = [
  "Great job! 💧",
  "You’re a water hero! 🌊",
  "Awesome catching!",
  "Hydration champion!",
  "You saved the drops!"
];
const loseMessages = [
  "Time's up! Try again!",
  "Don't give up!",
  "Keep practicing!",
  "Drops got away!",
  "Better luck next time!"
];

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
// Add event listener for reset button
document.getElementById("reset-btn").addEventListener("click", resetGame);

function startGame() {
  if (gameRunning) return;

  gameRunning = true;

  // Hide message box at start
  document.getElementById("message-box").style.display = "none";
  document.getElementById("message-box").textContent = "";

  // Reset score and timer display
  document.getElementById("score").textContent = "0";
  document.getElementById("time").textContent = "30";

  // Remove any existing drops
  clearDrops();

  // Start 30-second countdown timer
  let timeLeft = 30;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  clearInterval(dropMaker);
  gameRunning = false;

  // Remove any remaining drops
  clearDrops();

  // Show random win/lose message
  const score = parseInt(document.getElementById("score").textContent, 10);
  let messageArr = score > 0 ? winMessages : loseMessages;
  let msg = messageArr[Math.floor(Math.random() * messageArr.length)];
  document.getElementById("message-box").style.display = "block";
  document.getElementById("message-box").textContent = msg;
}

function resetGame() {
  clearInterval(timerInterval);
  clearInterval(dropMaker);
  gameRunning = false;
  document.getElementById("score").textContent = "0";
  document.getElementById("time").textContent = "30";
  document.getElementById("message-box").style.display = "none";
  document.getElementById("message-box").textContent = "";
  clearDrops();
}

function clearDrops() {
  const container = document.getElementById("game-container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Randomly make some drops "bad"
  const isBad = Math.random() < 0.25; // 25% chance to be bad
  if (isBad) {
    drop.classList.add("bad-drop");
  }

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Visual feedback on click and scoring
  drop.addEventListener("click", () => {
    drop.classList.add("clicked");
    // Update score
    const scoreElem = document.getElementById("score");
    let score = parseInt(scoreElem.textContent, 10);
    if (drop.classList.contains("bad-drop")) {
      score -= 1;
    } else {
      score += 1;
    }
    scoreElem.textContent = score;
    setTimeout(() => drop.remove(), 300); // Remove after animation
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
