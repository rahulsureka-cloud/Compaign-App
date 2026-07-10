import React from 'react';
import { render, screen } from '@testing-library/react';
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
