import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/layout.css';

const marketingLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/campaigns/new', label: 'Create campaign' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/user-segment', label: 'User segment' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input type="text" placeholder="Search navigation" aria-label="Search navigation" />
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-group-title">Marketing</div>
        <ul>
          {marketingLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                end={link.to === '/campaigns'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
