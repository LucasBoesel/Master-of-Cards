const difficulties = [
    { id: 'facil', title: 'Aprendiz de Cavaleiro' },
    { id: 'medio', title: 'Paladino da Luz' },
    { id: 'dificil', title: 'Cavaleiro da Ordem Negra' },
  ];
  
  let currentTab = 0;
  
  function loadRanking(difficulty) {
    let ranking = JSON.parse(localStorage.getItem(difficulty)) || [];
    ranking.sort((a, b) => b.score - a.score); // Ordena pela maior pontuação
    return ranking;
  }
  
  function displayTab(tabIndex) {
    const tab = difficulties[tabIndex];
    document.getElementById('tab-title').textContent = tab.title;
  
    const ranking = loadRanking(tab.id);
    const ulElement = document.getElementById('ranking-list');
    ulElement.innerHTML = ''; // Limpa a lista antes de adicionar novos dados
  
    if (ranking.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Sem jogadores ainda';
      ulElement.appendChild(li);
    } else {
      ranking.slice(0, 5).forEach((player, index) => {
        const li = document.createElement('li');
        let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1} º`;
        li.innerHTML = `${medal} ${player.name} - ${player.score} Pontos`;
        ulElement.appendChild(li);
      });
    }
  }
  
  function changeTab(direction) {
    currentTab = (currentTab + direction + difficulties.length) % difficulties.length;
    displayTab(currentTab);
  }
  
  // Inicializa a página com a primeira aba
  window.onload = () => displayTab(currentTab);
  