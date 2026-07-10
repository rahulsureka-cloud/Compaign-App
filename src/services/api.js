// Central API client. All network access goes through here (see CLAUDE.md §7).
// Reads fall back to bundled dummy data (src/data/*.json) when the backend
// isn't running, so the UI still renders during development/demos.

import campaignsSeed from '../data/campaigns.json';
import segmentsSeed from '../data/segments.json';
import { logAudit } from './audit';

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${options.method || 'GET'} ${path} failed: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

/* ----------------------------- Campaigns ----------------------------- */

export const campaignApi = {
  async getAll(status) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    try {
      return await request(`/campaigns${qs}`);
    } catch {
      return status
        ? campaignsSeed.filter((c) => c.status === status)
        : campaignsSeed;
    }
  },
  async getDashboard() {
    try {
      return await request('/campaigns/dashboard');
    } catch {
      return buildDashboardFromSeed();
    }
  },
  create(campaign) {
    return request('/campaigns', { method: 'POST', body: JSON.stringify(campaign) })
      .then((r) => { logAudit('Create campaign', campaign?.name || ''); return r; });
  },
  update(id, campaign) {
    return request(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(campaign) })
      .then((r) => { logAudit('Update campaign', campaign?.name || `#${id}`); return r; });
  },
  remove(id) {
    return request(`/campaigns/${id}`, { method: 'DELETE' })
      .then((r) => { logAudit('Delete campaign', `#${id}`); return r; });
  },
  approve(id) {
    return request(`/campaigns/${id}/approve`, { method: 'POST' })
      .then((r) => { logAudit('Approve campaign', r?.name || `#${id}`); return r; });
  },
  reject(id) {
    return request(`/campaigns/${id}/reject`, { method: 'POST' })
      .then((r) => { logAudit('Reject campaign', r?.name || `#${id}`); return r; });
  },
  clone(id) {
    return request(`/campaigns/${id}/clone`, { method: 'POST' })
      .then((r) => { logAudit('Clone campaign', r?.name || `#${id}`); return r; });
  },
};

/* ----------------------------- Segments ------------------------------ */

export const segmentApi = {
  async getAll() {
    try {
      return await request('/segments');
    } catch {
      return segmentsSeed;
    }
  },
  create(segment) {
    return request('/segments', { method: 'POST', body: JSON.stringify(segment) })
      .then((r) => { logAudit('Create segment', segment?.name || ''); return r; });
  },
  update(id, segment) {
    return request(`/segments/${id}`, { method: 'PUT', body: JSON.stringify(segment) })
      .then((r) => { logAudit('Update segment', segment?.name || `#${id}`); return r; });
  },
  remove(id) {
    return request(`/segments/${id}`, { method: 'DELETE' })
      .then((r) => { logAudit('Delete segment', `#${id}`); return r; });
  },
};

/* --------------------------- Fallback helper -------------------------- */

export function buildDashboardFromSeed() {
  const sum = (key) => campaignsSeed.reduce((acc, c) => acc + (c[key] || 0), 0);
  return {
    totalCampaigns: campaignsSeed.length,
    activeCampaigns: campaignsSeed.filter((c) => c.status === 'Active').length,
    totalTargetedPopulation: sum('targetedPopulation'),
    totalAccepted: sum('accepted'),
    totalDeclined: sum('declined'),
    totalClickedUnfinished: sum('clickedUnfinished'),
    campaigns: campaignsSeed.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      targetedPopulation: c.targetedPopulation,
      accepted: c.accepted,
      declined: c.declined,
      clickedUnfinished: c.clickedUnfinished,
    })),
  };
}
