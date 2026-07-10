import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { segmentApi } from '../../services/api';
import uploadedUsers from '../../data/uploadedUsers.json';
import { CRITERIA, OPERATORS, MATCH_LOGIC, newRule, estimateSegmentReach } from './segmentOptions';
import FileUpload from '../common/FileUpload';
import '../../styles/segments.css';

export default function AddUserSegment() {
  const navigate = useNavigate();
  const [listSource, setListSource] = useState('new'); // 'existing' | 'new'
  const [fileName, setFileName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseSegmentId, setBaseSegmentId] = useState('');
  const [baseSegments, setBaseSegments] = useState([]);
  const [matchLogic, setMatchLogic] = useState('AND');
  const [rules, setRules] = useState([newRule()]);
  const [error, setError] = useState('');

  useEffect(() => {
    segmentApi.getAll().then((list) => setBaseSegments(list || [])).catch(() => {});
  }, []);

  const estimatedReach = estimateSegmentReach({ rules, matchLogic });

  const addRule = () => setRules((prev) => [...prev, newRule()]);
  const removeRule = (idx) => setRules((prev) => prev.filter((_, i) => i !== idx));
  const updateRule = (idx, field) => (e) =>
    setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: e.target.value } : r)));

  const buildPayload = () => ({
    name: name.trim(),
    description: description.trim() || null,
    baseSegmentId: baseSegmentId || null,
    matchLogic,
    rules,
    estimatedReach: estimateSegmentReach({ rules, matchLogic }),
  });

  const validate = () => {
    if (!name.trim()) return 'User segment name is required.';
    if (rules.length === 0) return 'Add at least one rule.';
    if (rules.some((r) => r.value.toString().trim() === '')) return 'Every rule needs a value.';
    return '';
  };

  const save = async (thenReset) => {
    const v = validate();
    if (v) { setError(v); return; }
    setError('');
    try {
      await segmentApi.create(buildPayload());
      if (thenReset) {
        setName('');
        setDescription('');
        setBaseSegmentId('');
        setMatchLogic('AND');
        setRules([newRule()]);
      } else {
        navigate('/user-segment');
      }
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

        <div className="segment-meta">
          <input
            className="text-input"
            placeholder="User segment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="text-input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select className="text-input" value={baseSegmentId} onChange={(e) => setBaseSegmentId(e.target.value)}>
            <option value="">Select existing segment (optional)</option>
            {baseSegments.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="panel">
        <div className="criteria-header">
          <h3>Segment criteria</h3>
          <button type="button" className="link-btn" onClick={addRule}>⊕ Add rule</button>
        </div>

        {rules.map((rule, idx) => (
          <div className="rule-card" key={idx}>
            <div className="rule-title">
              {idx > 0 && (
                <select
                  className="match-logic"
                  value={matchLogic}
                  onChange={(e) => setMatchLogic(e.target.value)}
                  aria-label="Match logic"
                >
                  {MATCH_LOGIC.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              )}
              <span className="rule-label">Rule {idx + 1}</span>
              {rules.length > 1 && (
                <button
                  type="button"
                  className="icon-btn danger"
                  aria-label={`Delete rule ${idx + 1}`}
                  onClick={() => removeRule(idx)}
                >
                  🗑️
                </button>
              )}
            </div>
            <div className="rule-fields">
              <label className="field">
                <span>Select criteria</span>
                <select value={rule.criteria} onChange={updateRule(idx, 'criteria')}>
                  {CRITERIA.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Operator</span>
                <select value={rule.operator} onChange={updateRule(idx, 'operator')}>
                  {OPERATORS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Value</span>
                <input value={rule.value} onChange={updateRule(idx, 'value')} placeholder="e.g. 25" />
              </label>
            </div>
          </div>
        ))}
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
