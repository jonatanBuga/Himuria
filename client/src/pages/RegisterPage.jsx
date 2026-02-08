import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    console.log('signup submit triggered');
    console.log('signup email', email);
    if (password !== confirm) {
      setError(t('register.mismatch'));
      return;
    }
    if (!username.trim()) {
      setError(t('register.usernamePlaceholder'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/login`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: { username: username.trim() },
        },
      });
      console.log('signup response', { data, signUpError });
      if (signUpError) throw signUpError;
      navigate('/');
    } catch (err) {
      console.log('signup error', err);
      setError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div>
          <p className="eyebrow">{t('register.eyebrow')}</p>
          <h1>{t('register.headline')}</h1>
          <p className="muted">{t('register.copy')}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t('register.username')}
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder={t('register.usernamePlaceholder')}
              minLength={3}
              required
            />
          </label>
          <label>
            {t('auth.email')}
            <input
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
              placeholder={t('register.passwordPlaceholder')}
              minLength={6}
              required
            />
          </label>
          <label>
            {t('register.confirm')}
            <input
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder={t('register.confirmPlaceholder')}
              minLength={6}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit" disabled={loading}>
            {loading ? t('register.creating') : t('register.create')}
          </button>
        </form>
        <p className="fine">
          {t('register.haveAccount')} <Link to="/login">{t('register.signIn')}</Link>
        </p>
      </div>
    </div>
  );
}
