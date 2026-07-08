import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Dashboard from './components/Dashboard/Dashboard';
import CampaignList from './components/Campaigns/CampaignList';
import CampaignForm from './components/Campaigns/CampaignForm';
import UserSegmentList from './components/UserSegment/UserSegmentList';
import AddUserSegment from './components/UserSegment/AddUserSegment';
import './styles/layout.css';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/campaigns/new" element={<CampaignForm />} />
            <Route path="/campaigns/:id/edit" element={<CampaignForm />} />
            <Route path="/user-segment" element={<UserSegmentList />} />
            <Route path="/user-segment/new" element={<AddUserSegment />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
