import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { mockUser } from './data/mockUser';
import ServiceCard from './components/stats/ServiceCard';
import Search from './pages/Search/Search';
import ListingDetail from './pages/ListingDetail/ListingDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <Router>
      <div className="app-wrapper" style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>

        <Navbar user={mockUser} />

        <Routes>
          {/* Default Route: redirect root "/" to "/explore" */}
          <Route path="/" element={<Navigate to ="/explore" replace />} />

          {/* Marketplace Explore Page */}
          <Route path="/explore" element={<Search />} />

          {/* Dynamic Detail Page */}
          <Route path="/listings/:id" element={<ListingDetail />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 404 Route */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;