import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useSeasonModal } from '../contexts/SeasonModalContext.jsx';
import useSeasonPicks from '../hooks/useSeasonPicks.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const highlights = [
  { label: 'home.stats.members', value: '12' },
  { label: 'home.stats.picks', value: '64' },
  { label: 'home.stats.points', value: '840' },
];

const nextGames = [
  { matchup: 'Celtics vs Knicks', time: 'Tonight • 7:00 PM ET' },
  { matchup: 'Nuggets vs Timberwolves', time: 'Tomorrow • 8:30 PM ET' },
];

export default function HomePage() {
  const { t } = useLanguage();
  const { openModal } = useSeasonModal();
  const { auth } = useAuth();
  const { draft, committed } = useSeasonPicks(auth?.token);
  const hasSeasonPicks = Boolean(committed?.champion_team || draft?.champion_team);

  return (
    <div className="page">
      <section className="card hero-card">
        <div>
          <p className="eyebrow">{t('home.round')}</p>
          <h2>{t('home.headline')}</h2>
          <p className="muted">{t('home.copy')}</p>
        </div>
        <div className="stat-grid">
          {highlights.map((item) => (
            <div key={item.label} className="stat-card">
              <h3>{item.value}</h3>
              <p className="muted">{t(item.label)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>{t('home.upcomingTitle')}</h3>
          <span className="accent">{t('home.upcomingTag')}</span>
        </div>
        <div className="list">
          {nextGames.map((game) => (
            <div key={game.matchup} className="list-item">
              <div>
                <p className="strong">{game.matchup}</p>
                <p className="muted">{game.time}</p>
              </div>
              <button className="primary" type="button">
                {t('home.predict')}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h3>{t('home.seasonTitle')}</h3>
            <p className="muted">{t('home.seasonSubtitle')}</p>
          </div>
          <span className="accent">{hasSeasonPicks ? t('home.seasonSet') : t('home.seasonUnset')}</span>
        </div>
        <div className="list-item season-card">
          <div>
            <p className="strong">{t('home.seasonChampion')}</p>
            <p className="muted">{committed?.champion_team || draft?.champion_team || '—'}</p>
          </div>
          <div>
            <p className="strong">{t('home.seasonMvp')}</p>
            <p className="muted">{committed?.mvp_player || draft?.mvp_player || '—'}</p>
          </div>
          <button className="ghost" type="button" onClick={openModal}>
            {hasSeasonPicks ? t('home.seasonEdit') : t('home.seasonSetCta')}
          </button>
        </div>
      </section>
    </div>
  );
}
