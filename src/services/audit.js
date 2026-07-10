// Lightweight client-side **audit trail** for the POC.
//
// It records key user actions — sign-ins/outs, approvals, and campaign/segment
// changes — so an Administrator can review "who did what, and when" on the
// Audit Trail screen. Entries are kept in localStorage (newest first) so they
// survive refreshes and sessions. This is a POC store, not a secure/tamper-proof
// audit log; a real system would record these server-side.

const STORAGE_KEY = 'mcm.audit.log';
const AUTH_KEY = 'mcm.auth.user';
const MAX_ENTRIES = 500;

function currentUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAuditLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * Append an audit entry. `user` can be passed explicitly (e.g. during login,
 * before the session is stored); otherwise the current signed-in user is used.
 */
export function logAudit(action, details = '', user) {
  const who = user || currentUser();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    username: who?.username || 'anonymous',
    name: who?.name || 'Unknown',
    role: who?.role || '—',
    action,
    details,
  };
  save([entry, ...getAuditLog()]);
  return entry;
}

export function clearAuditLog() {
  save([]);
}

/**
 * Seed a few sample historical entries the first time the log is viewed, so the
 * screen isn't empty before any live actions occur (useful for demos). Does
 * nothing once the log already has entries.
 */
export function ensureAuditSeed() {
  if (getAuditLog().length > 0) return;
  const now = Date.now();
  const at = (minsAgo) => new Date(now - minsAgo * 60000).toISOString();
  const admin = { username: 'admin', name: 'Administrator', role: 'admin' };
  const creator = { username: 'creator', name: 'Campaign Creator', role: 'creator' };
  const sample = [
    { minsAgo: 5, action: 'Login', details: 'Signed in', who: admin },
    { minsAgo: 42, action: 'Approve campaign', details: 'Premium Savings Cross-sell', who: admin },
    { minsAgo: 63, action: 'Reject campaign', details: 'Holiday Credit Offer', who: admin },
    { minsAgo: 120, action: 'Create campaign', details: 'Auto Loan Spring Promo', who: creator },
    { minsAgo: 135, action: 'Create segment', details: 'California Adults 25+', who: creator },
    { minsAgo: 140, action: 'Login', details: 'Signed in', who: creator },
  ];
  const entries = sample.map((s, i) => ({
    id: `seed-${i}`,
    timestamp: at(s.minsAgo),
    username: s.who.username,
    name: s.who.name,
    role: s.who.role,
    action: s.action,
    details: s.details,
  }));
  save(entries);
}
