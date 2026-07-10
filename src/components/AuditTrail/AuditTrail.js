import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { getAuditLog, ensureAuditSeed, clearAuditLog } from '../../services/audit';
import '../../styles/audit.css';

// Admin-only Audit Trail: who signed in, what action they performed, and when.
export default function AuditTrail() {
  const { isAdmin } = useAuth();
  const [entries, setEntries] = useState([]);

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

  const fmt = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
  };
  const roleLabel = (role) =>
    role === 'admin' ? 'Administrator' : role === 'creator' ? 'Campaign Creator' : role;

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
        A record of who signed in and what actions were performed across the app,
        newest first. {entries.length} {entries.length === 1 ? 'entry' : 'entries'}.
      </p>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date &amp; time</th>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr><td colSpan="5" className="empty">No activity recorded yet.</td></tr>
            )}
            {entries.map((e) => (
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
