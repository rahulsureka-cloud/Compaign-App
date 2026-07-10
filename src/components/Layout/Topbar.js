import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/layout.css';

const titles = {
  '/dashboard': 'Campaign & Promotion Dashboard',
  '/campaigns': 'Campaigns',
  '/campaigns/new': 'Create campaign',
  '/templates': 'Templates',
  '/approvals': 'Approvals',
  '/user-segment': 'User segment',
  '/user-segment/new': 'Add user segment',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const crumb = titles[pathname] || 'Marketing';

  return (
    <header className="topbar">
      <div className="topbar-crumbs">
        <span className="tb-icon" aria-hidden="true">▢</span>
        <span className="tb-icon" aria-hidden="true">🏠</span>
        <span className="topbar-breadcrumb">
          Marketing <span className="crumb-sep">›</span> {crumb}
        </span>
      </div>
      <h1 className="topbar-title">🏬 Marketing</h1>
    </header>
  );
}
