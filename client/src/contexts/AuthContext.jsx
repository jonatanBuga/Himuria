import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { fetchProfile } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateAuth = async (session) => {
    if (!session) {
      setAuth(null);
      setLoading(false);
      return;
    }
    const token = session.access_token;
    const email = session.user.email;
    try {
      const profile = await fetchProfile(token);
      setAuth({
        id: session.user.id,
        email,
        token,
        hasSeasonPicks: profile.has_onboarded,
        profile,
      });
    } catch (err) {
      setAuth({ id: session.user.id, email, token, hasSeasonPicks: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      hydrateAuth(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrateAuth(session);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setAuth(null);
  };

  const updateAuth = (next) => {
    setAuth(next);
  };

  const value = useMemo(() => ({ auth, logout, updateAuth, loading }), [auth, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
