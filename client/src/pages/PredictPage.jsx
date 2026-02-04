import React from 'react';

const games = [
  { id: 1, label: 'Celtics vs Knicks', time: 'Tonight • 7:00 PM ET' },
  { id: 2, label: 'Nuggets vs Timberwolves', time: 'Tomorrow • 8:30 PM ET' },
];

export default function PredictPage() {
  return (
    <div className="page">
      <section className="card">
        <div className="card-header">
          <h3>Submit a prediction</h3>
          <span className="accent">Lock before tip-off</span>
        </div>
        <form className="form">
          <label>
            Game
            <select>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Winner
            <select>
              <option>Celtics</option>
              <option>Knicks</option>
              <option>Nuggets</option>
              <option>Timberwolves</option>
            </select>
          </label>
          <label>
            Predicted margin
            <input type="number" min="1" max="30" placeholder="10" />
          </label>
          <label>
            Confidence
            <input type="range" min="1" max="5" defaultValue="3" />
          </label>
          <button className="primary" type="button">Save pick</button>
        </form>
      </section>

      <section className="card">
        <h3>Recent picks</h3>
        <div className="list">
          {games.map((game) => (
            <div key={game.id} className="list-item">
              <div>
                <p className="strong">{game.label}</p>
                <p className="muted">Margin 8 • Confidence 4</p>
              </div>
              <span className="pill">Pending</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
