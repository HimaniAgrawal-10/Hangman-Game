
const wordCategories = {
  Tech: ["computer", "javascript", "coding", "algorithm"],
  College: ["assignment", "lecture", "project", "campus"],
  Science: ["gravity", "energy", "atom", "biology"]
};

let selectedWord, guessedWord;
let wrongGuesses = [];
let score = 0;
let maxLives = 8;

const wordDisplay = document.getElementById("word-display");
const message = document.getElementById("message");
const wrong = document.getElementById("wrong");
const keyboard = document.getElementById("keyboard");

const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

function startGame() {
  const categories = Object.keys(wordCategories);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  const words = wordCategories[randomCategory];
  selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

  document.getElementById("category").textContent = randomCategory;

  guessedWord = Array(selectedWord.length).fill("_");
  wrongGuesses = [];

  updateDisplay();
  createKeyboard();
  message.textContent = "";
  drawHangman(0);
}

function updateDisplay() {
  wordDisplay.textContent = guessedWord.join(" ");
  wrong.textContent = wrongGuesses.join(" ");
  document.getElementById("lives").textContent = maxLives - wrongGuesses.length;
}

function createKeyboard() {
  keyboard.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    let btn = document.createElement("button");
    btn.textContent = String.fromCharCode(i);
    btn.addEventListener("click", () => guessLetter(btn));
    keyboard.appendChild(btn);
  }
}

function guessLetter(btn) {
  const letter = btn.textContent;
  btn.disabled = true;

  if (selectedWord.includes(letter)) {
    btn.classList.add("correct");
    for (let i = 0; i < selectedWord.length; i++) {
      if (selectedWord[i] === letter) guessedWord[i] = letter;
    }
  } else {
    btn.classList.add("wrong");
    wrongGuesses.push(letter);
    drawHangman(wrongGuesses.length);
  }

  updateDisplay();
  checkGameOver();
}

function checkGameOver() {
  if (!guessedWord.includes("_")) {
    score += 10;
    document.getElementById("score").textContent = score;
    message.textContent = "🎉 You Won!";
    disableAllButtons();
  } 
  else if (wrongGuesses.length >= maxLives) {
    message.textContent = "💀 You Lost! Word was: " + selectedWord;
    disableAllButtons();
  }
}

function disableAllButtons() {
  document.querySelectorAll("#keyboard button").forEach(btn => btn.disabled = true);
}

// 🎨 Canvas drawing
function drawHangman(stage) {
  ctx.lineWidth = 3;

  switch(stage) {
    case 0:
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      break;
    case 1:
      ctx.fillRect(10, 240, 180, 5);
      break;
    case 2:
      ctx.fillRect(50, 20, 5, 220);
      ctx.fillRect(50, 20, 80, 5);
      ctx.fillRect(130, 20, 5, 20);
      break;
    case 3:
      ctx.beginPath();
      ctx.arc(130, 60, 20, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 4:
      ctx.fillRect(130, 80, 2, 70);
      break;
    case 5:
      ctx.beginPath();
      ctx.moveTo(130, 100);
      ctx.lineTo(100, 130);
      ctx.stroke();
      break;
    case 6:
      ctx.beginPath();
      ctx.moveTo(130, 100);
      ctx.lineTo(160, 130);
      ctx.stroke();
      break;
    case 7:
      ctx.beginPath();
      ctx.moveTo(130, 150);
      ctx.lineTo(100, 190);
      ctx.stroke();
      break;
    case 8:
      ctx.beginPath();
      ctx.moveTo(130, 150);
      ctx.lineTo(160, 190);
      ctx.stroke();
      break;
  }
}

// ⌨️ Keyboard typing support
document.addEventListener("keydown", (e) => {
  const letter = e.key.toUpperCase();
  const btn = [...document.querySelectorAll("#keyboard button")]
    .find(b => b.textContent === letter);

  if (btn && !btn.disabled) {
    guessLetter(btn);
  }
});

// 🌗 Dark mode
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("restart").addEventListener("click", startGame);

startGame();