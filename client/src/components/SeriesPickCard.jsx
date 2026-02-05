import React, { useEffect, useMemo, useState } from 'react';
import { getLockTime, isValidSeriesWins } from '../seriesPickUtils.js';

export default function SeriesPickCard({
  series,
  now,
  t,
  onSave,
  draft,
  committed,
}) {
  const lockAt = getLockTime(series);
  const locked = now >= lockAt || committed?.locked;

  const initialWinsA = committed?.team_a_wins ?? draft?.team_a_wins ?? 4;
  const initialWinsB = committed?.team_b_wins ?? draft?.team_b_wins ?? 2;
  const [winsA, setWinsA] = useState(initialWinsA);
  const [winsB, setWinsB] = useState(initialWinsB);

  useEffect(() => {
    setWinsA(initialWinsA);
    setWinsB(initialWinsB);
  }, [initialWinsA, initialWinsB]);

  const isValid = useMemo(() => isValidSeriesWins(winsA, winsB), [winsA, winsB]);

  const handleInput = (setter) => (event) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    if (value === '' || (Number.isInteger(value) && value >= 0 && value <= 4)) {
      setter(value);
    }
  };

  return (
    <article className={`series-card ${locked ? 'is-locked' : ''}`}>
      <div className="series-meta">
        <div className="lock">
          <span className="clock" aria-hidden="true" />
          {locked ? t('predict.locked') : `${t('predict.locksIn')}: ${formatCountdown(lockAt, now)}`}
        </div>
      </div>
      <div className="series-body">
        <div className="series-side">
          <div className="team-block">
            <div className="logo" aria-hidden="true">{series.team_a?.slice(0, 3).toUpperCase()}</div>
            <p className="strong">{series.team_a}</p>
          </div>
          <div className="wins-block">
            <input
              type="number"
              min="0"
              max="4"
              step="1"
              value={winsA}
              onChange={handleInput(setWinsA)}
              disabled={locked}
              aria-label={`${series.team_a} wins`}
            />
            <span className="wins-label">{t('predict.winsLabel')}</span>
          </div>
        </div>
        <div className="score-block">
          <span className="dash">-</span>
          <p className="helper">{t('predict.helper')}</p>
        </div>
        <div className="series-side">
          <div className="team-block">
            <div className="logo" aria-hidden="true">{series.team_b?.slice(0, 3).toUpperCase()}</div>
            <p className="strong">{series.team_b}</p>
          </div>
          <div className="wins-block">
            <input
              type="number"
              min="0"
              max="4"
              step="1"
              value={winsB}
              onChange={handleInput(setWinsB)}
              disabled={locked}
              aria-label={`${series.team_b} wins`}
            />
            <span className="wins-label">{t('predict.winsLabel')}</span>
          </div>
        </div>
      </div>
      <button
        className="primary full"
        type="button"
        disabled={!isValid || locked}
        onClick={() => onSave(series, Number(winsA), Number(winsB), locked)}
      >
        {t('predict.save')}
      </button>
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
