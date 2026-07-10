import React from 'react';
import { CRITERIA, OPERATORS, MATCH_LOGIC, newRule, estimateSegmentReach } from './segmentOptions';
import '../../styles/segments.css';

/**
 * Controlled segment-definition form: name, description, optional base segment,
 * and the criteria rules. Reused by the User Segment page (AddUserSegment) and
 * the in-wizard CreateSegmentModal so both build a segment identically.
 * `value` is { name, description, baseSegmentId, matchLogic, rules }.
 */
export default function SegmentDefinitionForm({ value, onChange, baseSegments = [], showReach = false }) {
  const { name, description, baseSegmentId, matchLogic, rules } = value;
  const set = (changes) => onChange({ ...value, ...changes });

  const addRule = () => set({ rules: [...rules, newRule()] });
  const removeRule = (idx) => set({ rules: rules.filter((_, i) => i !== idx) });
  const updateRule = (idx, field) => (e) =>
    set({ rules: rules.map((r, i) => (i === idx ? { ...r, [field]: e.target.value } : r)) });

  const estimatedReach = estimateSegmentReach({ rules, matchLogic });

  return (
    <div className="segment-definition">
      <div className="segment-meta">
        <input
          className="text-input"
          placeholder="User segment name"
          value={name}
          onChange={(e) => set({ name: e.target.value })}
        />
        <input
          className="text-input"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => set({ description: e.target.value })}
        />
        <select className="text-input" value={baseSegmentId} onChange={(e) => set({ baseSegmentId: e.target.value })}>
          <option value="">Select existing segment (optional)</option>
          {baseSegments.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

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
                onChange={(e) => set({ matchLogic: e.target.value })}
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

      {showReach && (
        <div className="audience-line total">
          <span>Estimated reach ⓘ</span>
          <strong>{estimatedReach.toLocaleString()}</strong>
        </div>
      )}
    </div>
  );
}
