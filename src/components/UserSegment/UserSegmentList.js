import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { segmentApi } from '../../services/api';
import { describeRules } from './segmentOptions';
import '../../styles/segments.css';

export default function UserSegmentList() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    segmentApi
      .getAll()
      .then(setSegments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete segment "${name}"?`)) return;
    try {
      await segmentApi.remove(id);
      setSegments((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="loading">Loading segments…</div>;

  return (
    <div className="segments-page">
      <div className="page-header">
        <h2>User segment</h2>
        <button className="btn btn-primary" onClick={() => navigate('/user-segment/new')}>
          + Add user segment
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Segment name</th>
              <th>Description</th>
              <th>Criteria</th>
              <th className="num">Estimated reach</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {segments.length === 0 && (
              <tr><td colSpan="5" className="empty">No segments yet.</td></tr>
            )}
            {segments.map((s) => (
              <tr key={s.id}>
                <td className="cell-title">{s.name}</td>
                <td>{s.description}</td>
                <td className="rules-cell">{describeRules(s)}</td>
                <td className="num">{s.estimatedReach.toLocaleString()}</td>
                <td className="actions">
                  <button
                    className="icon-btn danger"
                    title="Delete"
                    aria-label={`Delete ${s.name}`}
                    onClick={() => handleDelete(s.id, s.name)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
