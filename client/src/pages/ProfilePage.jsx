import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function ProfilePage() {
  const { auth, logout } = useAuth();
  const { t } = useLanguage();

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
    </div>
  );
}
