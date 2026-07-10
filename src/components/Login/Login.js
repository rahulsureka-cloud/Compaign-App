import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../../services/auth';
import '../../styles/login.css';

// Left-panel feature bullets — a quick summary of what the app does so a
// first-time user understands it before signing in.
const FEATURES = [
  {
    title: 'Guided campaign wizard',
    text: 'Setup → Segment → Location → Review, with a built-in approval workflow.',
  },
  {
    title: 'User segments',
    text: 'Build audiences from rules like Age > 25 AND State is CA.',
  },
  {
    title: 'Performance dashboard',
    text: 'Track targeted population, accepted, declined & clicked.',
  },
];

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (!result.ok) setError(result.error);
  };

  const fillDemo = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  return (
    <div className="login-shell">
      {/* LEFT: what the application is about */}
      <section className="login-brand">
        <div className="brand-logo">🏬 Marketing <span className="brand-dot">•</span> Campaign Manager</div>
        <h2 className="brand-headline">Plan, launch &amp; measure<br />your marketing campaigns.</h2>
        <p className="brand-sub">
          A single admin tool for the Marketing team — build campaigns with a guided
          wizard, target the right audience, and track how every promotion is performing.
        </p>
        <ul className="brand-list">
          {FEATURES.map((f) => (
            <li key={f.title}>
              <span className="brand-tick">✓</span>
              <div>
                <strong>{f.title}</strong>
                <span>{f.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* RIGHT: sign-in */}
      <section className="login-form-side">
        <form className="login-card" onSubmit={submit}>
          <h1>Welcome back</h1>
          <p className="login-subtitle">Sign in to manage marketing campaigns</p>

          {error && <div className="error-banner">{error}</div>}

          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              autoFocus
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="show-toggle"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button type="submit" className="btn btn-primary btn-signin">Sign in</button>

          <div className="demo-divider">Demo accounts — click to fill</div>

          {DEMO_USERS.map((u) => (
            <button
              key={u.username}
              type="button"
              className="demo-account"
              onClick={() => fillDemo(u)}
            >
              <div>
                <div className="role-name">{u.name}</div>
                <div className="role-desc">{u.description}</div>
              </div>
              <div className="role-user">{u.username}</div>
            </button>
          ))}
        </form>
      </section>
    </div>
  );
}
