import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import BrandBar from './components/Layout/BrandBar';
import Dashboard from './components/Dashboard/Dashboard';
import CampaignList from './components/Campaigns/CampaignList';
import CampaignWizard from './components/Campaigns/CampaignWizard';
import TemplateList from './components/Templates/TemplateList';
import Approvals from './components/Approvals/Approvals';
import UserSegmentList from './components/UserSegment/UserSegmentList';
import AddUserSegment from './components/UserSegment/AddUserSegment';
import Login from './components/Login/Login';
import { useAuth } from './services/auth';
import './styles/layout.css';

export default function App() {
  const { isAuthenticated } = useAuth();

  // Until the user signs in, the whole app is gated behind the login page.
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app-root">
      <BrandBar />
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <Topbar />
          <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/campaigns/new" element={<CampaignWizard />} />
            <Route path="/campaigns/:id/edit" element={<CampaignWizard />} />
            <Route path="/templates" element={<TemplateList />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/user-segment" element={<UserSegmentList />} />
            <Route path="/user-segment/new" element={<AddUserSegment />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
