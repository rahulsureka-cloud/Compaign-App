import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AddUserSegment from '../UserSegment/AddUserSegment';
import { segmentApi } from '../../services/api';

jest.mock('../../services/api');

test('adds and removes segment criteria rules', async () => {
  render(<MemoryRouter><AddUserSegment /></MemoryRouter>);

  // Starts with one rule.
  expect(screen.getByText('Rule 1')).toBeInTheDocument();
  expect(screen.queryByText('Rule 2')).not.toBeInTheDocument();

  await userEvent.click(screen.getByText(/Add rule/i));
  expect(screen.getByText('Rule 2')).toBeInTheDocument();

  await userEvent.click(screen.getByLabelText('Delete rule 2'));
  expect(screen.queryByText('Rule 2')).not.toBeInTheDocument();
});

test('validates required name before saving', async () => {
  render(<MemoryRouter><AddUserSegment /></MemoryRouter>);

  // Fill the rule value but leave the name empty.
  await userEvent.type(screen.getByPlaceholderText('e.g. 25'), '30');
  await userEvent.click(screen.getByRole('button', { name: 'Import' }));

  expect(await screen.findByText('User segment name is required.')).toBeInTheDocument();
  expect(segmentApi.create).not.toHaveBeenCalled();
});

test('creates a segment when valid', async () => {
  segmentApi.create.mockResolvedValue({ id: 'new' });
  render(<MemoryRouter><AddUserSegment /></MemoryRouter>);

  await userEvent.type(screen.getByPlaceholderText('User segment name'), 'My Segment');
  await userEvent.type(screen.getByPlaceholderText('e.g. 25'), '30');
  await userEvent.click(screen.getByRole('button', { name: 'Add new' }));

  expect(segmentApi.create).toHaveBeenCalledTimes(1);
});
