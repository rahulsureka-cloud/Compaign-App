import React, { useState } from 'react';
import SegmentPickerModal from './SegmentPickerModal';
import { countUsersInFile } from './parseUpload';
import '../../../styles/wizard.css';

export default function StepSegment({ form, patch, segments }) {
  const [showModal, setShowModal] = useState(false);

  const selectedSegments = segments.filter((s) => form.segmentIds.includes(s.id));
  const existingUsers = selectedSegments.reduce((sum, s) => sum + (s.estimatedReach || 0), 0);
  const manualUsers = form.manualUploadUsers || 0;
  // Rough de-dup estimate for the POC.
  const estimatedReach = Math.round((existingUsers + manualUsers) * 0.9);

  // Recompute estimatedReach on the form whenever the selection or upload changes.
  const recalc = (ids, mUsers) => {
    const eUsers = segments
      .filter((s) => ids.includes(s.id))
      .reduce((sum, s) => sum + (s.estimatedReach || 0), 0);
    patch({ estimatedReach: Math.round((eUsers + mUsers) * 0.9) });
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

  // Parse the uploaded file and reflect its real user count. A new upload
  // overwrites any previously uploaded list.
  const onFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allow re-selecting the same file name
    if (!file) return;
    const count = await countUsersInFile(file);
    patch({ manualUploadName: file.name, manualUploadUsers: count });
    recalc(form.segmentIds, count);
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
            <p className="hint">ⓘ For manual list, please upload CSV, XLS, XLSX files. Max file size: 60MB.</p>
            <div className="upload-row">
              <label className="btn btn-outline file-btn">
                Select a file
                <input type="file" accept=".csv,.xls,.xlsx" hidden onChange={onFile} />
              </label>
              <div className="dropzone">{form.manualUploadName || 'Drop your file here'}</div>
            </div>
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
