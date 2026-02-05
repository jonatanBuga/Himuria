import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  fetchSeriesSchedule,
  fetchSeriesDraft,
  fetchSeriesCommitted,
  saveSeriesDraft,
  commitSeriesPick,
} from '../api.js';
import { supabase } from '../supabaseClient.js';
import useSeriesPicks from '../hooks/useSeriesPicks.js';
import SeriesPickCard from '../components/SeriesPickCard.jsx';
import { getSeriesPayload, isValidSeriesWins, saveDraftPick } from '../seriesPickUtils.js';

// Mock fallback series data for MVP if backend is empty.
const fallbackSeries = [
  {
    series_id: 's1',
    conference: 'EAST',
    team_a: 'Celtics',
    team_b: 'Knicks',
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    round: 'R2',
    status: 'ACTIVE',
  },
  {
    series_id: 's2',
    conference: 'EAST',
    team_a: 'Bucks',
    team_b: '76ers',
    start_time: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
    round: 'R2',
    status: 'ACTIVE',
  },
  {
    series_id: 's3',
    conference: 'WEST',
    team_a: 'Nuggets',
    team_b: 'Timberwolves',
    start_time: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    round: 'R2',
    status: 'ACTIVE',
  },
  {
    series_id: 's4',
    conference: 'WEST',
    team_a: 'Thunder',
    team_b: 'Mavericks',
    start_time: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    round: 'R2',
    status: 'ACTIVE',
  },
  {
    series_id: 's5',
    conference: 'EAST',
    team_a: 'Heat',
    team_b: 'Cavaliers',
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    round: 'R2',
    status: 'UPCOMING',
  },
  {
    series_id: 's6',
    conference: 'WEST',
    team_a: 'Lakers',
    team_b: 'Suns',
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    round: 'R2',
    status: 'UPCOMING',
  },
];

