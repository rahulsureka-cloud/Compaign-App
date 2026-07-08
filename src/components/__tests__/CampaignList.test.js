import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CampaignList from '../Campaigns/CampaignList';
import { campaignApi } from '../../services/api';

jest.mock('../../services/api');

const campaigns = [
  { id: 'a', name: 'Alpha', description: 'desc a', channel: 'Email', status: 'Active', startDate: '2026-06-01', endDate: '2026-08-31', targetedPopulation: 12500 },
  { id: 'b', name: 'Beta', description: 'desc b', channel: 'SMS', status: 'Draft', startDate: '2026-07-01', endDate: '2026-09-01', targetedPopulation: 9800 },
];

beforeEach(() => {
  campaignApi.getAll.mockResolvedValue(campaigns);
  campaignApi.remove.mockResolvedValue(null);
});

test('lists campaigns from the API', async () => {
  render(<MemoryRouter><CampaignList /></MemoryRouter>);
  expect(await screen.findByText('Alpha')).toBeInTheDocument();
  expect(screen.getByText('Beta')).toBeInTheDocument();
});

test('deletes a campaign after confirmation', async () => {
  window.confirm = jest.fn(() => true);
  render(<MemoryRouter><CampaignList /></MemoryRouter>);

  await screen.findByText('Alpha');
  await userEvent.click(screen.getByLabelText('Delete Alpha'));

  await waitFor(() => expect(campaignApi.remove).toHaveBeenCalledWith('a'));
  await waitFor(() => expect(screen.queryByText('Alpha')).not.toBeInTheDocument());
  expect(screen.getByText('Beta')).toBeInTheDocument();
});
