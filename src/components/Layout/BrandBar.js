import React from 'react';
import { useAuth, ROLES } from '../../services/auth';
import '../../styles/layout.css';

// Global blue "fiserv. Admin Tool" header shown on every authenticated screen.
// The right side shows the currently logged-in user's role, name, and Sign out.
export default function BrandBar() {
  const { user, logout } = useAuth();
  const roleLabel = user?.role === ROLES.ADMIN ? 'Administrator' : 'Campaign Creator';

  return (
    <header className="brandbar">
      <div className="brand-mark">
        fiserv<span className="brand-mark-dot">.</span>
        <span className="brand-app">Admin Tool</span>
      </div>
      {user && (
        <div className="brandbar-user">
          <span className="bb-role">{roleLabel}</span>
          <span className="bb-sep">·</span>
          <span className="bb-name">{user.name}</span>
          <button type="button" className="bb-signout" onClick={logout}>Sign out</button>
        </div>
      )}
    </header>
  );
}