export default function PredictPage() {
  const { t } = useLanguage();
  const { auth } = useAuth();
  const [filter, setFilter] = useState('EAST');
  const [now, setNow] = useState(Date.now());
  const [toast, setToast] = useState('');
  const [series, setSeries] = useState([]);
  const { drafts, committed, setDrafts, setCommitted, error: picksError } = useSeriesPicks(auth?.token);
  const committedRef = React.useRef(new Set());
  const [saveError, setSaveError] = useState('');
  const [loadError, setLoadError] = useState('');

  const getToken = async () => {
    if (auth?.token) return auth.token;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const token = await getToken();
      if (!token) return;
      try {
        const seriesData = await fetchSeriesSchedule(token);
        if (!active) return;
        setSeries(seriesData.length ? seriesData : fallbackSeries);
        setLoadError('');
      } catch (err) {
        if (!active) return;
        setSeries(fallbackSeries);
        setLoadError(err?.message || 'Failed to load picks.');
      }
    };
    load();

    return () => {
      active = false;
    };
  }, [auth?.token]);

  useEffect(() => {
    // Auto-commit drafts at lock time (client-side trigger).
    if (!series.length) return;
    const timer = setInterval(async () => {
      const token = await getToken();
      if (!token) return;
      for (const row of series) {
        const lockAt = new Date(row.start_time).getTime() - 60 * 1000;
        const key = `${row.series_id}`;
        const alreadyCommitted = committed.some((pick) => pick.series_id === row.series_id);
        if (alreadyCommitted || committedRef.current.has(key)) continue;
        if (Date.now() >= lockAt) {
          const draftExists = drafts.some((pick) => pick.series_id === row.series_id);
          if (!draftExists) {
            committedRef.current.add(key);
            continue;
          }
          try {
            const saved = await commitSeriesPick(token, row.series_id);
            if (saved && saved.series_id) {
              setCommitted((prev) => {
                const filtered = prev.filter((p) => p.series_id !== saved.series_id);
                return [...filtered, saved];
              });
            }
          } finally {
            committedRef.current.add(key);
          }
        }
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [series, drafts, committed]);

  const activeSeries = useMemo(
    () =>
      series.filter(
        (item) => item.status === 'ACTIVE' && item.conference === filter
      ),
    [filter, series]
  );
  const upcomingSeries = useMemo(
    () => series.filter((item) => item.status === 'UPCOMING'),
    [series]
  );

  const handleSave = async (seriesRow, winsA, winsB, locked) => {
    console.log('Save Pick clicked', {
      series_id: seriesRow.series_id,
      team_a: seriesRow.team_a,
      team_b: seriesRow.team_b,
      team_a_wins: winsA,
      team_b_wins: winsB,
      start_time: seriesRow.start_time,
    });
    console.log('Auth user id', auth?.id);
    if (locked) return;
    const token = await getToken();
    if (!token) {
      setSaveError('No authenticated user.');
      console.warn('No authenticated user token.');
      return;
    }
    const payload = getSeriesPayload(seriesRow, winsA, winsB);
    if (!payload.series_id || !payload.team_a || !payload.team_b) {
      setSaveError('Series and team data are required.');
      console.warn('Missing series payload fields', payload);
      return;
    }
    if (!isValidSeriesWins(winsA, winsB)) {
      setSaveError('Invalid series result.');
      return;
    }
    try {
      const saved = await saveDraftPick(token, seriesRow, winsA, winsB);
      console.log('Draft upsert response', saved);
      setDrafts((prev) => {
        const filtered = prev.filter((item) => item.series_id !== seriesRow.series_id);
        return [...filtered, saved];
      });
      setToast(t('predict.toastSaved'));
      setSaveError('');
    } catch (err) {
      console.error('Draft upsert error', err);
      setSaveError(err?.message || 'Failed to save pick.');
    }
  };

  return (
    <div className="page">
      <section className="card series-section">
        <div className="card-header">
          <div>
            <h3>{t('predict.activeTitle')}</h3>
            <p className="muted">{t('predict.activeSubtitle')}</p>
          </div>
          <div className="toggle-group">
            <button
              type="button"
              className={`ghost toggle ${filter === 'EAST' ? 'active' : ''}`}
              onClick={() => setFilter('EAST')}
            >
              {t('predict.east')}
            </button>
            <button
              type="button"
              className={`ghost toggle ${filter === 'WEST' ? 'active' : ''}`}
              onClick={() => setFilter('WEST')}
            >
              {t('predict.west')}
            </button>
            <span className={`toggle-indicator ${filter === 'WEST' ? 'right' : ''}`} />
          </div>
        </div>

        <div className="series-grid">
          {activeSeries.map((seriesRow) => (
            <SeriesPickCard
              key={seriesRow.series_id}
              series={seriesRow}
              now={now}
              t={t}
              onSave={handleSave}
              draft={drafts.find((pick) => pick.series_id === seriesRow.series_id)}
              committed={committed.find((pick) => pick.series_id === seriesRow.series_id)}
            />
          ))}
        </div>
        {saveError && <p className="error">{saveError}</p>}
        {loadError && <p className="error">{loadError}</p>}
        {picksError && <p className="error">{picksError}</p>}
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h3>{t('predict.upcomingTitle')}</h3>
            <p className="muted">{t('predict.upcomingSubtitle')}</p>
          </div>
        </div>
        <div className="series-grid">
          {upcomingSeries.map((seriesRow) => (
            <UpcomingCard key={seriesRow.series_id} series={seriesRow} now={now} t={t} />
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h3>{t('predict.myPicks')}</h3>
            <p className="muted">{t('predict.savedSubtitle')}</p>
          </div>
        </div>
        <div className="list">
          {drafts.length === 0 && committed.length === 0 ? (
            <p className="muted">{t('predict.emptyPicks')}</p>
          ) : (
            [...drafts, ...committed].map((pick) => (
              <div key={pick.series_id} className="list-item saved-pick">
                <div>
                  <p className="strong">{pick.team_a} vs {pick.team_b}</p>
                  <p className="muted">{pick.team_a_wins} - {pick.team_b_wins}</p>
                </div>
                <span className="pill">{pick.updated_at ? new Date(pick.updated_at).toLocaleString() : t('predict.pending')}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function UpcomingCard({ series, now, t }) {
  const opensAt = new Date(series.start_time).getTime();
  return (
    <article className="series-card is-upcoming">
      <div className="series-meta">
        <div className="lock">
          <span className="clock" aria-hidden="true" />
          {t('predict.opensIn')}: {formatCountdown(opensAt, now)}
        </div>
      </div>
      <div className="series-body">
        <div className="series-side">
          <div className="team-block">
            <div className="logo" aria-hidden="true">{series.team_a?.slice(0, 3).toUpperCase()}</div>
            <p className="strong">{series.team_a}</p>
          </div>
          <div className="wins-block muted">
            <span className="wins-label">{t('predict.notOpenYet')}</span>
          </div>
        </div>
        <div className="score-block muted">
          <span className="dash">-</span>
        </div>
        <div className="series-side">
          <div className="team-block">
            <div className="logo" aria-hidden="true">{series.team_b?.slice(0, 3).toUpperCase()}</div>
            <p className="strong">{series.team_b}</p>
          </div>
          <div className="wins-block muted">
            <span className="wins-label">{t('predict.notOpenYet')}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatCountdown(target, now) {
  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;
}
