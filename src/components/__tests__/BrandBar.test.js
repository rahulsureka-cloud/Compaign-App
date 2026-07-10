import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import BrandBar from '../Layout/BrandBar';
import { AuthProvider, useAuth } from '../../services/auth';

function AuthProbe() {
  const { user } = useAuth();
  return <div data-testid="who">{user ? user.role : 'anon'}</div>;
}
function PathProbe() {
  return <div data-testid="path">{useLocation().pathname}</div>;
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test('signing out clears the session and resets the URL to /', async () => {
  render(
    <AuthProvider initialUser={{ username: 'admin', name: 'Administrator', role: 'admin' }}>
      <MemoryRouter initialEntries={['/audit-trail']}>
        <BrandBar />
        <AuthProbe />
        <PathProbe />
      </MemoryRouter>
    </AuthProvider>
  );

  // Starts signed in, on the audit-trail route.
  expect(screen.getByTestId('path')).toHaveTextContent('/audit-trail');
  expect(screen.getByTestId('who')).toHaveTextContent('admin');

  await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));

  // Session cleared and URL reset so the login page no longer shows /audit-trail.
  expect(screen.getByTestId('who')).toHaveTextContent('anon');
  expect(screen.getByTestId('path')).toHaveTextContent('/');
});
