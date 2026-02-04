import React from 'react';

const players = [
  { name: 'Jordan', points: 92, streak: 4 },
  { name: 'Alex', points: 88, streak: 3 },
  { name: 'Sam', points: 80, streak: 1 },
  { name: 'Casey', points: 74, streak: 2 },
];

export default function LeaderboardPage() {
  return (
    <div className="page">
      <section className="card">
        <div className="card-header">
          <h3>Leaderboard</h3>
          <span className="accent">Round 2</span>
        </div>
        <div className="list">
          {players.map((player, index) => (
            <div key={player.name} className="list-item">
              <div>
                <p className="strong">#{index + 1} {player.name}</p>
                <p className="muted">Streak {player.streak} wins</p>
              </div>
              <span className="pill">{player.points} pts</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
