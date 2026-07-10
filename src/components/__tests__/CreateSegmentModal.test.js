import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateSegmentModal from '../UserSegment/CreateSegmentModal';
import { segmentApi } from '../../services/api';

jest.mock('../../services/api');

test('shows validation and does not create when name is empty', async () => {
  render(<CreateSegmentModal baseSegments={[]} onCreated={jest.fn()} onClose={jest.fn()} />);
  await userEvent.type(screen.getByPlaceholderText('e.g. 25'), '30');
  await userEvent.click(screen.getByRole('button', { name: 'Save segment' }));
  expect(screen.getByText('User segment name is required.')).toBeInTheDocument();
  expect(segmentApi.create).not.toHaveBeenCalled();
});

test('creates a segment and returns it via onCreated', async () => {
  const created = { id: 'new-seg', name: 'My Seg', estimatedReach: 45000 };
  segmentApi.create.mockResolvedValue(created);
  const onCreated = jest.fn();
  render(<CreateSegmentModal baseSegments={[]} onCreated={onCreated} onClose={jest.fn()} />);
  await userEvent.type(screen.getByPlaceholderText('User segment name'), 'My Seg');
  await userEvent.type(screen.getByPlaceholderText('e.g. 25'), '30');
  await userEvent.click(screen.getByRole('button', { name: 'Save segment' }));
  await waitFor(() => expect(segmentApi.create).toHaveBeenCalledTimes(1));
  expect(onCreated).toHaveBeenCalledWith(created);
});
