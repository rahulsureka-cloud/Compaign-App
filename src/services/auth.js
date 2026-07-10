// Authentication for the Marketing Campaign Management Tool.
//
// This is a POC: users are seeded on the frontend (no real password store),
// matching the app's bundled dummy-data approach. There are exactly two roles
// (see CLAUDE.md §1):
//   - admin   (Administrator)    : full access, can approve/reject campaigns
//   - creator (Campaign Creator) : sees all screens, can add campaigns, but
//                                  cannot approve/reject (GR-006).
//
// The signed-in user is kept in React context and mirrored to sessionStorage
// so a page refresh keeps the session (cleared when the tab closes).

import React, { createContext, useContext, useState, useCallback } from 'react';
import { logAudit } from './audit';

export const ROLES = {
  ADMIN: 'admin',
  CREATOR: 'creator',
};

// Demo accounts shown on the login page ("click to fill").
export const DEMO_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: ROLES.ADMIN,
    description: 'Full access · can approve & reject campaigns',
  },
  {
    username: 'creator',
    password: 'creator123',
    name: 'Campaign Creator',
    role: ROLES.CREATOR,
    description: 'View all screens · create campaigns · no approvals',
  },
];

const STORAGE_KEY = 'mcm.auth.user';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Wraps the app and exposes the current session.
 * `initialUser` is only used by tests to render in an authenticated state;
 * in the real app it is omitted and the session is restored from storage.
 */
export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(
    initialUser !== undefined ? initialUser : readStoredUser
  );

  const login = useCallback((username, password) => {
    const match = DEMO_USERS.find(
      (u) => u.username === String(username).trim().toLowerCase() && u.password === password
    );
    if (!match) return { ok: false, error: 'Invalid username or password.' };
    // Never keep the password in the session object.
    const safeUser = { username: match.username, name: match.name, role: match.role };
    setUser(safeUser);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    } catch {
      /* storage unavailable — session stays in memory only */
    }
    logAudit('Login', 'Signed in', safeUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    logAudit('Logout', 'Signed out'); // read the current user before clearing it
    setUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
