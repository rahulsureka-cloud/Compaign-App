import React, { useState } from 'react';
import SegmentPickerModal from './SegmentPickerModal';
import FileUpload from '../../common/FileUpload';
import { combineAudienceReach } from '../../UserSegment/segmentOptions';
import '../../../styles/wizard.css';

export default function StepSegment({ form, patch, segments }) {
  const [showModal, setShowModal] = useState(false);

  const selectedSegments = segments.filter((s) => form.segmentIds.includes(s.id));
  const existingUsers = selectedSegments.reduce((sum, s) => sum + (s.estimatedReach || 0), 0);
  const manualUsers = form.manualUploadUsers || 0;
  // Rough de-dup estimate for the POC (shared with the segment builder).
  const estimatedReach = combineAudienceReach({
    segmentReaches: selectedSegments.map((s) => s.estimatedReach),
    manualUsers,
  });

  // Recompute estimatedReach on the form whenever the selection or upload changes.
  const recalc = (ids, mUsers) => {
    patch({
      estimatedReach: combineAudienceReach({
        segmentReaches: segments.filter((s) => ids.includes(s.id)).map((s) => s.estimatedReach),
        manualUsers: mUsers,
      }),
    });
  };

  const applySelection = (ids) => {
    setShowModal(false);
    patch({ segmentIds: ids });
    recalc(ids, manualUsers);
  };

  const removeSegment = (id) => {
    const ids = form.segmentIds.filter((x) => x !== id);
    patch({ segmentIds: ids });
    recalc(ids, manualUsers);
  };

  const clearUpload = () => {
    patch({ manualUploadName: null, manualUploadUsers: 0 });
    recalc(form.segmentIds, 0);
  };

  return (
    <div className="wizard-body">
      <h2>User segment</h2>

      {(selectedSegments.length > 0 || form.manualUploadName) && (
        <div className="chip-row">
          <span className="chip-label">USER SEGMENT SELECTED:</span>
          {selectedSegments.map((s) => (
            <span className="chip" key={s.id}>
              {s.name}
              <button aria-label={`Remove ${s.name}`} onClick={() => removeSegment(s.id)}>✕</button>
            </span>
          ))}
          {form.manualUploadName && (
            <span className="chip">
              {form.manualUploadName}
              <button aria-label="Remove uploaded list" onClick={clearUpload}>✕</button>
            </span>
          )}
        </div>
      )}

      <div className="segment-columns">
        <div className="segment-select-card">
          <h3>Select user segment</h3>
          <button type="button" className="link-btn" onClick={() => setShowModal(true)}>
            ⊕ Add existing user segment
          </button>

          <div className="upload-block">
            <div className="upload-label">Upload user list (optional)</div>
            <FileUpload
              fileName={form.manualUploadName}
              onUpload={(name, count) => {
                patch({ manualUploadName: name, manualUploadUsers: count });
                recalc(form.segmentIds, count);
              }}
            />
          </div>
        </div>

        <div className="audience-card">
          <h3>Audience summary</h3>
          <div className="audience-line">
            <span>Existing segment users</span>
            <strong>{existingUsers.toLocaleString()}</strong>
          </div>
          <div className="audience-line">
            <span>Manual upload users</span>
            <strong>{manualUsers.toLocaleString()}</strong>
          </div>
          <div className="audience-line total">
            <span>Estimated reach ⓘ</span>
            <strong>{estimatedReach.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {showModal && (
        <SegmentPickerModal
          segments={segments}
          initialSelected={form.segmentIds}
          onAdd={applySelection}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
