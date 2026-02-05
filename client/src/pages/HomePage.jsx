import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useSeasonModal } from '../contexts/SeasonModalContext.jsx';
import useSeasonPicks from '../hooks/useSeasonPicks.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supabase } from '../supabaseClient.js';
import { fetchRoundAnalytics } from '../api.js';

const highlights = [
  { label: 'home.stats.members', value: '12' },
  { label: 'home.stats.picks', value: '64' },
  { label: 'home.stats.points', value: '840' },
];

// Home analytics uses real DB data; upcoming matchups are intentionally omitted here.

export default function HomePage() {
  const { t } = useLanguage();
  const { openModal } = useSeasonModal();
  const { auth } = useAuth();
  const { draft, committed } = useSeasonPicks(auth?.token);
  const hasSeasonPicks = Boolean(committed?.champion_team || draft?.champion_team);
  const [analytics, setAnalytics] = React.useState(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      const token = auth?.token || (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return;
      try {
        const data = await fetchRoundAnalytics(token);
        if (!active) return;
        setAnalytics(data);
        if (!data?.totalSeries) {
          setError(t('home.analyticsEmpty'));
        }
        console.log('[home analytics] round', data?.round);
        console.log('[home analytics] totalSeries', data?.totalSeries);
        console.log('[home analytics] pickedCount', data?.pickedCount);
        console.log('[home analytics] east', data?.east?.length);
        console.log('[home analytics] west', data?.west?.length);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Failed to load analytics.');
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [auth?.token]);

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
        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>{t('home.analyticsPicked')}</h4>
            <DonutChart
              picked={analytics?.pickedCount || 0}
              total={analytics?.totalSeries || 0}
            />
            <div className="legend">
              <span className="dot picked" /> {t('home.picked')}
              <span className="dot not-picked" /> {t('home.notPicked')}
            </div>
          </div>
          <div className="analytics-card">
            <h4>{t('home.analyticsEast')}</h4>
            <ColumnChart teams={analytics?.east || []} />
          </div>
          <div className="analytics-card">
            <h4>{t('home.analyticsWest')}</h4>
            <ColumnChart teams={analytics?.west || []} />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
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

function DonutChart({ picked, total }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? picked / total : 0;
  const dash = circumference * ratio;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} stroke="#f2f2f2" strokeWidth="12" fill="none" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#ff7a00"
        strokeWidth="12"
        fill="none"
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="62" textAnchor="middle" fontSize="14" fill="#000">
        {picked}/{total}
      </text>
    </svg>
  );
}

function ColumnChart({ teams }) {
  const maxCount = Math.max(0, ...teams.map((t) => t.count || 0));
  const max = Math.max(5, maxCount);
  const ticks = Array.from({ length: max + 1 }, (_, i) => i);
  return (
    <div className="column-chart" style={{ ["--col-count"]: teams.length }}>
      <div className="y-axis" style={{ gridTemplateRows: `repeat(${ticks.length}, 1fr)` }}>
        {ticks.slice().reverse().map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="chart-area">
        <div className="columns">
          {teams.map((team) => {
            const height = (team.count / max) * 100;
            return (
              <div key={team.team} className="column" style={{ ["--bar-height"]: `${height}%` }}>
                <div className="bar-slot">
                  <div className="tooltip">
                    <strong>{team.team} – {team.count} picks</strong>
                    <ul>
                      {team.users.map((user) => (
                        <li key={user}>{user}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bar-vertical" style={{ height: `${height}%` }} />
                </div>
              </div>
            );
          })}
          <div className="baseline" aria-hidden="true" />
        </div>
        <div className="x-labels">
          {teams.map((team) => (
            <span key={team.team} className="x-label">{team.team}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
