import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getLockTime, isValidSeriesWins } from '../seriesPickUtils.js';

export default function SeriesPickCard({
  series,
  now,
  t,
  onSave,
  draft,
  committed,
  teamLogoMap,
}) {
  const lockAt = getLockTime(series);
  const locked = now >= lockAt || committed?.locked;

  const initialWinsA = committed?.team_a_wins ?? draft?.team_a_wins ?? 4;
  const initialWinsB = committed?.team_b_wins ?? draft?.team_b_wins ?? 2;
  const [winsA, setWinsA] = useState(initialWinsA);
  const [winsB, setWinsB] = useState(initialWinsB);
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef(null);

  useEffect(() => {
    setWinsA(initialWinsA);
    setWinsB(initialWinsB);
  }, [initialWinsA, initialWinsB]);

  useEffect(() => {
    if (!showInfo) return undefined;
    const handleOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [showInfo]);

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
        <div className="info-wrapper" ref={infoRef}>
          <button
            type="button"
            className="info-btn"
            aria-label={t('predict.helper')}
            onClick={(event) => {
              event.stopPropagation();
              setShowInfo((prev) => !prev);
            }}
          >
            i
          </button>
          {showInfo && (
            <div className="info-popover">
              {t('predict.helper')}
            </div>
          )}
        </div>
      </div>
      <div className="series-body">
        <div className="team-side">
          <TeamLogo name={series.team_a} teamLogoMap={teamLogoMap} />
          <p className="strong team-name">{series.team_a}</p>
        </div>
        <div className="score-center">
          <div className="wins-inline">
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
          <span className="dash">-</span>
          <div className="wins-inline">
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
        <div className="team-side right">
          <TeamLogo name={series.team_b} teamLogoMap={teamLogoMap} />
          <p className="strong team-name">{series.team_b}</p>
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

function normalizeTeamName(name = '') {
  const trimmed = String(name).trim().toLowerCase();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/);
  return parts[parts.length - 1];
}

export function TeamLogo({ name, teamLogoMap }) {
  const key = normalizeTeamName(name);
  const url = teamLogoMap?.[key];
  return (
    <div className="logo-slot" aria-hidden="true">
      {url ? <img src={url} alt="" loading="lazy" /> : null}
    </div>
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
