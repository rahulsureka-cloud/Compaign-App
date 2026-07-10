import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { segmentApi } from '../../services/api';
import uploadedUsers from '../../data/uploadedUsers.json';
import {
  estimateSegmentReach,
  emptySegmentForm,
  validateSegmentForm,
  buildSegmentPayload,
} from './segmentOptions';
import SegmentDefinitionForm from './SegmentDefinitionForm';
import FileUpload from '../common/FileUpload';
import '../../styles/segments.css';

export default function AddUserSegment() {
  const navigate = useNavigate();
  const [listSource, setListSource] = useState('new'); // 'existing' | 'new'
  const [fileName, setFileName] = useState('');
  const [value, setValue] = useState(emptySegmentForm());
  const [baseSegments, setBaseSegments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    segmentApi.getAll().then((list) => setBaseSegments(list || [])).catch(() => {});
  }, []);

  const estimatedReach = estimateSegmentReach({ rules: value.rules, matchLogic: value.matchLogic });

  const save = async (thenReset) => {
    const v = validateSegmentForm(value);
    if (v) { setError(v); return; }
    setError('');
    try {
      await segmentApi.create(buildSegmentPayload(value));
      if (thenReset) setValue(emptySegmentForm());
      else navigate('/user-segment');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="add-segment-page">
      {/* Import custom user list + Audience summary */}
      <div className="import-row">
        <div className="panel import-panel">
          <h2>Import custom user list</h2>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                name="listSource"
                checked={listSource === 'existing'}
                onChange={() => setListSource('existing')}
              />
              Existing customer list
            </label>
            <label>
              <input
                type="radio"
                name="listSource"
                checked={listSource === 'new'}
                onChange={() => setListSource('new')}
              />
              New customer list
            </label>
          </div>
          <FileUpload
            fileName={fileName}
            onUpload={(name) => setFileName(name)}
          />
        </div>

        <div className="panel audience-panel">
          <h3>Audience summary</h3>
          <div className="audience-sub">Estimated reach</div>
          <div className="audience-value">{estimatedReach.toLocaleString()}</div>
          <div className="audience-sub">based on segment rules</div>
        </div>
      </div>

      {/* Review uploaded list */}
      <div className="panel">
        <h3>Review uploaded list</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th><th>Name</th><th className="num">Age</th><th>State</th><th>Date of birth</th>
            </tr>
          </thead>
          <tbody>
            {uploadedUsers.map((u, i) => (
              <tr key={i}>
                <td><span className="status-ok" title="valid">✔</span></td>
                <td>{u.name}</td>
                <td className="num">{u.age}</td>
                <td>{u.state}</td>
                <td>{u.dateOfBirth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add user segment form */}
      <div className="panel">
        <h2>Add user segment</h2>
        {error && <div className="error-banner">{error}</div>}
        <SegmentDefinitionForm value={value} onChange={setValue} baseSegments={baseSegments} />
      </div>

      <div className="form-actions sticky-actions">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/user-segment')}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={() => save(false)}>
          Import
        </button>
        <button type="button" className="btn btn-primary" onClick={() => save(true)}>
          Add new
        </button>
      </div>
    </div>
  );
}
