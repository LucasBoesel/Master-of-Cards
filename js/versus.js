const mapas = [
    { id: 'vila-verdejante', nome: 'Vila Verdejante', cor: '#ef801c' },
    { id: 'vila-carvalho', nome: 'Vila do Velho Carvalho', cor: '#ef801c' },
    { id: 'taverna', nome: 'Taverna Traiçoeira', cor: '#ef801c' }
];

let mapaAtual = 0;

function alterarMapa(direcao) {
    const selectedMapa = document.getElementById('selected-mapa');
    const mapaImg = document.getElementById('mapa-img');  // Referência para a imagem do mapa

    // Atualiza o índice do mapa dependendo da direção
    if (direcao === 'direita') {
        mapaAtual = (mapaAtual + 1) % mapas.length;
    } else if (direcao === 'esquerda') {
        mapaAtual = (mapaAtual - 1 + mapas.length) % mapas.length;
    }

    // Obtém o mapa selecionado
    const mapaAtualizado = mapas[mapaAtual];
    console.log(`Mapa Atual: ${mapaAtualizado.nome}`);
    // Atualiza o nome e a cor do mapa
    selectedMapa.textContent = mapaAtualizado.nome;
    selectedMapa.style.color = mapaAtualizado.cor;

    // Atualiza a imagem do mapa
    mapaImg.src = `Assets/img/mapas/${mapaAtualizado.id}.jpg`;
    console.log(`Imagem Atualizada: ${mapaAtualizado.id}.jpg`);  // Verifique se o caminho da imagem está correto
}

function startMapa() {
    const mapaSelecionado = mapas[mapaAtual];

    // Imprime os nomes para validação (ou substitua com lógica necessária)
    console.log(`Iniciando mapa com: ${player1Name} e ${player2Name}`);

    if (mapaSelecionado.id === 'vila-verdejante') {
        window.location.href = 'versus-verdejante.html';
    } else if (mapaSelecionado.id === 'vila-carvalho') {
        window.location.href = 'versus-carvalho.html';
    } else if (mapaSelecionado.id === 'taverna') {
        window.location.href = 'versus-taverna.html';
    }
}

// Declarar variáveis globais para armazenar o nome dos jogadores
let player1Name = "Player 1";
let player2Name = "Player 2";

function editPlayerName(element) {
    const currentText = element.textContent.trim();
    const defaultText = element.getAttribute('data-default');

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText === defaultText ? '' : currentText;
    input.classList.add('player-input');

    // Adiciona o tamanho inicial ao input
    input.style.width = `${Math.max(50, currentText.length * 15)}px`;

    element.replaceWith(input);
    input.focus();

    // Atualiza o tamanho do input dinamicamente conforme o texto
    input.addEventListener('input', () => {
        input.style.width = `${Math.max(50, input.value.length * 15)}px`;
    });

    const confirmName = () => {
        const newText = input.value.trim() || defaultText;

        // Atualiza o nome e salva no localStorage
        if (defaultText === 'Player 1') {
            localStorage.setItem('player1-name', newText);
        } else if (defaultText === 'Player 2') {
            localStorage.setItem('player2-name', newText);
        }

        element.textContent = newText;
        input.replaceWith(element);
    };

    // Confirma o nome ao pressionar Enter
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            confirmName();
        }
    });

    // Confirma o nome ao perder o foco
    input.addEventListener('blur', confirmName);
}

// Função para mostrar o overlay do avatar selecionado
function showAvatar(playerId) {
    const overlay1 = document.getElementById('avatar-overlay-1');
    const overlay2 = document.getElementById('avatar-overlay-2');

    // Ocultar ambos os overlays antes de mostrar o correto
    overlay1.style.opacity = '0';
    overlay1.style.visibility = 'hidden';
    overlay2.style.opacity = '0';
    overlay2.style.visibility = 'hidden';

    // Verifica qual avatar foi clicado e exibe o overlay correto
    if (playerId === 1) {
        console.log("Mostrando o overlay para Avatar 1!");
        overlay1.style.opacity = '1';
        overlay1.style.visibility = 'visible';
    } else if (playerId === 2) {
        console.log("Mostrando o overlay para Avatar 2!");
        overlay2.style.opacity = '1';
        overlay2.style.visibility = 'visible';
    }
}

// Função para fechar os overlays (quando pressionada a tecla Escape)
function closeAvatar() {
    const overlay1 = document.getElementById('avatar-overlay-1');
    const overlay2 = document.getElementById('avatar-overlay-2');

    // Oculta ambos os overlays
    overlay1.style.opacity = '0';
    overlay1.style.visibility = 'hidden';
    overlay2.style.opacity = '0';
    overlay2.style.visibility = 'hidden';
}

// Adiciona um ouvinte de evento para a tecla Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeAvatar(); // Fecha os overlays ao pressionar a tecla Escape
    }
});

function selectAvatar(avatarId, playerId) {
    let avatarImage = '';

    if (avatarId === 1) {
        avatarImage = 'Assets/img/avatar/elfa.jpg';
    } else if (avatarId === 2) {
        avatarImage = 'Assets/img/avatar/princesa-verde.jpg';
    } else if (avatarId === 3) {
        avatarImage = 'Assets/img/avatar/bruto.jpg';
    } else if (avatarId === 4) {
        avatarImage = 'Assets/img/avatar/mago-sapo.jpg';
    }
   
    let avatarElement;

    if (playerId === 1) {
        avatarElement = document.querySelector(`.square-container-${playerId} .rounded-container-${playerId} img`);
    } else if (playerId === 2) {
        avatarElement = document.querySelector(`.square-container-${playerId} .rounded-container-${playerId} img`);
    }

    if (avatarElement) {
        avatarElement.src = avatarImage;
        
        // Salva a escolha do avatar no localStorage
        localStorage.setItem(`player${playerId}-avatar`, avatarImage);
        console.log(`Avatar do Player ${playerId} alterado e salvo como: ${avatarImage}`);
    } else {
        console.error(`Avatar com id ${avatarId} não encontrado para o Player ${playerId}`);
    }

    closeAvatar();
}

function loadSavedAvatars() {
    // Carrega os avatares salvos no localStorage para ambos os jogadores
    for (let playerId = 1; playerId <= 2; playerId++) {
        const savedAvatar = localStorage.getItem(`player${playerId}-avatar`);
        if (savedAvatar) {
            const avatarElement = document.querySelector(`.status-container-${playerId} .rounded-container-${playerId} img`);
            if (avatarElement) {
                avatarElement.src = savedAvatar;
            }
        }
    }
}

// Chama a função para carregar os avatares salvos e limpa os dados do localStorage quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    loadSavedAvatars();  // Carrega os avatares salvos, se houver
    localStorage.removeItem('player1-name');
    localStorage.removeItem('player2-name');
    localStorage.removeItem('player1-avatar');
    localStorage.removeItem('player2-avatar');
});