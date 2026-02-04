import React from 'react';

const highlights = [
  { label: 'Active friends', value: '12' },
  { label: 'Picks submitted', value: '64' },
  { label: 'Round points', value: '840' },
];

const nextGames = [
  { matchup: 'Celtics vs Knicks', time: 'Tonight • 7:00 PM ET' },
  { matchup: 'Nuggets vs Timberwolves', time: 'Tomorrow • 8:30 PM ET' },
];

export default function HomePage() {
  return (
    <div className="page">
      <section className="card hero-card">
        <div>
          <p className="eyebrow">Round 2</p>
          <h2>Welcome to your playoff club.</h2>
          <p className="muted">
            Lock in predictions before tip-off and earn points with every correct pick.
          </p>
        </div>
        <div className="stat-grid">
          {highlights.map((item) => (
            <div key={item.label} className="stat-card">
              <h3>{item.value}</h3>
              <p className="muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Upcoming tip-offs</h3>
          <span className="accent">Live board</span>
        </div>
        <div className="list">
          {nextGames.map((game) => (
            <div key={game.matchup} className="list-item">
              <div>
                <p className="strong">{game.matchup}</p>
                <p className="muted">{game.time}</p>
              </div>
              <button className="ghost">Predict</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
