import React, { useState } from 'react';
import SegmentDefinitionForm from './SegmentDefinitionForm';
import { emptySegmentForm, validateSegmentForm, buildSegmentPayload } from './segmentOptions';
import { segmentApi } from '../../services/api';
import '../../styles/wizard.css';
import '../../styles/segments.css';

/**
 * "Create user segment" modal used inside the campaign wizard so a marketer can
 * build a new audience without leaving the flow. On success it returns the
 * created segment via onCreated(segment). Reuses SegmentDefinitionForm.
 * GR-004-style validation + GR-005-style double-submit guard.
 */
export default function CreateSegmentModal({ baseSegments = [], onCreated, onClose }) {
  const [value, setValue] = useState(emptySegmentForm());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (busy) return; // GR-005
    const v = validateSegmentForm(value);
    if (v) { setError(v); return; }
    setError('');
    setBusy(true);
    try {
      const created = await segmentApi.create(buildSegmentPayload(value));
      onCreated(created);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create user segment">
      <div className="modal">
        <div className="modal-header">
          <h3>Create user segment</h3>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="error-banner">{error}</div>}
        <SegmentDefinitionForm value={value} onChange={setValue} baseSegments={baseSegments} showReach />
        <div className="modal-actions">
          <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="button" disabled={busy} onClick={save}>
            {busy ? 'Saving…' : 'Save segment'}
          </button>
        </div>
      </div>
    </div>
  );
}
