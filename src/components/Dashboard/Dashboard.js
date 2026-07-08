import React, { useEffect, useState } from 'react';
import { campaignApi } from '../../services/api';
import '../../styles/dashboard.css';

function StatCard({ label, value, tone }) {
  return (
    <div className={`stat-card ${tone || ''}`}>
      <div className="stat-value">{value.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function DecisionBar({ accepted, declined, clicked }) {
  const total = accepted + declined + clicked || 1;
  const pct = (n) => `${((n / total) * 100).toFixed(1)}%`;
  return (
    <div className="decision-bar" title="Accepted / Declined / Clicked-unfinished">
      <span className="seg accepted" style={{ width: pct(accepted) }} />
      <span className="seg declined" style={{ width: pct(declined) }} />
      <span className="seg clicked" style={{ width: pct(clicked) }} />
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    campaignApi
      .getDashboard()
      .then(setSummary)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error-banner">{error}</div>;
  if (!summary) return <div className="loading">Loading dashboard…</div>;

  return (
    <div className="dashboard">
      <div className="stat-grid">
        <StatCard label="Total Targeted Population" value={summary.totalTargetedPopulation} tone="primary" />
        <StatCard label="Accepted / Fulfilled" value={summary.totalAccepted} tone="accepted" />
        <StatCard label="Declined" value={summary.totalDeclined} tone="declined" />
        <StatCard label="Clicked but Unfinished" value={summary.totalClickedUnfinished} tone="clicked" />
        <StatCard label="Active Campaigns" value={summary.activeCampaigns} />
        <StatCard label="Total Campaigns" value={summary.totalCampaigns} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Campaign & Promotion Performance</h2>
          <div className="legend">
            <span><i className="dot accepted" /> Accepted/Fulfilled</span>
            <span><i className="dot declined" /> Declined</span>
            <span><i className="dot clicked" /> Clicked but unfinished</span>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th className="num">Targeted Population</th>
              <th className="num">Accepted</th>
              <th className="num">Declined</th>
              <th className="num">Clicked / Unfinished</th>
              <th>Decision breakdown</th>
            </tr>
          </thead>
          <tbody>
            {summary.campaigns.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td><span className={`badge status-${c.status.toLowerCase()}`}>{c.status}</span></td>
                <td className="num">{c.targetedPopulation.toLocaleString()}</td>
                <td className="num">{c.accepted.toLocaleString()}</td>
                <td className="num">{c.declined.toLocaleString()}</td>
                <td className="num">{c.clickedUnfinished.toLocaleString()}</td>
                <td>
                  <DecisionBar accepted={c.accepted} declined={c.declined} clicked={c.clickedUnfinished} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
