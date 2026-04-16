import React, { useMemo, useState } from 'react';
import { rulesContent } from '../rules.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

// 2026 NBA Playoffs teams (16 teams; TBD = play-in winner not yet determined)
const teams = [
  // Eastern Conference
  'Pistons',
  'Celtics',
  'Knicks',
  'Cavaliers',
  'Raptors',
  'Hawks',
  '76ers',
  'TBD (East 8)',
  // Western Conference
  'Thunder',
  'Spurs',
  'Nuggets',
  'Lakers',
  'Rockets',
  'Timberwolves',
  'Blazers',
  'TBD (West 8)',
];

// Finals MVP candidates from the 2026 playoff field
const players = [
  'Shai Gilgeous-Alexander',
  'Nikola Jokic',
  'Jayson Tatum',
  'Jaylen Brown',
  'Victor Wembanyama',
  'LeBron James',
  'Anthony Davis',
  'Jalen Brunson',
  'Karl-Anthony Towns',
  'Anthony Edwards',
  'Donovan Mitchell',
  'Cade Cunningham',
  'Joel Embiid',
  'Trae Young',
  'Alperen Sengun',
  'Scottie Barnes',
];

export default function SeasonOnboardingModal({ onSubmit }) {
  const { t } = useLanguage();
  const [championPick, setChampionPick] = useState('');
  const [mvpPick, setMvpPick] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState('');

  const isValid = useMemo(() => Boolean(championPick && mvpPick), [championPick, mvpPick]);
  const handleSave = async () => {
    setError('');
    try {
      await onSubmit({ championPick, mvpPick });
    } catch (err) {
      setError(err?.message || t('season.errorSave'));
    }
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={t('season.title')}>
      <div className="overlay-card">
        <div className="overlay-header">
          <div>
            <p className="eyebrow">{t('season.eyebrow')}</p>
            <h2>{t('season.title')}</h2>
            <p className="muted">{t('season.subtitle')}</p>
          </div>
        </div>

        <div className="overlay-form">
          <label>
            {t('season.champion')}
            <select value={championPick} onChange={(event) => setChampionPick(event.target.value)}>
              <option value="" disabled>{t('season.selectTeam')}</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </label>
          <label>
            {t('season.mvp')}
            <select value={mvpPick} onChange={(event) => setMvpPick(event.target.value)}>
              <option value="" disabled>{t('season.selectPlayer')}</option>
              {players.map((player) => (
                <option key={player} value={player}>{player}</option>
              ))}
            </select>
          </label>

          <p className="fine">
            {t('season.editable')}{' '}
            <button className="link" type="button" onClick={() => setShowRules(true)}>
              {t('season.viewRules')}
            </button>
          </p>
          {error && <p className="error">{error}</p>}
        </div>

        <button
          className="primary full"
          type="button"
          disabled={!isValid}
          onClick={handleSave}
        >
          {t('season.save')}
        </button>
      </div>

      {showRules && (
        <div className="rules-modal" role="dialog" aria-modal="true" aria-label={rulesContent.title}>
          <div className="rules-card">
            <div className="rules-header">
              <h3>{rulesContent.title}</h3>
              <button className="ghost" type="button" onClick={() => setShowRules(false)}>
                {t('season.close')}
              </button>
            </div>
            <div className="rules-body">
              {rulesContent.sections.map((section) => (
                <div key={section.title}>
                  <p className="strong">{section.title}</p>
                  <p className="muted">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
