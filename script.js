const gameContainer = document.getElementById('game-container');
const menu = document.getElementById('menu');
const gameBoard = document.getElementById('game-board');
const scoreBoard = document.getElementById('scoreboard');
const scoreDisplay = document.getElementById('score');
const endMessage = document.getElementById('end-message');
const playAgainButton = document.getElementById('play-again-button');
const loseMessage = document.getElementById('lose-message');
const tryAgainButton = document.getElementById('try-again-button');
const finalScoreDisplay = document.getElementById('final-score');
const levelSelect = document.getElementById('level-select');
const startButton = document.getElementById('start-button');
const opportunitiesDisplay = document.getElementById('opportunities');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pairsFound = 0;
let totalPairs = 0;
let opportunities = 0;
let score = 0;

const cardData = {
  1: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
  2: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg'],
  3: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg', 'img10.jpg', 'img11.jpg', 'img12.jpg']
};

function addTouchAndClickListener(element, handler) {
  element.addEventListener('click', handler);
  element.addEventListener('touchstart', handler);
}

addTouchAndClickListener(startButton, startGame);
addTouchAndClickListener(playAgainButton, () => {
  endMessage.classList.add('hidden');
  gameBoard.innerHTML = '';
  gameBoard.classList.add('hidden');
  scoreBoard.classList.add('hidden');
  menu.classList.remove('hidden');
  pairsFound = 0;
  score = 0;
  resetBoard();
});
addTouchAndClickListener(tryAgainButton, resetGame);

function startGame() {
  // Limpiar tablero y restablecer variables
  gameBoard.innerHTML = ''; // Eliminar cartas anteriores
  pairsFound = 0;
  score = 0;
  opportunities = 0;

  menu.classList.add('hidden');
  gameBoard.classList.remove('hidden');
  scoreBoard.classList.remove('hidden');
  endMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  switch (parseInt(levelSelect.value)) {
    case 1:
      opportunities = 4; // Nivel 1: 4 oportunidades
      totalPairs = 4;
      break;
    case 2:
      opportunities = 6; // Nivel 2: 6 oportunidades
      totalPairs = 6;
      break;
    case 3:
      opportunities = 12; // Nivel 3: 8 oportunidades
      totalPairs = 12;
      break;
  }

  opportunitiesDisplay.textContent = opportunities;
  scoreDisplay.textContent = score;
  createBoard(parseInt(levelSelect.value));
}

function createBoard(level) {
  const images = cardData[level];
  const shuffledImages = [...images, ...images].sort(() => 0.5 - Math.random());

  // Set grid template based on level
  switch (level) {
    case 1:
      gameBoard.style.gridTemplateColumns = 'repeat(4, 100px)';
      gameBoard.style.gridTemplateRows = 'repeat(2, 100px)';
      break;
    case 2:
      gameBoard.style.gridTemplateColumns = 'repeat(4, 100px)';
      gameBoard.style.gridTemplateRows = 'repeat(3, 100px)';
      break;
    case 3:
      gameBoard.style.gridTemplateColumns = 'repeat(6, 100px)';
      gameBoard.style.gridTemplateRows = 'repeat(4, 100px)';
      break;
  }

  shuffledImages.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front" style="background-image: url('images/${image}')"></div>
        <div class="card-back"></div>
      </div>
    `;
    addTouchAndClickListener(card, flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard(event) {
  event.preventDefault(); // Evitar comportamiento predeterminado
  if (lockBoard || this === firstCard) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const firstImage = firstCard.querySelector('.card-front').style.backgroundImage;
  const secondImage = secondCard.querySelector('.card-front').style.backgroundImage;

  if (firstImage === secondImage) {
    disableCards();
  } else {
    opportunities--;
    opportunitiesDisplay.textContent = opportunities;
    if (opportunities <= 0) {
      setTimeout(() => {
        gameBoard.classList.add('hidden');
        loseMessage.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
      }, 500);
    } else {
      unflipCards();
    }
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  firstCard.removeEventListener('touchstart', flipCard);
  secondCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('touchstart', flipCard);
  resetBoard();
  pairsFound++;
  score++;
  scoreDisplay.textContent = score;

  if (pairsFound === totalPairs) {
    setTimeout(() => {
      gameBoard.classList.add('hidden');
      endMessage.classList.remove('hidden');
    }, 500);
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetGame() {
  loseMessage.classList.add('hidden');
  gameBoard.innerHTML = '';
  gameBoard.classList.add('hidden');
  scoreBoard.classList.add('hidden');
  menu.classList.remove('hidden');
  pairsFound = 0;
  score = 0;
  resetBoard();
}
