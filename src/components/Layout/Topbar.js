import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../../services/auth';
import '../../styles/layout.css';

const titles = {
  '/dashboard': 'Campaign & Promotion Dashboard',
  '/campaigns': 'Campaigns',
  '/campaigns/new': 'Create campaign',
  '/user-segment': 'User segment',
  '/user-segment/new': 'Add user segment',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const crumb = titles[pathname] || 'Marketing';
  const roleLabel = user?.role === ROLES.ADMIN ? 'Administrator' : 'Campaign Creator';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          Marketing <span className="crumb-sep">›</span> {crumb}
        </div>
        <h1 className="topbar-title">🏬 Marketing</h1>
      </div>
      {user && (
        <div className="topbar-user">
          <div className="user-meta">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{roleLabel}</span>
          </div>
          <button className="link-btn" onClick={logout}>Sign out</button>
        </div>
      )}
    </header>
  );
}
