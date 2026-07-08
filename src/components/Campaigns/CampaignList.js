import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignApi } from '../../services/api';
import '../../styles/campaigns.css';

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    campaignApi
      .getAll()
      .then((data) => setCampaigns(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete campaign "${name}"?`)) return;
    try {
      await campaignApi.remove(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="loading">Loading campaigns…</div>;

  return (
    <div className="campaigns-page">
      <div className="page-header">
        <h2>Campaigns</h2>
        <button className="btn btn-primary" onClick={() => navigate('/campaigns/new')}>
          + Create campaign
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th className="num">Targeted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 && (
              <tr><td colSpan="7" className="empty">No campaigns yet.</td></tr>
            )}
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="cell-title">{c.name}</div>
                  <div className="cell-sub">{c.description}</div>
                </td>
                <td>{c.channel}</td>
                <td><span className={`badge status-${c.status.toLowerCase()}`}>{c.status}</span></td>
                <td>{c.startDate}</td>
                <td>{c.endDate}</td>
                <td className="num">{c.targetedPopulation.toLocaleString()}</td>
                <td className="actions">
                  <button
                    className="icon-btn"
                    title="Edit"
                    aria-label={`Edit ${c.name}`}
                    onClick={() => navigate(`/campaigns/${c.id}/edit`)}
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn danger"
                    title="Delete"
                    aria-label={`Delete ${c.name}`}
                    onClick={() => handleDelete(c.id, c.name)}
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
