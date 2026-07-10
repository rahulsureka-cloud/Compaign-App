import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Approvals from '../Approvals/Approvals';
import { campaignApi } from '../../services/api';
import { AuthProvider } from '../../services/auth';

jest.mock('../../services/api');

const ADMIN = { username: 'admin', name: 'Administrator', role: 'admin' };
const CREATOR = { username: 'creator', name: 'Campaign Creator', role: 'creator' };

const renderApprovals = (user = ADMIN) =>
  render(
    <AuthProvider initialUser={user}>
      <MemoryRouter><Approvals /></MemoryRouter>
    </AuthProvider>
  );

const campaigns = [
  { id: 'a', name: 'Alpha', channels: ['Email'], status: 'Active', startDate: '2026-06-01', endDate: '2026-08-31' },
  { id: 'b', name: 'Beta', channels: ['SMS'], status: 'Draft', startDate: '2026-07-01', endDate: '2026-09-01' },
  { id: 'p', name: 'PendingOne', channels: ['In-app'], status: 'Under approval', startDate: '2026-08-01', endDate: '2026-10-01' },
];

beforeEach(() => {
  campaignApi.getAll.mockResolvedValue(campaigns);
  campaignApi.approve.mockResolvedValue({});
  campaignApi.reject.mockResolvedValue({});
});

test('admin sees the approval queue and can approve after confirming', async () => {
  renderApprovals();
  expect(await screen.findByText('Awaiting your approval')).toBeInTheDocument();
  expect(screen.getByText('PendingOne')).toBeInTheDocument();
  expect(screen.getByText('Approve')).toBeInTheDocument();
  expect(screen.getByText('Reject')).toBeInTheDocument();

  await userEvent.click(screen.getByText('Approve'));
  // Confirmation dialog appears; API not called until confirmed.
  expect(screen.getByText('Approve campaign?')).toBeInTheDocument();
  expect(campaignApi.approve).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
  await waitFor(() => expect(campaignApi.approve).toHaveBeenCalledWith('p'));
});

test('a Campaign Creator is redirected away — no approval queue (GR-006)', async () => {
  renderApprovals(CREATOR);
  expect(screen.queryByText('Awaiting your approval')).not.toBeInTheDocument();
});
