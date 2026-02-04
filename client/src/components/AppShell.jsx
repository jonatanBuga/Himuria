import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function AppShell() {
  const { logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="topbar-brand">
          <p className="eyebrow">{t('topbar.brand')}</p>
          <h1>{t('topbar.title')}</h1>
        </div>
        <div className="topbar-actions">
          <div className="language-switch">
            <span className="fine">{t('topbar.language')}</span>
            <div className="switch-buttons">
              <button
                type="button"
                className={`ghost ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                {t('language.en')}
              </button>
              <button
                type="button"
                className={`ghost ${language === 'he' ? 'active' : ''}`}
                onClick={() => setLanguage('he')}
              >
                {t('language.he')}
              </button>
            </div>
          </div>
          <button className="ghost logout" type="button" onClick={handleLogout}>
            {t('topbar.logout')}
          </button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4.5 3 12h2.5v7H10v-4h4v4h4.5v-7H21z" fill="currentColor" />
            </svg>
          </span>
          <span>{t('nav.home')}</span>
        </NavLink>
        <NavLink to="/predict" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            </svg>
          </span>
          <span>{t('nav.predict')}</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 9h4v10H5zM10 5h4v14h-4zM15 12h4v7h-4z" fill="currentColor" />
            </svg>
          </span>
          <span>{t('nav.leaderboard')}</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="9" r="4" fill="currentColor" />
              <path d="M4.5 20c1.5-3.5 5-5.5 7.5-5.5S18.5 16.5 20 20" fill="currentColor" />
            </svg>
          </span>
          <span>{t('nav.profile')}</span>
        </NavLink>
      </nav>
    </div>
  );
}
