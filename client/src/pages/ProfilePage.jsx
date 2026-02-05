import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { saveSeasonDraft } from '../api.js';
import useSeasonPicks from '../hooks/useSeasonPicks.js';

export default function ProfilePage() {
  const { auth, logout } = useAuth();
  const { t } = useLanguage();
  const { draft, committed, setDraft } = useSeasonPicks(auth?.token);
  const [editing, setEditing] = React.useState(false);
  const [championPick, setChampionPick] = React.useState('');
  const [mvpPick, setMvpPick] = React.useState('');

  React.useEffect(() => {
    if (draft?.champion_team) setChampionPick(draft.champion_team);
    if (draft?.mvp_player) setMvpPick(draft.mvp_player);
  }, [draft]);

  const handleSave = async () => {
    if (!auth?.token) return;
    const saved = await saveSeasonDraft(auth.token, { championPick, mvpPick });
    setDraft(saved);
    setEditing(false);
  };

  return (
    <div className="page">
      <section className="card">
        <div className="card-header">
          <h3>{t('profile.title')}</h3>
          <span className="accent">{t('profile.tag')}</span>
        </div>
        <div className="profile-block">
          <div>
            <p className="muted">{t('profile.email')}</p>
            <p className="strong">{auth?.email}</p>
          </div>
          <div>
            <p className="muted">{t('profile.status')}</p>
            <p className="strong">{t('profile.active')}</p>
          </div>
        </div>
        <button className="ghost" type="button" onClick={logout}>
          {t('profile.logout')}
        </button>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>{t('season.section')}</h3>
          <span className="accent">{committed?.is_locked ? t('season.locked') : t('season.editableLabel')}</span>
        </div>
        <div className="profile-block">
          <div>
            <p className="muted">{t('season.champion')}</p>
            <p className="strong">{(committed?.champion_team || draft?.champion_team) || '—'}</p>
          </div>
          <div>
            <p className="muted">{t('season.mvp')}</p>
            <p className="strong">{(committed?.mvp_player || draft?.mvp_player) || '—'}</p>
          </div>
        </div>
        {editing && !committed?.is_locked ? (
          <div className="form">
            <label>
              {t('season.champion')}
              <input value={championPick} onChange={(event) => setChampionPick(event.target.value)} />
            </label>
            <label>
              {t('season.mvp')}
              <input value={mvpPick} onChange={(event) => setMvpPick(event.target.value)} />
            </label>
            <button className="primary" type="button" onClick={handleSave} disabled={!championPick || !mvpPick}>
              {t('season.save')}
            </button>
          </div>
        ) : (
          <button className="ghost" type="button" onClick={() => setEditing(true)} disabled={committed?.is_locked}>
            {t('season.edit')}
          </button>
        )}
      </section>
    </div>
  );
}
