import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProfilePage() {
  const { auth, logout } = useAuth();

  return (
    <div className="page">
      <section className="card">
        <div className="card-header">
          <h3>Profile</h3>
          <span className="accent">Member</span>
        </div>
        <div className="profile-block">
          <div>
            <p className="muted">Email</p>
            <p className="strong">{auth?.email}</p>
          </div>
          <div>
            <p className="muted">Club status</p>
            <p className="strong">Active</p>
          </div>
        </div>
        <button className="ghost" type="button" onClick={logout}>
          Log out
        </button>
      </section>
    </div>
  );
}
