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

let allCards = [
    { id: 1, image: 'Assets/img/cartas/1.png' },
    { id: 2, image: 'Assets/img/cartas/2.png' },
    { id: 3, image: 'Assets/img/cartas/3.png' },
    { id: 4, image: 'Assets/img/cartas/4.png' },
    { id: 5, image: 'Assets/img/cartas/5.png' },
    { id: 6, image: 'Assets/img/cartas/6.png' },
    { id: 7, image: 'Assets/img/cartas/7.png' },
    { id: 8, image: 'Assets/img/cartas/8.png' },
    { id: 9, image: 'Assets/img/cartas/9.png' },
    { id: 10, image: 'Assets/img/cartas/10.png' },
    { id: 11, image: 'Assets/img/cartas/11.png' },
    { id: 12, image: 'Assets/img/cartas/12.png' },
    { id: 13, image: 'Assets/img/cartas/13.png' },
    { id: 14, image: 'Assets/img/cartas/14.png' },
    { id: 15, image: 'Assets/img/cartas/15.png' },
    { id: 16, image: 'Assets/img/cartas/16.png' },
    { id: 17, image: 'Assets/img/cartas/17.png' },
    { id: 18, image: 'Assets/img/cartas/18.png' },
];

let usedCards = []; // Array para armazenar as cartas que já foram usadas nas rodadas

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Troca os elementos
    }
    return deck;
}

// Função para gerar um deck aleatório sem repetição de cartas
function generateDeck(numPairs) {
    const selectedCards = [];
    const availableCards = allCards.filter(card => !usedCards.includes(card.id));

    // Garantir que o número de pares não ultrapasse a quantidade de pares disponíveis
    const maxPairs = Math.min(numPairs, Math.floor(availableCards.length / 2));

    if (maxPairs === 0) {
        console.error("Não há cartas suficientes disponíveis para criar pares!");
        return []; // Retorna um deck vazio se não houver cartas suficientes
    }

    while (selectedCards.length < maxPairs) {
        const randomCardIndex = Math.floor(Math.random() * availableCards.length);
        const selectedCard = availableCards[randomCardIndex];

        // Adicione apenas se ainda não estiver no deck selecionado
        if (!selectedCards.find(card => card.id === selectedCard.id)) {
            selectedCards.push(selectedCard);
        }
    }

    // Criar os pares de cartas e adicioná-los ao deck
    let deck = [];
    selectedCards.forEach(card => {
        deck.push({ ...card }); // Criar uma cópia da carta para cada par
        deck.push({ ...card });
        usedCards.push(card.id); // Marcar como usada
    });

     deck = shuffleDeck(deck);

    return deck;
}

let deck = generateDeck(6);  // Primeira rodada com 6 pares de cartas

let canPause = false;  
let isPaused = false;
let isFirstGame = true;
let flippedCards = [];
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let completedRounds = 0;
let timeLeft = 20;
let timer;

const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');
const timerElement = document.getElementById('time-left');
const board = document.getElementById('card-grid');
const overlay = document.getElementById('overlay');
const message = document.getElementById('message');

function atualizarAvatares() {
    const player1Avatar = localStorage.getItem('player1-avatar') || 'Assets/img/avatar/elfa.jpg';
    const player2Avatar = localStorage.getItem('player2-avatar') || 'Assets/img/avatar/princesa-verde.jpg';
    const player1Name = localStorage.getItem('player1-name') || 'Player 1';
    const player2Name = localStorage.getItem('player2-name') || 'Player 2';

    const avatar1Img = document.querySelector('.rounded-container-1 img');
    const avatar2Img = document.querySelector('.rounded-container-2 img');
    
    if (avatar1Img) avatar1Img.src = player1Avatar;
    if (avatar2Img) avatar2Img.src = player2Avatar;

    document.getElementById('player1-name').textContent = player1Name;
    document.getElementById('player2-name').textContent = player2Name;
}

function renderDeck() {
    board.innerHTML = '';
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
}

