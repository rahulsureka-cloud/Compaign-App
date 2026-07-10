import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Login from '../Login/Login';
import { AuthProvider, useAuth } from '../../services/auth';

// A tiny probe that reveals the authenticated user so we can assert on login.
function AuthProbe() {
  const { user } = useAuth();
  return <div data-testid="who">{user ? `${user.name}:${user.role}` : 'anon'}</div>;
}

// Reveals the current route so we can assert the post-login redirect.
function LocationProbe() {
  return <div data-testid="path">{useLocation().pathname}</div>;
}

const renderLogin = () =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/campaigns/new']}>
        <Login />
        <AuthProbe />
        <LocationProbe />
      </MemoryRouter>
    </AuthProvider>
  );

beforeEach(() => sessionStorage.clear());

test('renders the brand summary and the sign-in form', () => {
  renderLogin();
  expect(screen.getByText('Welcome back')).toBeInTheDocument();
  expect(screen.getByText('Sign in to manage marketing campaigns')).toBeInTheDocument();
  // Left-side summary is present.
  expect(screen.getByText(/Plan, launch/i)).toBeInTheDocument();
  // Exactly the two demo roles.
  expect(screen.getByText('Administrator')).toBeInTheDocument();
  expect(screen.getByText('Campaign Creator')).toBeInTheDocument();
});

test('shows an error on invalid credentials and does not authenticate', async () => {
  renderLogin();
  // The username field is the only text input on the form.
  await userEvent.type(screen.getByRole('textbox'), 'nope');
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
  expect(screen.getByTestId('who')).toHaveTextContent('anon');
});

test('clicking a demo account fills the form and signs in as that role', async () => {
  renderLogin();
  // Click the Administrator demo account to auto-fill credentials.
  await userEvent.click(screen.getByText('Administrator'));
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(screen.getByTestId('who')).toHaveTextContent('Administrator:admin');
});

test('lands on the dashboard after signing in, regardless of prior route', async () => {
  renderLogin(); // starts at /campaigns/new
  expect(screen.getByTestId('path')).toHaveTextContent('/campaigns/new');
  await userEvent.click(screen.getByText('Campaign Creator'));
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(screen.getByTestId('path')).toHaveTextContent('/dashboard');
});

test('Show/Hide toggles password visibility', async () => {
  const { container } = renderLogin();
  const pwd = container.querySelector('input[type="password"]');
  expect(pwd).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Show' }));
  expect(container.querySelector('input[type="text"][autocomplete="current-password"]')).toBeInTheDocument();
});
