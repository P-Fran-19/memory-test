const board = document.getElementById('board');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const timeEl = document.getElementById('time');
const movesEl = document.getElementById('moves');

let flippedCards = [];
let moves = 0;
let time = 0;
let timer;
let matchedPairs = 0;
let gameStarted = false;

// Lista de símbolos para las cartas
const symbols = ['🍎', '🍊', '🍓', '🍇', '🍌', '🍒', '🍍', '🥝'];
let shuffledSymbols = [];

// Inicializa el tablero
function initializeBoard() {
    shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    board.innerHTML = '';
    shuffledSymbols.forEach((symbol) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.innerHTML = `<span>${symbol}</span>`;
        board.appendChild(card);
    });
}

// Maneja el botón Start
function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', handleCardClick);
        card.classList.add('hidden'); // Oculta las frutas solo cuando el juego comienza
        card.classList.remove('flipped', 'matched');
    });

    // Inicia el temporizador
    time = 0;
    timer = setInterval(() => {
        time++;
        timeEl.textContent = time;
    }, 1000);
}

// Reinicia el juego
function restartGame() {
    clearInterval(timer);
    moves = 0;
    time = 0;
    matchedPairs = 0;
    gameStarted = false;
    flippedCards = [];
    timeEl.textContent = time;
    movesEl.textContent = moves;
    initializeBoard();
}

// Maneja el clic en las cartas
function handleCardClick(e) {
    if (!gameStarted) return;

    const card = e.currentTarget;

    // Evita que se volteen más de 2 cartas o que se vuelvan a voltear las emparejadas
    if (
        flippedCards.length < 2 &&
        !card.classList.contains('flipped') &&
        !card.classList.contains('matched')
    ) {
        flipCard(card);
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Voltea una carta
function flipCard(card) {
    card.classList.remove('hidden');
    card.classList.add('flipped');
}

// Devuelve una carta a su estado inicial
function unflipCard(card) {
    card.classList.remove('flipped');
    card.classList.add('hidden');
}

// Verifica si las cartas coinciden
function checkMatch() {
    moves++;
    movesEl.textContent = moves;

    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;

        if (matchedPairs === symbols.length) {
            clearInterval(timer);
            setTimeout(() => alert(`¡Ganaste en ${moves} movimientos y ${time} segundos!`), 500);
        }
    } else {
        setTimeout(() => {
            unflipCard(card1);
            unflipCard(card2);
        }, 1000);
    }

    flippedCards = [];
}

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// Inicializa el juego al cargar la página
initializeBoard();
