import React from 'react';
import { CHANNELS, PRODUCT_CATEGORIES, PRIORITIES } from '../campaignOptions';
import '../../../styles/wizard.css';

export default function StepSetup({ form, patch }) {
  const set = (field) => (e) => patch({ [field]: e.target.value });

  const toggleChannel = (value) => {
    const has = form.channels.includes(value);
    patch({
      channels: has ? form.channels.filter((c) => c !== value) : [...form.channels, value],
    });
  };

  return (
    <div className="wizard-body">
      <h2>Campaign details</h2>

      <label className="field">
        <input value={form.name} onChange={set('name')} placeholder="Campaign name" />
      </label>

      <label className="field">
        <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Description" />
        <span className="opt">Optional</span>
      </label>

      <label className="field">
        <input value={form.keywords} onChange={set('keywords')} placeholder="Keywords (separated by comma)" />
        <span className="opt">Optional</span>
      </label>

      <div className="field-row">
        <label className="field">
          <select value={form.productCategory} onChange={set('productCategory')}>
            <option value="">Product category</option>
            {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="opt">Optional</span>
        </label>
        <label className="field">
          <select value={form.priority} onChange={set('priority')}>
            <option value="">Priority</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <span className="opt">Optional</span>
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <input type="date" value={form.startDate} onChange={set('startDate')} placeholder="Start date" />
        </label>
        <label className="field">
          <input type="date" value={form.endDate} onChange={set('endDate')} placeholder="End date" />
        </label>
      </div>

      <div className="channel-block">
        <div className="channel-title">Channel</div>
        <div className="channel-grid">
          {CHANNELS.map((c) => {
            const selected = form.channels.includes(c.value);
            return (
              <button
                type="button"
                key={c.value}
                className={`channel-card ${selected ? 'selected' : ''}`}
                onClick={() => toggleChannel(c.value)}
                aria-pressed={selected}
              >
                <span className="channel-check">{selected ? '✓' : ''}</span>
                <span className="channel-icon">{c.icon}</span>
                <span className="channel-name">{c.value}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
