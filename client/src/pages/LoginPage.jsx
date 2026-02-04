import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [skipTyping, setSkipTyping] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showCard, setShowCard] = useState(false);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const emailRef = useRef(null);
  const { language, setLanguage, t } = useLanguage();

  const fullTitle = t('hero.title');
  const fullSubtitle = t('hero.subtitle');
  const motionSafe = useMemo(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Typing animation for hero headline/subtitle (skippable).
    if (!motionSafe) {
      setTitleText(fullTitle);
      setSubtitleText(fullSubtitle);
      return;
    }
    if (skipTyping) {
      setTitleText(fullTitle);
      setSubtitleText(fullSubtitle);
      return;
    }

    let titleIdx = 0;
    let subtitleIdx = 0;
    let titleTimer;
    let subtitleTimer;

    const typeTitle = () => {
      titleTimer = setInterval(() => {
        titleIdx += 1;
        setTitleText(fullTitle.slice(0, titleIdx));
        if (titleIdx >= fullTitle.length) {
          clearInterval(titleTimer);
          setTimeout(typeSubtitle, 220);
        }
      }, Math.max(50, Math.floor(1000 / fullTitle.length)));
    };

    const typeSubtitle = () => {
      subtitleTimer = setInterval(() => {
        subtitleIdx += 1;
        setSubtitleText(fullSubtitle.slice(0, subtitleIdx));
        if (subtitleIdx >= fullSubtitle.length) {
          clearInterval(subtitleTimer);
        }
      }, Math.max(25, Math.floor(2300 / fullSubtitle.length)));
    };

    typeTitle();

    return () => {
      clearInterval(titleTimer);
      clearInterval(subtitleTimer);
    };
  }, [skipTyping, motionSafe, fullSubtitle, fullTitle]);

  useEffect(() => {
    // Parallax background movement (desktop only).
    if (!motionSafe) return undefined;
    const hero = heroRef.current;
    if (!hero) return undefined;

    const handleMove = (event) => {
      if (window.matchMedia('(max-width: 900px)').matches) return;
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const x = ((clientX / innerWidth) * 2 - 1).toFixed(2);
      const y = ((clientY / innerHeight) * 2 - 1).toFixed(2);
      hero.style.setProperty('--parallax-x', x);
      hero.style.setProperty('--parallax-y', y);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [motionSafe]);

  useEffect(() => {
    // Reveal the login card and focus the first input.
    if (!showCard) return;
    const behavior = motionSafe ? 'smooth' : 'auto';
    cardRef.current?.scrollIntoView({ behavior, block: 'center' });
    setTimeout(() => emailRef.current?.focus(), 160);
  }, [showCard, motionSafe]);

  const handleSkip = () => {
    setSkipTyping(true);
  };

  const handleContinue = () => {
    setShowCard(true);
  };

  return (
    <div
      className={`landing ${showCard ? 'show-card' : ''}`}
      ref={heroRef}
      onClick={handleSkip}
      role="presentation"
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <div className="language-switch" onClick={(event) => event.stopPropagation()}>
        <span className="fine">{t('language.label')}</span>
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

      <div className="landing-bg" aria-hidden="true">
        <span className="blob blob-orange"></span>
        <span className="blob blob-dark"></span>
        <span className="blob blob-orange small"></span>
        <span className="dot dot-1"></span>
        <span className="dot dot-2"></span>
        <span className="dot dot-3"></span>
      </div>

      <section className="landing-hero">
        <p className="eyebrow">{t('hero.eyebrow')}</p>
        <h1 className="hero-title">
          {titleText}
          <span className="cursor" aria-hidden="true" />
        </h1>
        <p className="hero-subtitle">{subtitleText}</p>
        <div className="hero-actions">
          <button className="primary" type="button" onClick={handleContinue}>
            {t('buttons.continue')}
          </button>
          <p className="fine">{t('hero.skip')}</p>
        </div>
      </section>

      {showCard && (
        <section className="auth-card landing-card animate-in" ref={cardRef}>
          <div>
            <p className="eyebrow">{t('auth.welcome')}</p>
            <h1>{t('auth.headline')}</h1>
            <p className="muted">{t('auth.copy')}</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              {t('auth.email')}
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </label>
            <label>
              {t('auth.password')}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="primary" type="submit" disabled={loading}>
              {loading ? t('buttons.loginLoading') : t('buttons.login')}
            </button>
          </form>
          <p className="fine">
            {t('auth.newHere')} <Link to="/register">{t('auth.createAccount')}</Link>
          </p>
        </section>
      )}
    </div>
  );
}
