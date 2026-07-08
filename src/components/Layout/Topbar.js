import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/layout.css';

const titles = {
  '/dashboard': 'Campaign & Promotion Dashboard',
  '/campaigns': 'Campaigns',
  '/campaigns/new': 'Create campaign',
  '/user-segment': 'User segment',
  '/user-segment/new': 'Add user segment',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const crumb = titles[pathname] || 'Marketing';

  return (
    <header className="topbar">
      <div className="topbar-breadcrumb">
        Marketing <span className="crumb-sep">›</span> {crumb}
      </div>
      <h1 className="topbar-title">🏬 Marketing</h1>
    </header>
  );
}
