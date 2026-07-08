// Central API client. All network access goes through here (see CLAUDE.md §7).
// Reads fall back to bundled dummy data (src/data/*.json) when the backend
// isn't running, so the UI still renders during development/demos.

import campaignsSeed from '../data/campaigns.json';
import segmentsSeed from '../data/segments.json';

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
  async getAll() {
    try {
      return await request('/campaigns');
    } catch {
      return campaignsSeed;
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
    return request('/campaigns', { method: 'POST', body: JSON.stringify(campaign) });
  },
  update(id, campaign) {
    return request(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(campaign) });
  },
  remove(id) {
    return request(`/campaigns/${id}`, { method: 'DELETE' });
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
    return request('/segments', { method: 'POST', body: JSON.stringify(segment) });
  },
  update(id, segment) {
    return request(`/segments/${id}`, { method: 'PUT', body: JSON.stringify(segment) });
  },
  remove(id) {
    return request(`/segments/${id}`, { method: 'DELETE' });
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
