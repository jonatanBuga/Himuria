import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const leaderboardRows = [
  {
    userId: 'u1',
    username: 'Jordan',
    correctCount: 12,
    exactCount: 3,
    wrongCount: 5,
    championPick: 'Celtics',
    points: 92,
  },
  {
    userId: 'u2',
    username: 'Alex',
    correctCount: 10,
    exactCount: 4,
    wrongCount: 6,
    championPick: 'Nuggets',
    points: 88,
  },
  {
    userId: 'u3',
    username: 'Sam',
    correctCount: 9,
    exactCount: 1,
    wrongCount: 9,
    championPick: 'Thunder',
    points: 80,
  },
  {
    userId: 'u4',
    username: 'Casey',
    correctCount: 8,
    exactCount: 2,
    wrongCount: 10,
    championPick: 'Timberwolves',
    points: 74,
  },
];

export default function LeaderboardPage() {
  const { t } = useLanguage();
  // Future: hook scoring + sorting from backend without changing row structure.
  // Sorting intentionally disabled for now to preserve backend insertion order.
  const maxExact = Math.max(...leaderboardRows.map((row) => row.exactCount));
  const maxWrong = Math.max(...leaderboardRows.map((row) => row.wrongCount));

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
            {leaderboardRows.map((row) => {
              const highlightBest = row.exactCount === maxExact && maxExact > 0;
              const highlightWorst = row.wrongCount === maxWrong && maxWrong > 0;
              const rowClass = highlightBest
                ? 'table-row highlight-best'
                : highlightWorst
                  ? 'table-row highlight-worst'
                  : 'table-row';
              return (
                <div key={row.userId} className={rowClass} role="row">
                  <div className="table-cell sticky strong" role="cell">{row.username}</div>
                  <div className="table-cell" role="cell">{row.correctCount}</div>
                  <div className="table-cell" role="cell">{row.exactCount}</div>
                  <div className="table-cell" role="cell">{row.wrongCount}</div>
                  <div className="table-cell" role="cell">{row.championPick}</div>
                  <div className="table-cell strong" role="cell">{row.points}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
