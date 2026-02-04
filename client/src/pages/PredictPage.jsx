import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const games = [
  { id: 1, label: 'Celtics vs Knicks', time: 'Tonight • 7:00 PM ET' },
  { id: 2, label: 'Nuggets vs Timberwolves', time: 'Tomorrow • 8:30 PM ET' },
];

export default function PredictPage() {
  const { t } = useLanguage();

  return (
    <div className="page">
      <section className="card">
        <div className="card-header">
          <h3>{t('predict.title')}</h3>
          <span className="accent">{t('predict.tag')}</span>
        </div>
        <form className="form">
          <label>
            {t('predict.game')}
            <select>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('predict.winner')}
            <select>
              <option>Celtics</option>
              <option>Knicks</option>
              <option>Nuggets</option>
              <option>Timberwolves</option>
            </select>
          </label>
          <label>
            {t('predict.margin')}
            <input type="number" min="1" max="30" placeholder="10" />
          </label>
          <label>
            {t('predict.confidence')}
            <input type="range" min="1" max="5" defaultValue="3" />
          </label>
          <button className="primary" type="button">{t('predict.save')}</button>
        </form>
      </section>

      <section className="card">
        <h3>{t('predict.recent')}</h3>
        <div className="list">
          {games.map((game) => (
            <div key={game.id} className="list-item">
              <div>
                <p className="strong">{game.label}</p>
                <p className="muted">{t('predict.sampleDetail')}</p>
              </div>
              <span className="pill">{t('predict.pending')}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
