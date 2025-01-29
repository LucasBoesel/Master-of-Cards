const dificuldades = [
    { id: 'facil', nome: 'Aprendiz de Cavaleiro', cor: 'green' },
    { id: 'medio', nome: 'Paladino da Luz', cor: 'yellow' },
    { id: 'dificil', nome: 'Cavaleiro da Ordem Negra', cor: 'red' }
];

let dificuldadeAtual = 0;

function alterarDificuldade(direcao) {
    const selectedDifficulty = document.getElementById('selected-difficulty');

    if (direcao === 'direita') {
        // Avança para a próxima dificuldade, retornando ao início se atingir o final
        dificuldadeAtual = (dificuldadeAtual + 1) % dificuldades.length;
    } else if (direcao === 'esquerda') {
        // Retrocede para a dificuldade anterior, voltando ao final se atingir o início
        dificuldadeAtual = (dificuldadeAtual - 1 + dificuldades.length) % dificuldades.length;
    }

    // Atualiza a exibição da dificuldade
    const dificuldade = dificuldades[dificuldadeAtual];
    selectedDifficulty.textContent = dificuldade.nome;
    selectedDifficulty.style.color = dificuldade.cor;  // Aplica a cor correspondente
}

function startGame() {
    const username = localStorage.getItem('username');  // Recupera o nome do usuário
    const dificuldade = dificuldades[dificuldadeAtual];
    
    // Salva a dificuldade no localStorage
    window.localStorage.setItem('dificuldade', dificuldade.id);

    // Redireciona para a página correspondente à dificuldade
    if (dificuldade.id === 'facil') {
        window.location.href = 'facil.html';
    } else if (dificuldade.id === 'medio') {
        window.location.href = 'medio.html';
    } else if (dificuldade.id === 'dificil') {
        window.location.href = 'dificil.html';
    }
}

