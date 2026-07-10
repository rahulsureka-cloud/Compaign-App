import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AuditTrail from '../AuditTrail/AuditTrail';
import { AuthProvider } from '../../services/auth';
import { logAudit } from '../../services/audit';

const ADMIN = { username: 'admin', name: 'Administrator', role: 'admin' };
const CREATOR = { username: 'creator', name: 'Campaign Creator', role: 'creator' };

const renderAudit = (user) =>
  render(
    <AuthProvider initialUser={user}>
      <MemoryRouter><AuditTrail /></MemoryRouter>
    </AuthProvider>
  );

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test('an Administrator sees recorded activity in the table', () => {
  logAudit('Approve campaign', 'Premium Savings', ADMIN);
  renderAudit(ADMIN);
  expect(screen.getByText('Audit Trail')).toBeInTheDocument();
  expect(screen.getByText('Approve campaign')).toBeInTheDocument();
  expect(screen.getByText('Premium Savings')).toBeInTheDocument();
  // Role rendered as a friendly label.
  expect(screen.getAllByText('Administrator').length).toBeGreaterThan(0);
});

test('seeds sample activity when empty so the screen is not blank', () => {
  renderAudit(ADMIN);
  // Seeded entries include a Create campaign action.
  expect(screen.getByText('Create campaign')).toBeInTheDocument();
});

test('a Campaign Creator is redirected away (GR-006)', () => {
  renderAudit(CREATOR);
  expect(screen.queryByText('Audit Trail')).not.toBeInTheDocument();
});

test('clicking a column header sorts the rows', async () => {
  // Two entries with actions that sort A→Z as Approve, Create.
  logAudit('Create campaign', 'Zeta', ADMIN);
  logAudit('Approve campaign', 'Alpha', ADMIN);
  renderAudit(ADMIN);

  const firstAction = () => {
    const rows = screen.getAllByRole('row'); // rows[0] is the header row
    return within(rows[1]).getByText(/campaign$/i).textContent;
  };

  // Sort ascending by Action → "Approve campaign" first.
  await userEvent.click(screen.getByRole('button', { name: /^Action/ }));
  expect(firstAction()).toBe('Approve campaign');

  // Click again → descending → "Create campaign" first.
  await userEvent.click(screen.getByRole('button', { name: /^Action/ }));
  expect(firstAction()).toBe('Create campaign');
});

test('after Clear log, Refresh does not bring the logs back', async () => {
  window.confirm = jest.fn(() => true);
  renderAudit(ADMIN); // seeds sample data
  expect(screen.getByText('Create campaign')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Clear log' }));
  expect(screen.getByText('No activity recorded yet.')).toBeInTheDocument();

  // Refresh must NOT re-seed the sample entries.
  await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  expect(screen.getByText('No activity recorded yet.')).toBeInTheDocument();
  expect(screen.queryByText('Create campaign')).not.toBeInTheDocument();
});
