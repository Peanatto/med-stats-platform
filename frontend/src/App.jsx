import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ServiceCard from './components/stats/ServiceCard';
import Search from './pages/Search/Search';
import ListingDetail from './pages/ListingDetail/ListingDetail';

function App() {
  return (
    <Router>
      <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Routes>
          {/* Default Route: redirect root "/" to "/explore" */}
          <Route path="/" element={<Navigate to ="/explore" replace />} />

          {/* Marketplace Explore Page */}
          <Route path="/explore" element={<Search />} />

          {/* Dynamic Detail Page */}
          <Route path="/listings/:id" element={<ListingDetail />} />

          {/* 404 Route */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;