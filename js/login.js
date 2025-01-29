function showGreeting() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('greeting').textContent = `Bem-vindo, ${username}!`;  // Corrigido: coloque as aspas ao redor da string
        window.location.href = 'dificuldade.html';  // Redireciona para a página de escolha de dificuldade
    } else {
        document.getElementById('greeting').textContent = 'Por favor, insira um nome.';
    }
}

// Função para ir para a página de ranking
function goToRanking() {
    window.location.href = 'ranking.html';  // Redireciona para a página de ranking
}