function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.id === card2.dataset.id) {
        updateScore();
        flippedCards = [];
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            switchPlayer();
        }, 1000);
    }

    checkWin();
}

function checkWin() {
    const remainingCards = document.querySelectorAll('.card:not(.flipped)');
    if (remainingCards.length === 0) {
        completedRounds++;

        if (completedRounds === 3) {
            clearInterval(timer);
            endGame();
        } else {
            dropCards();
            setTimeout(() => {
                addMoreCards();
            }, 2000);
        }
    }
}

function addMoreCards() {
    let numPairs = 6;  // Configuração padrão para 6 pares (12 cartas) por rodada

    if (completedRounds === 1) {
        numPairs = 6;  // Segunda rodada com mais cartas
    } else if (completedRounds === 2) {
        numPairs = 6;  // Terceira rodada com mais cartas
    }

    // Resetar usedCards apenas antes da terceira rodada
    if (completedRounds === 2) {
        usedCards = [];  // Resetar usedCards antes da terceira rodada
    }

    deck = generateDeck(numPairs); // Gerar deck com a quantidade certa de pares
    renderDeck();
}

function endGame() {
    const player1Name = localStorage.getItem('player1-name') || 'Player 1';
    const player2Name = localStorage.getItem('player2-name') || 'Player 2';
    const isPlayer1Winner = player1Score > player2Score;
    let winnerMessage = '';
    if (isPlayer1Winner) {
        winnerMessage = ` 
            <span style="color:blue;">${player1Name}</span> você venceu<br>
            Pontuação final: <span style="color: #00FF00;">${player1Score}</span>`;
    } else {
        winnerMessage = ` 
            <span style="color:red;">${player2Name}</span> você venceu<br>
            Pontuação final: <span style="color: #00FF00;">${player2Score}</span>`;
    }

    message.innerHTML = winnerMessage;
    overlay.classList.add('show');
    clearInterval(timer);
}

function dropCards() {
    const allCards = document.querySelectorAll('.card');

    const shuffledCards = Array.from(allCards);
    shuffledCards.sort(() => Math.random() - 0.5);
    
    const totalCards = shuffledCards.length;
    for (let i = 0; i < totalCards; i++) {
        shuffledCards[i].classList.add('fall');
    }
}

function resetTimer() {
    timeLeft = 20;
    timerElement.textContent = timeLeft;
    clearInterval(timer); // Limpa o timer atual

    if (isFirstGame) {
        isFirstGame = false;  // Define que o primeiro jogo já aconteceu

        // Atraso de 3 segundos para iniciar o cronômetro após o sorteio
        setTimeout(() => {
            startTimer(); // Inicia o timer após 3 segundos
        }, 3000);
    } else {
        // Se não for o primeiro jogo, o timer começa imediatamente
        startTimer();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderDeck();
    resetTimer();
});

function updateScore() {
    if (currentPlayer === 1) {
        player1Score++;
        player1ScoreElement.textContent = player1Score;
    } else {
        player2Score++;
        player2ScoreElement.textContent = player2Score;
    }
    resetTimer();
}

const music = document.getElementById('background-music');
const musicButton = document.getElementById('music-button');
const musicIcon = document.getElementById('music-icon');

function toggleMusic() {
    if (music.paused) {
        music.play();
        musicIcon.src = "Assets/img/som.png";
    } else {
        music.pause();
        musicIcon.src = "Assets/img/mudo.png";
    }
}

function setVolume(value) {
    if (value >= 0 && value <= 1) {
        music.volume = value;
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        toggleFullScreen(); 
    }
    if (event.key === 'm' || event.key === 'M') {
        toggleMusic();
    }
    if (event.key === 'Escape') {
        togglePauseOverlay();
    }
});

window.addEventListener('click', () => {
    music.play();
}, { once: true });

