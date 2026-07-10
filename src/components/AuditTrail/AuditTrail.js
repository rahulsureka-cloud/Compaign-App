import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { getAuditLog, ensureAuditSeed, clearAuditLog } from '../../services/audit';
import '../../styles/audit.css';

// Column definitions: label + the value used for sorting.
const COLUMNS = [
  { key: 'timestamp', label: 'Date & time', value: (e) => e.timestamp || '' },
  { key: 'user', label: 'User', value: (e) => (e.name || '').toLowerCase() },
  { key: 'role', label: 'Role', value: (e) => (e.role || '').toLowerCase() },
  { key: 'action', label: 'Action', value: (e) => (e.action || '').toLowerCase() },
  { key: 'details', label: 'Details', value: (e) => (e.details || '').toLowerCase() },
];

// Admin-only Audit Trail: who signed in, what action they performed, and when.
export default function AuditTrail() {
  const { isAdmin } = useAuth();
  const [entries, setEntries] = useState([]);
  const [sort, setSort] = useState({ key: 'timestamp', dir: 'desc' });

  const load = () => {
    ensureAuditSeed();
    setEntries(getAuditLog());
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  // Guardrail GR-006: only Administrators may view the audit trail.
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const clear = () => {
    if (window.confirm('Clear the entire audit trail? This cannot be undone.')) {
      clearAuditLog();
      setEntries([]);
    }
  };

  // Click a header to sort; click the active column again to flip direction.
  const toggleSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'timestamp' ? 'desc' : 'asc' }
    );

  const col = COLUMNS.find((c) => c.key === sort.key) || COLUMNS[0];
  const sorted = [...entries].sort((a, b) => {
    const av = col.value(a);
    const bv = col.value(b);
    if (av < bv) return sort.dir === 'asc' ? -1 : 1;
    if (av > bv) return sort.dir === 'asc' ? 1 : -1;
    return 0;
  });

  const fmt = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
  };
  const roleLabel = (role) =>
    role === 'admin' ? 'Administrator' : role === 'creator' ? 'Campaign Creator' : role;
  const caret = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : '');

  return (
    <div className="audit-page">
      <div className="page-header">
        <h2>Audit Trail</h2>
        <div className="audit-actions">
          <button className="btn btn-outline" onClick={load}>Refresh</button>
          <button className="btn btn-outline" onClick={clear} disabled={entries.length === 0}>
            Clear log
          </button>
        </div>
      </div>
      <p className="hint">
        A record of who signed in and what actions were performed across the app.
        Click a column to sort. {entries.length} {entries.length === 1 ? 'entry' : 'entries'}.
      </p>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button type="button" className="th-sort" onClick={() => toggleSort(c.key)}>
                    {c.label}{caret(c.key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan="5" className="empty">No activity recorded yet.</td></tr>
            )}
            {sorted.map((e) => (
              <tr key={e.id}>
                <td className="audit-time">{fmt(e.timestamp)}</td>
                <td>
                  <div className="cell-title">{e.name}</div>
                  <div className="cell-sub">{e.username}</div>
                </td>
                <td>
                  <span className={`badge ${e.role === 'admin' ? 'status-active' : 'status-draft'}`}>
                    {roleLabel(e.role)}
                  </span>
                </td>
                <td className="audit-action">{e.action}</td>
                <td className="rules-cell">{e.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
