let isPaused = false;  // Variável que controla o estado de pausa

function toggleFullScreen() {
    // Verifica se já está em tela cheia
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      enterFullScreen(); // Se não estiver em tela cheia, entra em tela cheia
    } else {
      exitFullScreen();  // Se estiver em tela cheia, sai da tela cheia
    }
  }
  
  // Entra em tela cheia
  function enterFullScreen() {
    const element = document.documentElement; // O documento inteiro
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {    // Firefox
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {     // IE/Edge
      element.msRequestFullscreen();
    }
  }
  
  // Sai da tela cheia
  function exitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {  // Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {     // IE/Edge
      document.msExitFullscreen();
    }
  }

document.addEventListener('keydown', (event) => {
    if (event.key === 'enter' || event.key === 'Enter') {
        toggleFullScreen(); 
    }
});

// Obtendo o elemento de áudio
const music = document.getElementById('background-music');
const musicButton = document.getElementById('music-button');
const musicIcon = document.getElementById('music-icon');

// Função para controlar a música (Tocar / Pausar)
function toggleMusic() {
    if (music.paused) {
        music.play();  
        musicIcon.src = "Assets/img/som.png"; // Altera o ícone para "som"
    } else {
        music.pause();  
        musicIcon.src = "Assets/img/mudo.png"; // Altera o ícone para "mudo"
    }
}

// Função para ajustar o volume da música
function setVolume(value) {
    if (value >= 0 && value <= 1) {
        music.volume = value;
    }
}

// Garantir que a música seja carregada corretamente
window.addEventListener('click', () => {
    music.play();
}, { once: true }); // Garante que a música será ativada uma única vez com interação

// Garantir que a música comece a tocar automaticamente quando a página for carregada
window.onload = function() {
    music.play().catch(error => {
        console.log("Erro ao tentar tocar música: ", error);
    });
    musicIcon.src = "Assets/img/som.png";  // Altera o ícone para "som" assim que o áudio começa
};

// Função para alternar o som ao pressionar "m"
document.addEventListener('keydown', (event) => {
    if (event.key === 'm' || event.key === 'M') {
        toggleMusic(); // Alterna entre mutar e desmutar o som
    }
});

// Definindo o deck de cartas
const cards = [
    { id: 1, image: 'Assets/img/cartas/1.png' },
    { id: 2, image: 'Assets/img/cartas/2.png' },
    { id: 3, image: 'Assets/img/cartas/3.png' },
    { id: 4, image: 'Assets/img/cartas/4.png' },
    { id: 5, image: 'Assets/img/cartas/5.png' },
    { id: 6, image: 'Assets/img/cartas/6.png' },
];

let deck = [...cards, ...cards];
deck = deck.sort(() => 0.5 - Math.random());

// Obtendo elementos HTML
const board = document.getElementById('card-grid');
const timerElement = document.getElementById('time');
const attemptsElement = document.getElementById('attempts');
const scoreElement = document.getElementById('score');
const overlay = document.getElementById('overlay');
const message = document.getElementById('message');

let flippedCards = [];
let attempts = 20;    // Tentativas restantes
let timeLeft = 120;    // Tempo restante
let score = 0;        // Pontuação do jogador
let consecutivePairs = 0; // Número de pares consecutivos acertados

// Exibindo as cartas no tabuleiro
deck.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id;

    cardElement.innerHTML = `
        <div class="card-front">
            <img src="Assets/img/cartas/carta_frente.jpg" alt="Logo">
        </div>
        <div class="card-back">
            <img src="${card.image}" alt="Card Image">
        </div>
    `;

    cardElement.addEventListener('click', flipCard);
    board.appendChild(cardElement);
});

// Função para virar a carta
function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) checkMatch();
}

// Função para verificar se as cartas formam um par
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.id === card2.dataset.id) {
        consecutivePairs++;
        updateScore();
        flippedCards = [];
    } else {
        consecutivePairs = 0;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }

    attempts--;
    attemptsElement.textContent = attempts; // Atualiza tentativas restantes

    if (attempts === 0) {
        endGame(false);
    }

    checkWin();
}

// Função para atualizar a pontuação
function updateScore() {
    const basePoints = 10;
    const points = basePoints * Math.pow(2, consecutivePairs - 1);
    score += points;
    scoreElement.textContent = score; // Atualiza a pontuação na tela
}

// Função para calcular bônus baseado no tempo e tentativas restantes
function calculateBonus() {
    const timeBonus = timeLeft * 2; // 2 pontos por segundo restante
    const attemptsBonus = attempts * 5; // 5 pontos por tentativa restante
    score += timeBonus + attemptsBonus; // Adiciona os bônus ao score
    scoreElement.textContent = score; // Atualiza a pontuação
}

// Função para verificar se o jogador venceu
function checkWin() {
    const remainingCards = document.querySelectorAll('.card:not(.flipped)');
    if (remainingCards.length === 0) {
        clearInterval(timer); // Para o temporizador
        score += 200; // Bônus de vitória
        calculateBonus(); // Calcula bônus de tempo e tentativas
        scoreElement.textContent = score; // Atualiza a pontuação final
        endGame(true);
    }
}

// Função para salvar a pontuação
function saveScore(playerName, score) {
    const difficulty = localStorage.getItem('dificuldade');
    let ranking = JSON.parse(localStorage.getItem(difficulty)) || [];
    
    ranking.push({ name: playerName, score: score });
    ranking.sort((a, b) => b.score - a.score); // Ordena pela maior pontuação
  
    localStorage.setItem(difficulty, JSON.stringify(ranking)); // Salva o ranking atualizado
}

function endGame(win) {
    message.innerHTML = win
        ? `<span style="color:rgb(41, 175, 0);">PARABÉNS, VOCÊ VENCEU</span><br>Pontuação final:<span style="color: #00FF00;"> ${score}</span>`
        : `<span style="color: #FF0000;">VOCÊ PERDEU</span><br>Pontuação final:<span style="color: #00FF00;"> ${score}</span>`;
    saveScore(localStorage.getItem('username'), score);
    overlay.classList.add('show');
    clearInterval(timer);
}

// Função para alternar entre pausar e retomar o jogo
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        togglePauseOverlay();
    }
});

function togglePauseOverlay() {
    const pauseOverlay = document.getElementById('overlay-pause');

    if (!pauseOverlay) {
        console.error("O overlay de pausa não foi encontrado no documento!");
        return;
    }

    if (isPaused) {
        // Retoma o jogo
        pauseOverlay.style.opacity = '0';
        pauseOverlay.style.visibility = 'hidden';
        resumeGame();
    } else {
        // Pausa o jogo
        pauseOverlay.style.opacity = '1';
        pauseOverlay.style.visibility = 'visible';
        pauseGame();
    }
}

function pauseGame() {
    if (!isPaused) {
        isPaused = true;
        clearInterval(timer); // Pausa o cronômetro
    }
}

function resumeGame() {
    if (isPaused) {
        isPaused = false;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            if (timeLeft === 0) {
                endGame(false);
            }
        }, 1000); // Reinicia o cronômetro
    }
}

// Função para reiniciar o jogo
function resetGame() {
    clearInterval(timer);  // Limpa o temporizador
    location.reload();
}

// Função para sair do jogo
function exitGame() {
    window.location.href = 'login.html';
}

// Inicia o cronômetro
let timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft; // Atualiza o tempo restante na tela

    if (timeLeft === 0) {
        endGame(false);
    }
}, 1000);
