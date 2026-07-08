import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignApi } from '../../services/api';
import '../../styles/campaigns.css';

const EMPTY = {
  name: '',
  description: '',
  channel: 'Email',
  status: 'Draft',
  startDate: '',
  endDate: '',
  targetedPopulation: 0,
  accepted: 0,
  declined: 0,
  clickedUnfinished: 0,
};

const CHANNELS = ['Email', 'SMS', 'Push', 'Web'];
const STATUSES = ['Draft', 'Active', 'Paused', 'Completed'];

export default function CampaignForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    campaignApi
      .getAll()
      .then((all) => {
        const found = all.find((c) => c.id === id);
        if (found) setForm(found);
        else setError('Campaign not found.');
      })
      .catch((e) => setError(e.message));
  }, [id, isEdit]);

  const update = (field) => (e) => {
    const numeric = ['targetedPopulation', 'accepted', 'declined', 'clickedUnfinished'];
    const value = numeric.includes(field) ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Campaign name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEdit) await campaignApi.update(id, form);
      else await campaignApi.create(form);
      navigate('/campaigns');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="campaign-form-page">
      <div className="panel form-panel">
        <h2>{isEdit ? 'Edit campaign' : 'Create campaign'}</h2>
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Campaign name</span>
            <input value={form.name} onChange={update('name')} placeholder="e.g. Summer Savings Boost" />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea value={form.description} onChange={update('description')} rows={3} />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Channel</span>
              <select value={form.channel} onChange={update('channel')}>
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={update('status')}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Start date</span>
              <input type="date" value={form.startDate} onChange={update('startDate')} />
            </label>
            <label className="field">
              <span>End date</span>
              <input type="date" value={form.endDate} onChange={update('endDate')} />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Targeted population</span>
              <input type="number" min="0" value={form.targetedPopulation} onChange={update('targetedPopulation')} />
            </label>
            <label className="field">
              <span>Accepted / fulfilled</span>
              <input type="number" min="0" value={form.accepted} onChange={update('accepted')} />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Declined</span>
              <input type="number" min="0" value={form.declined} onChange={update('declined')} />
            </label>
            <label className="field">
              <span>Clicked but unfinished</span>
              <input type="number" min="0" value={form.clickedUnfinished} onChange={update('clickedUnfinished')} />
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/campaigns')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
