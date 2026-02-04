import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AppShell() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Himuria</p>
          <h1>Playoff Club</h1>
        </div>
        <div className="status-pill">NBA Playoffs</div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          <span>Home</span>
        </NavLink>
        <NavLink to="/predict" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span>Predict</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span>Leaderboard</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
