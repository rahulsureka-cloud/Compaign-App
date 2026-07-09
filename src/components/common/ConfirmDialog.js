import React from 'react';
import '../../styles/global.css';

/**
 * Small yes/no confirmation modal.
 * - title:    heading, e.g. "Approve campaign?"
 * - message:  body node/string (may include bold campaign name)
 * - onConfirm / onCancel: button handlers ("Yes" / "No")
 */
export default function ConfirmDialog({ title, message, confirmLabel = 'Yes', cancelLabel = 'No', busy = false, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="confirm-box">
        <h3 className="confirm-title">{title}</h3>
        <div className="confirm-message">{message}</div>
        <div className="confirm-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={busy}>{cancelLabel}</button>
          <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
