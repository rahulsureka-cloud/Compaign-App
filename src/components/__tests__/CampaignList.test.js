import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CampaignList from '../Campaigns/CampaignList';
import { campaignApi } from '../../services/api';

jest.mock('../../services/api');

const campaigns = [
  { id: 'a', name: 'Alpha', channels: ['Email'], status: 'Active', startDate: '2026-06-01', endDate: '2026-08-31' },
  { id: 'b', name: 'Beta', channels: ['SMS'], status: 'Draft', startDate: '2026-07-01', endDate: '2026-09-01' },
  { id: 'p', name: 'PendingOne', channels: ['In-app'], status: 'Under approval', startDate: '2026-08-01', endDate: '2026-10-01' },
];

beforeEach(() => {
  campaignApi.getAll.mockResolvedValue(campaigns);
  campaignApi.approve.mockResolvedValue({});
  campaignApi.reject.mockResolvedValue({});
  campaignApi.clone.mockResolvedValue({});
});

test('shows campaigns awaiting approval with Approve/Reject', async () => {
  render(<MemoryRouter><CampaignList /></MemoryRouter>);
  expect(await screen.findByText('Awaiting your approval')).toBeInTheDocument();
  expect(screen.getByText('PendingOne')).toBeInTheDocument();
  expect(screen.getByText('Approve')).toBeInTheDocument();
  expect(screen.getByText('Reject')).toBeInTheDocument();
});

test('approves a pending campaign after confirming in the dialog', async () => {
  render(<MemoryRouter><CampaignList /></MemoryRouter>);
  await screen.findByText('PendingOne');

  await userEvent.click(screen.getByText('Approve'));
  // Confirmation dialog appears; API not called until confirmed.
  expect(screen.getByText('Approve campaign?')).toBeInTheDocument();
  expect(campaignApi.approve).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
  await waitFor(() => expect(campaignApi.approve).toHaveBeenCalledWith('p'));
});

test('cancelling the confirmation does not approve', async () => {
  render(<MemoryRouter><CampaignList /></MemoryRouter>);
  await screen.findByText('PendingOne');

  await userEvent.click(screen.getByText('Approve'));
  await userEvent.click(screen.getByRole('button', { name: 'No' }));

  expect(screen.queryByText('Approve campaign?')).not.toBeInTheDocument();
  expect(campaignApi.approve).not.toHaveBeenCalled();
});

test('default Active tab shows only active campaigns; switching tab filters', async () => {
  render(<MemoryRouter><CampaignList /></MemoryRouter>);
  await screen.findByText('Awaiting your approval');

  // Active tab is default → Alpha visible in the campaigns table, Beta (Draft) not.
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  expect(screen.queryByText('Beta')).not.toBeInTheDocument();

  // Switch to Draft tab.
  await userEvent.click(screen.getByRole('button', { name: 'Draft' }));
  expect(screen.getByText('Beta')).toBeInTheDocument();
});

test('clones a campaign', async () => {
  render(<MemoryRouter><CampaignList /></MemoryRouter>);
  await screen.findByText('Alpha');
  await userEvent.click(screen.getByRole('button', { name: 'Clone' }));
  await waitFor(() => expect(campaignApi.clone).toHaveBeenCalledWith('a'));
});
