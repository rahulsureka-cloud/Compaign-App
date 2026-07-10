import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES } from './templateData';
import '../../styles/templates.css';

export default function TemplateList() {
  const navigate = useNavigate();
  const use = (tpl) => navigate('/campaigns/new', { state: { template: tpl.campaign } });
  return (
    <div className="templates-page">
      <div className="page-header"><h2>Campaign templates</h2></div>
      <p className="hint">Start from a ready-made blueprint — it pre-fills the campaign wizard, which you can then adjust.</p>
      <div className="template-grid">
        {TEMPLATES.map((tpl) => (
          <div className="template-card panel" key={tpl.key}>
            <h3>{tpl.title}</h3>
            <p className="template-summary">{tpl.summary}</p>
            <div className="template-meta">
              <span className="badge status-active">{tpl.campaign.productCategory}</span>
              <span className="template-channels">{tpl.campaign.channels.join(', ')}</span>
            </div>
            <button className="btn btn-primary" onClick={() => use(tpl)}>Use template</button>
          </div>
        ))}
      </div>
    </div>
  );
}
