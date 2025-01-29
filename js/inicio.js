function showGameModes() {
    const gameModesOverlay = document.getElementById('game-modes-overlay');
    if (!gameModesOverlay) {
        console.error("O overlay de modos não foi encontrado no documento!");
        return;
    }

    // Exibe o overlay ajustando opacidade e visibilidade
    gameModesOverlay.style.opacity = '1';
    gameModesOverlay.style.visibility = 'visible';
}

function closeGameModes() {
    const gameModesOverlay = document.getElementById('game-modes-overlay');
    if (!gameModesOverlay) {
        console.error("O overlay de modos não foi encontrado no documento!");
        return;
    }

    // Oculta o overlay ajustando opacidade e visibilidade
    gameModesOverlay.style.opacity = '0';
    gameModesOverlay.style.visibility = 'hidden';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeGameModes(); // Fecha o overlay se a tecla "Esc" for pressionada
    }
});

const gameModes = [
    { id: 'classico', nome: 'Clássico', cor: 'orange' },
    { id: 'versus', nome: 'Versus', cor: 'orange' },
];

let gameModeAtual = 0; 

function alterarGameModes(direcao) {
    const selectedGameMode = document.getElementById('selected-gameMode'); 

    if (direcao === 'direita') {
        gameModeAtual = (gameModeAtual + 1) % gameModes.length; 
    } else if (direcao === 'esquerda') {
        gameModeAtual = (gameModeAtual - 1 + gameModes.length) % gameModes.length; 
    }

    const selectedMode = gameModes[gameModeAtual]; 
    selectedGameMode.textContent = selectedMode.nome; 
    selectedGameMode.style.color = selectedMode.cor; 
}

function startGame() {
    const selectedMode = gameModes[gameModeAtual];

    if (selectedMode.id === 'classico') {
        window.location.href = 'login.html';
    } else if (selectedMode.id === 'versus') {
        window.location.href = 'versus.html';
    }
}

// Obtendo o elemento de áudio
const music = document.getElementById('background-music');
const musicButton = document.getElementById('music-button');
const musicIcon = document.getElementById('music-icon');

// Função para controlar a música (Tocar / Pausar)
function toggleMusic() {
    if (music.paused) {
        music.play();  // Inicia a música
        musicIcon.src = "Assets/img/som.png"; // Altera o ícone para "som"
    } else {
        music.pause();  // Pausa a música
        musicIcon.src = "Assets/img/mudo.png"; // Altera o ícone para "mudo"
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

// Variáveis para controlar o timer de inatividade
let inatividadeTimer;
let tempoInatividade = 60000; // 1 minuto de inatividade (em milissegundos)

// Função para esconder todos os elementos exceto a música e o fundo
// Função para esconder todos os elementos exceto a música e o fundo (vídeo)
function esconderElementos() {
    // Oculta todos os elementos exceto a música, a imagem de fundo (vídeo) e a música
    const bodyElements = document.querySelectorAll('body > *:not(audio, .video-background)');
    bodyElements.forEach(element => {
      element.classList.add('hidden'); // Adiciona a classe 'hidden' para esconder o elemento
    });
    
    // Esconde o cursor ao ocultar os elementos
    document.body.classList.add('hidden-cursor');
  }
  
  // Função para mostrar todos os elementos novamente
  function mostrarElementos() {
    // Restaura a visibilidade de todos os elementos
    const bodyElements = document.querySelectorAll('body > *');
    bodyElements.forEach(element => {
      element.classList.remove('hidden'); // Remove a classe 'hidden' para mostrar o elemento
    });
    
    // Mostra o cursor ao exibir os elementos novamente
    document.body.classList.remove('hidden-cursor');
  }
  
  // Função para reiniciar o timer de inatividade
  function resetarInatividadeTimer() {
    // Limpa o timer anterior, se existir
    clearTimeout(inatividadeTimer);
  
    // Define um novo timer que irá ocultar os elementos após 1 minuto
    inatividadeTimer = setTimeout(() => {
      esconderElementos(); // Esconde elementos e o cursor após inatividade
    }, tempoInatividade);
  }
  
  // Monitores de atividades
  document.addEventListener('click', () => {
      resetarInatividadeTimer(); // Reinicia o timer ao clicar
      mostrarElementos(); // Mostra os elementos novamente após a interação
  });
  document.addEventListener('mousemove', () => {
      resetarInatividadeTimer(); // Reinicia o timer ao mover o mouse
      mostrarElementos(); // Mostra os elementos novamente após a interação
  });
  document.addEventListener('keydown', () => {
      resetarInatividadeTimer(); // Reinicia o timer ao pressionar uma tecla
      mostrarElementos(); // Mostra os elementos novamente após a interação
  });
  
  // Chama a função inicialmente para garantir que o timer seja ativado
  resetarInatividadeTimer();