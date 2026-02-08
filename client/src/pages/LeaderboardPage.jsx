import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { fetchLeaderboard } from '../api.js';
import { supabase } from '../supabaseClient.js';

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const { auth } = useAuth();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const getToken = async () => {
    if (auth?.token) return auth.token;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const data = await fetchLeaderboard(token);
        if (!active) return;
        setRows(data || []);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Failed to load leaderboard.');
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [auth?.token]);

  const maxExact = useMemo(() => Math.max(0, ...rows.map((row) => row.exact || 0)), [rows]);
  const maxWrong = useMemo(() => Math.max(0, ...rows.map((row) => row.wrong || 0)), [rows]);

  return (
    <div className="page">
      <section className="card table-card">
        <div className="card-header">
          <h3>{t('leaderboard.title')}</h3>
          <span className="accent">{t('leaderboard.tag')}</span>
        </div>
        <div className="table-wrapper">
          <div className="table" role="table" aria-label="Leaderboard">
            <div className="table-row table-header" role="row">
              <div className="table-cell sticky" role="columnheader">{t('leaderboard.columns.player')}</div>
              <div className="table-cell" role="columnheader">{t('leaderboard.columns.correct')}</div>
              <div className="table-cell" role="columnheader">{t('leaderboard.columns.exact')}</div>
              <div className="table-cell" role="columnheader">{t('leaderboard.columns.wrong')}</div>
              <div className="table-cell" role="columnheader">{t('leaderboard.columns.champion')}</div>
              <div className="table-cell" role="columnheader">{t('leaderboard.columns.points')}</div>
            </div>
            {rows.map((row) => {
              const highlightBest = row.exact === maxExact && maxExact > 0;
              const highlightWorst = row.wrong === maxWrong && maxWrong > 0;
              const rowClass = highlightBest
                ? 'table-row highlight-best'
                : highlightWorst
                  ? 'table-row highlight-worst'
                  : 'table-row';
              return (
                <div key={row.user_id} className={rowClass} role="row">
                  <div className="table-cell sticky strong" role="cell">{row.username}</div>
                  <div className="table-cell" role="cell">{row.correct}</div>
                  <div className="table-cell" role="cell">{row.exact}</div>
                  <div className="table-cell" role="cell">{row.wrong}</div>
                  <div className="table-cell" role="cell">{row.champion_team || '—'}</div>
                  <div className="table-cell strong" role="cell">{row.total_points}</div>
                </div>
              );
            })}
          </div>
        </div>
        {error && <p className="error">{error}</p>}
      </section>
    </div>
  );
}
