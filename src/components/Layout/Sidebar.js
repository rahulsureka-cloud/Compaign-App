import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import '../../styles/layout.css';

const NAV = [
  {
    title: 'Marketing',
    items: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/campaigns/new', label: 'Create campaign' },
      { to: '/templates', label: 'Templates' },
      { to: '/campaigns', label: 'Campaigns', end: true },
      { to: '/user-segment', label: 'User segment' },
    ],
  },
  {
    title: 'Administration',
    adminOnly: true,
    items: [
      { to: '/approvals', label: 'Approvals' },
    ],
  },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input type="text" placeholder="Search navigation" aria-label="Search navigation" />
      </div>
      <nav className="sidebar-nav">
        {NAV.filter((group) => !group.adminOnly || isAdmin).map((group) => (
          <React.Fragment key={group.title}>
            <div className="sidebar-group-title">{group.title}</div>
            <ul>
              {group.items.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                    end={link.end}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
}
