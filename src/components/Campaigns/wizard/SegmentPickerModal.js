import React, { useState } from 'react';
import { describeRules } from '../../UserSegment/segmentOptions';
import '../../../styles/wizard.css';

/**
 * "Select user segment" modal. Shows all segments with a checkbox; selection is
 * confirmed with Add. `initialSelected` / `onAdd` carry the selected segment ids.
 */
export default function SegmentPickerModal({ segments, initialSelected, onAdd, onClose }) {
  const [selected, setSelected] = useState(new Set(initialSelected));
  const [search, setSearch] = useState('');

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const visible = segments.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const selectedSegments = segments.filter((s) => selected.has(s.id));

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Select user segment">
      <div className="modal">
        <div className="modal-header">
          <h3>Select user segment</h3>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-search">
          <input
            type="text"
            placeholder="Search user segment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" type="button">Search</button>
        </div>

        {selectedSegments.length > 0 && (
          <div className="chip-row">
            <span className="chip-label">USER SEGMENT SELECTED:</span>
            {selectedSegments.map((s) => (
              <span className="chip" key={s.id}>
                {s.name}
                <button aria-label={`Remove ${s.name}`} onClick={() => toggle(s.id)}>✕</button>
              </span>
            ))}
          </div>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>User segment name</th>
              <th className="num">Total users</th>
              <th>Segment criteria</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.id}>
                <td className="cell-title link-text">{s.name}</td>
                <td className="num">{s.estimatedReach.toLocaleString()}</td>
                <td className="rules-cell">{describeRules(s)}</td>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${s.name}`}
                    checked={selected.has(s.id)}
                    onChange={() => toggle(s.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-actions">
          <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="button" onClick={() => onAdd(Array.from(selected))}>Add</button>
        </div>
      </div>
    </div>
  );
}
