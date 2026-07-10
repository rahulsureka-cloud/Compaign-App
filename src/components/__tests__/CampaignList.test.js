import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CampaignList from '../Campaigns/CampaignList';
import { campaignApi } from '../../services/api';
import { AuthProvider } from '../../services/auth';

jest.mock('../../services/api');

const ADMIN = { username: 'admin', name: 'Administrator', role: 'admin' };

const renderList = (user = ADMIN) =>
  render(
    <AuthProvider initialUser={user}>
      <MemoryRouter><CampaignList /></MemoryRouter>
    </AuthProvider>
  );

const campaigns = [
  { id: 'a', name: 'Alpha', channels: ['Email'], status: 'Active', startDate: '2026-06-01', endDate: '2026-08-31' },
  { id: 'b', name: 'Beta', channels: ['SMS'], status: 'Draft', startDate: '2026-07-01', endDate: '2026-09-01' },
  { id: 'p', name: 'PendingOne', channels: ['In-app'], status: 'Under approval', startDate: '2026-08-01', endDate: '2026-10-01' },
];

beforeEach(() => {
  campaignApi.getAll.mockResolvedValue(campaigns);
  campaignApi.clone.mockResolvedValue({});
});

test('default Active tab shows only active campaigns; switching tab filters', async () => {
  renderList();
  // Active tab is default → Alpha visible in the campaigns table, Beta (Draft) not.
  expect(await screen.findByText('Alpha')).toBeInTheDocument();
  expect(screen.queryByText('Beta')).not.toBeInTheDocument();

  // Switch to Draft tab.
  await userEvent.click(screen.getByRole('button', { name: 'Draft' }));
  expect(screen.getByText('Beta')).toBeInTheDocument();
});

test('clones a campaign', async () => {
  renderList();
  await screen.findByText('Alpha');
  await userEvent.click(screen.getByRole('button', { name: 'Clone' }));
  await waitFor(() => expect(campaignApi.clone).toHaveBeenCalledWith('a'));
});
