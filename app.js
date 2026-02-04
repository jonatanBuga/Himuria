const games = [
  {
    id: 'g1',
    title: 'Boston Celtics vs New York Knicks',
    tip: '7:00 PM ET · Game 2',
    status: 'East Semis',
    options: ['Boston Celtics', 'New York Knicks'],
  },
  {
    id: 'g2',
    title: 'Denver Nuggets vs Minnesota Timberwolves',
    tip: '8:30 PM ET · Game 4',
    status: 'West Semis',
    options: ['Denver Nuggets', 'Minnesota Timberwolves'],
  },
  {
    id: 'g3',
    title: 'Dallas Mavericks vs Oklahoma City Thunder',
    tip: '9:00 PM ET · Game 3',
    status: 'West Semis',
    options: ['Dallas Mavericks', 'Oklahoma City Thunder'],
  },
];

const leaderboard = [
  { name: 'Alex', points: 84, streak: 3 },
  { name: 'Jordan', points: 79, streak: 2 },
  { name: 'Riley', points: 71, streak: 1 },
  { name: 'Casey', points: 68, streak: 4 },
];

const state = {
  picks: JSON.parse(localStorage.getItem('himuria_picks') || '[]'),
};

const gameList = document.getElementById('gameList');
const gameSelect = document.getElementById('gameSelect');
const winnerSelect = document.getElementById('winnerSelect');
const marginInput = document.getElementById('marginInput');
const confidenceInput = document.getElementById('confidenceInput');
const leaderboardList = document.getElementById('leaderboardList');
const picksList = document.getElementById('picksList');
const predictionForm = document.getElementById('predictionForm');
const rulesModal = document.getElementById('rulesModal');

const joinClub = document.getElementById('joinClub');
const makePick = document.getElementById('makePick');
const quickPick = document.getElementById('quickPick');
const viewRules = document.getElementById('viewRules');
const closeModal = document.getElementById('closeModal');

const stats = {
  activeMembers: document.getElementById('activeMembers'),
  totalPicks: document.getElementById('totalPicks'),
  pointsPool: document.getElementById('pointsPool'),
  communityPick: document.getElementById('communityPick'),
};

function renderGames() {
  gameList.innerHTML = '';
  games.forEach((game) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <h5>${game.title}</h5>
      <span>${game.status}</span>
      <span>${game.tip}</span>
      <button class="ghost" data-game="${game.id}">Pick now</button>
    `;
    gameList.appendChild(card);
  });
}

function renderFormOptions() {
  gameSelect.innerHTML = games
    .map((game) => `<option value="${game.id}">${game.title}</option>`)
    .join('');

  updateWinnerOptions(games[0].id);
}

function updateWinnerOptions(gameId) {
  const match = games.find((game) => game.id === gameId);
  winnerSelect.innerHTML = match.options
    .map((team) => `<option value="${team}">${team}</option>`)
    .join('');
}

function renderLeaderboard() {
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    item.innerHTML = `
      <div>
        <strong>#${index + 1} ${entry.name}</strong>
        <p class="fine">Streak: ${entry.streak} wins</p>
      </div>
      <div class="bold">${entry.points} pts</div>
    `;
    leaderboardList.appendChild(item);
  });
}

function renderPicks() {
  picksList.innerHTML = '';
  if (!state.picks.length) {
    picksList.innerHTML = '<p class="fine">No picks yet. Submit one above.</p>';
    return;
  }

  state.picks.slice().reverse().forEach((pick) => {
    const item = document.createElement('div');
    item.className = 'pick-item';
    item.innerHTML = `
      <div class="bold">${pick.game}</div>
      <p>Winner: ${pick.winner}</p>
      <p>Margin: ${pick.margin} • Confidence: ${pick.confidence}/5</p>
      <p class="fine">${pick.time}</p>
    `;
    picksList.appendChild(item);
  });
}

function savePick(pick) {
  state.picks.push(pick);
  localStorage.setItem('himuria_picks', JSON.stringify(state.picks));
  updateStats();
  renderPicks();
}

function updateStats() {
  stats.totalPicks.textContent = 120 + state.picks.length;
  stats.pointsPool.textContent = 2460 + state.picks.length * 12;
}

function openModal() {
  rulesModal.classList.add('open');
  rulesModal.setAttribute('aria-hidden', 'false');
}

function closeModalView() {
  rulesModal.classList.remove('open');
  rulesModal.setAttribute('aria-hidden', 'true');
}

gameList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-game]');
  if (!button) return;
  const gameId = button.getAttribute('data-game');
  gameSelect.value = gameId;
  updateWinnerOptions(gameId);
  predictionForm.scrollIntoView({ behavior: 'smooth' });
});

gameSelect.addEventListener('change', (event) => {
  updateWinnerOptions(event.target.value);
});

predictionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const match = games.find((game) => game.id === gameSelect.value);
  const pick = {
    game: match.title,
    winner: winnerSelect.value,
    margin: marginInput.value,
    confidence: confidenceInput.value,
    time: new Date().toLocaleString(),
  };
  savePick(pick);
  predictionForm.reset();
  updateWinnerOptions(match.id);
});

viewRules.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalView);

rulesModal.addEventListener('click', (event) => {
  if (event.target === rulesModal) closeModalView();
});

joinClub.addEventListener('click', () => {
  alert('Invite friends with your private club code. MVP version coming soon.');
});

makePick.addEventListener('click', () => {
  predictionForm.scrollIntoView({ behavior: 'smooth' });
});

quickPick.addEventListener('click', () => {
  predictionForm.scrollIntoView({ behavior: 'smooth' });
});

renderGames();
renderFormOptions();
renderLeaderboard();
renderPicks();
updateStats();

const communityOptions = ['Nuggets (54%)', 'Timberwolves (46%)'];
let idx = 0;
setInterval(() => {
  idx = (idx + 1) % communityOptions.length;
  stats.communityPick.textContent = communityOptions[idx];
}, 4000);
