import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('himuria_auth');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (payload) => {
    setAuth(payload);
    localStorage.setItem('himuria_auth', JSON.stringify(payload));
  };

  const logout = () => {
    setAuth(null);
    // Clear local storage to remove session and related cached data.
    localStorage.clear();
  };

  const value = useMemo(() => ({ auth, login, logout }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
