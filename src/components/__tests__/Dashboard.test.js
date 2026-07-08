import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import { campaignApi } from '../../services/api';

jest.mock('../../services/api');

const summary = {
  totalCampaigns: 2,
  activeCampaigns: 1,
  totalTargetedPopulation: 22300,
  totalAccepted: 6800,
  totalDeclined: 7200,
  totalClickedUnfinished: 3300,
  campaigns: [
    { id: 'a', name: 'Alpha', status: 'Active', targetedPopulation: 12500, accepted: 4200, declined: 3100, clickedUnfinished: 1800 },
    { id: 'b', name: 'Beta', status: 'Draft', targetedPopulation: 9800, accepted: 2600, declined: 4100, clickedUnfinished: 1500 },
  ],
};

test('renders total targeted population and decision totals', async () => {
  campaignApi.getDashboard.mockResolvedValue(summary);

  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

  expect(await screen.findByText('22,300')).toBeInTheDocument(); // total targeted population
  expect(screen.getByText('Total Targeted Population')).toBeInTheDocument();
  expect(screen.getByText('Accepted / Fulfilled')).toBeInTheDocument();
  // "Declined" appears both as a stat-card label and in the chart legend.
  expect(screen.getAllByText('Declined').length).toBeGreaterThan(0);
  expect(screen.getByText('Clicked but Unfinished')).toBeInTheDocument();
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  expect(screen.getByText('Beta')).toBeInTheDocument();
});