function togglePauseOverlay() {
    if (!canPause) return;  // Impede que a pausa seja acionada antes do sorteio

    const pauseOverlay = document.getElementById('overlay-pause');

    if (!pauseOverlay) {
        console.error("O overlay de pausa não foi encontrado no documento!");
        return;
    }

    if (isPaused) {
        pauseOverlay.style.opacity = '0';
        pauseOverlay.style.visibility = 'hidden';
        resumeGame();
    } else {
        pauseOverlay.style.opacity = '1';
        pauseOverlay.style.visibility = 'visible';
        pauseGame();
    }
}

function pauseGame() {
    if (!isPaused) {
        isPaused = true;
        clearInterval(timer);
    }
}

function resumeGame() {
    if (isPaused) {
        isPaused = false;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerElement.textContent = timeLeft;
            } else {
                clearInterval(timer); // Interrompe o cronômetro quando chega a 0
                switchPlayer(); // Alterna para o próximo jogador
            }
        }, 1000);
    }
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = timeLeft;
        } else {
            clearInterval(timer);
            switchPlayer();
        }
    }, 1000);
}

function resetPlayerData() {
    localStorage.removeItem('player1-name');
    localStorage.removeItem('player2-name');
    localStorage.removeItem('player1-avatar');
    localStorage.removeItem('player2-avatar');
}

function resetGame() {
    clearInterval(timer);
    timeLeft = 20;
    timerElement.textContent = timeLeft;
    location.reload();
}

function exitGame() {
    resetPlayerData();
    window.location.href = 'versus.html';
}

function sorteioQuemComeca() {
    const player1Name = localStorage.getItem('player1-name') || 'Player 1';
    const player2Name = localStorage.getItem('player2-name') || 'Player 2';
    const resultado = Math.random() < 0.5 ? 'player1' : 'player2';
    
    const whoStartsDiv = document.getElementById('whoStarts');
    const player1Span = document.getElementById('player1');
    const player2Span = document.getElementById('player2');

    // Oculta as mensagens inicialmente
    player1Span.style.display = 'none';
    player2Span.style.display = 'none';

    // Exibe a mensagem de quem começa com a animação
    if (resultado === 'player1') {
        player1Span.innerHTML = `<span style="color: #316195;">${player1Name}</span> começa!`;
        player1Span.style.display = 'inline';
        currentPlayer = 1;
    } else {
        player2Span.innerHTML = `<span style="color: crimson;">${player2Name}</span> começa!`;
        player2Span.style.display = 'inline';
        currentPlayer = 2;
    }

    // Exibe o texto indicando quem começa com animação
    whoStartsDiv.style.display = 'flex';
    
    // Espera 3 segundos e oculta a animação
    setTimeout(() => {
        whoStartsDiv.style.display = 'none';
        canPause = true; // Agora a pausa pode ser acionada
    }, 3000);
}

// Função para atualizar a indicação de turno
function updateTurnIndicator() {
    const currentPlayerName = currentPlayer === 1 ? 
        localStorage.getItem('player1-name') || 'Player 1' : 
        localStorage.getItem('player2-name') || 'Player 2';

    const turnText = document.getElementById('turn-text');
    const currentPlayerNameElement = document.getElementById('current-player-name');

    currentPlayerNameElement.textContent = currentPlayerName;

    const turnIndicator = document.getElementById('turn-indicator');
    turnIndicator.style.display = 'block';

    // Aplica a cor do jogador atual
    if (currentPlayer === 1) {
        currentPlayerNameElement.style.color = '#6c93cc'; // Cor do jogador 1
    } else {
        currentPlayerNameElement.style.color = 'crimson'; // Cor do jogador 2
    }
}

function switchPlayer() {
    clearInterval(timer); // Limpa o timer atual
    currentPlayer = currentPlayer === 1 ? 2 : 1; // Alterna entre jogador 1 e 2
    updateTurnIndicator(); // Atualiza a indicação de quem é a vez
    resetTimer(); // Reinicia o timer ao mudar de jogador
}

window.onload = function() {
    atualizarAvatares(); 
    sorteioQuemComeca();
    music.play().catch(error => {  
        console.log("Erro ao tentar tocar música: ", error);
    });
    musicIcon.src = "Assets/img/som.png"; 
};

