import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CampaignWizard from '../Campaigns/CampaignWizard';
import { campaignApi, segmentApi } from '../../services/api';

jest.mock('../../services/api');

beforeEach(() => {
  segmentApi.getAll.mockResolvedValue([]);
  segmentApi.create.mockResolvedValue({ id: 'seg-new' });
  campaignApi.getAll.mockResolvedValue([]);
  campaignApi.create.mockResolvedValue({ id: 'new' });
});

// Fills the required Setup fields (name + valid dates). Channel "In-app" is on by default.
function fillSetup() {
  fireEvent.change(screen.getByPlaceholderText('Campaign name'), { target: { value: 'My Campaign' } });
  fireEvent.change(screen.getByPlaceholderText('Start date'), { target: { value: '2026-07-01' } });
  fireEvent.change(screen.getByPlaceholderText('End date'), { target: { value: '2026-08-01' } });
}

test('starts on Setup step showing channel options', () => {
  render(<MemoryRouter><CampaignWizard /></MemoryRouter>);
  expect(screen.getByText('Campaign details')).toBeInTheDocument();
  expect(screen.getByText('In-app')).toBeInTheDocument();
});

test('Next is disabled until required Setup fields are valid (GR-004)', () => {
  render(<MemoryRouter><CampaignWizard /></MemoryRouter>);
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  fillSetup();
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Next stays disabled when end date is before start date (GR-004/GR-001)', () => {
  render(<MemoryRouter><CampaignWizard /></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText('Campaign name'), { target: { value: 'X' } });
  fireEvent.change(screen.getByPlaceholderText('Start date'), { target: { value: '2026-08-01' } });
  fireEvent.change(screen.getByPlaceholderText('End date'), { target: { value: '2026-07-01' } });
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
});

test('walks through all steps (no Content step) and sends for approval', async () => {
  render(<MemoryRouter><CampaignWizard /></MemoryRouter>);

  fillSetup();
  await userEvent.click(screen.getByRole('button', { name: 'Next' })); // -> Segment
  expect(screen.getByText('Audience summary')).toBeInTheDocument();
  expect(screen.queryByText('Marketing assets')).not.toBeInTheDocument(); // Content step gone

  await userEvent.click(screen.getByRole('button', { name: 'Next' })); // -> Location
  expect(screen.getByRole('heading', { name: 'Location' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Next' })); // -> Review
  expect(screen.getByText('Campaign summary')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Send for approval' }));
  expect(campaignApi.create).toHaveBeenCalledTimes(1);
  expect(campaignApi.create.mock.calls[0][0].status).toBe('Under approval');
});

test('prefills the Setup step from a template passed via router state', () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/campaigns/new', state: { template: { name: 'Tpl Camp', channels: ['Email'] } } }]}>
      <CampaignWizard />
    </MemoryRouter>
  );
  expect(screen.getByText('Campaign details')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Tpl Camp')).toBeInTheDocument();
});

test('creates a new segment from inside the wizard and auto-selects it', async () => {
  segmentApi.create.mockResolvedValue({
    id: 'seg-new',
    name: 'Wizard Seg',
    description: '',
    matchLogic: 'AND',
    rules: [],
    estimatedReach: 45000,
  });

  render(<MemoryRouter><CampaignWizard /></MemoryRouter>);

  fillSetup();
  await userEvent.click(screen.getByRole('button', { name: 'Next' })); // -> Segment
  expect(screen.getByText('Audience summary')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: '⊕ Create new segment' }));
  fireEvent.change(screen.getByPlaceholderText('User segment name'), { target: { value: 'Wizard Seg' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. 25'), { target: { value: '25' } });

  await userEvent.click(screen.getByRole('button', { name: 'Save segment' }));

  expect(segmentApi.create).toHaveBeenCalledTimes(1);
  expect(await screen.findByText('Wizard Seg')).toBeInTheDocument();
});
