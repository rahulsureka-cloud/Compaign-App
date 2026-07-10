import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignApi } from '../../services/api';
import { CAMPAIGN_STATUSES } from './campaignOptions';
import '../../styles/campaigns.css';

const channelText = (c) => (c.channels && c.channels.length ? c.channels.join(', ') : '—');

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Active');
  const [busy, setBusy] = useState(false);       // GR-005: in-flight action guard
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    campaignApi
      .getAll()
      .then(setCampaigns)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const tabCampaigns = campaigns.filter((c) => c.status === activeTab);

  const act = async (fn, id) => {
    if (busy) return;               // GR-005: ignore while a request is in flight
    setBusy(true);
    try {
      await fn(id);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="loading">Loading campaigns…</div>;

  return (
    <div className="campaigns-page">
      {error && <div className="error-banner">{error}</div>}

      {/* Campaigns with status tabs */}
      <div className="panel">
        <div className="campaigns-toolbar">
          <h2>Campaigns</h2>
          <div className="tabs">
            {CAMPAIGN_STATUSES.map((s) => (
              <button
                key={s}
                className={`tab ${activeTab === s ? 'active' : ''}`}
                onClick={() => setActiveTab(s)}
              >{s}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/campaigns/new')}>
            Create campaign
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Channel</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tabCampaigns.length === 0 && (
              <tr><td colSpan="6" className="empty">No {activeTab} campaigns.</td></tr>
            )}
            {tabCampaigns.map((c) => (
              <tr key={c.id}>
                <td className="cell-title link-text">{c.name}</td>
                <td>{channelText(c)}</td>
                <td>{c.startDate}</td>
                <td>{c.endDate}</td>
                <td><span className={`badge status-${c.status.toLowerCase().replace(/\s+/g, '-')}`}>{c.status}</span></td>
                <td className="actions">
                  <button
                    className="icon-btn"
                    title="Edit"
                    aria-label={`Edit ${c.name}`}
                    onClick={() => navigate(`/campaigns/${c.id}/edit`)}
                  >✏️</button>
                  <button
                    className="link-action"
                    disabled={busy}
                    onClick={() => act(campaignApi.clone, c.id)}
                  >Clone</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
