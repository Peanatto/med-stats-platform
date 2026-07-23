import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Search from './pages/Search/Search';
import ListingDetail from './pages/ListingDetail/ListingDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

const AppRoutes = () => {

  const { user } = useAuth();
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="app-wrapper" style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* Landing: If logged in -> Explore, if NOT logged in -> go to Login */}
        <Route 
          path="/"
          element={user ? <Navigate to="/explore" replace /> : <Navigate to="/login" replace />}
        />

        {/* If logged in, don't visit these pages */}
        <Route 
          path="/login"
          element={user ? <Navigate to="/explore" replace /> : <Login />}
        />

        <Route 
          path="/register"
          element={user ? <Navigate to="/explore" replace /> : <Register />}
        />

        {/* Marketplace Routes */}
        <Route path="/explore" element={<Search />} />
        <Route path="/listings/:id" element={<ListingDetail />} />

        {/* Dashboard: Only accessible if logged-in */}
        <Route 
          path="/dashboard/:id"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* 404 Route */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </div>
  );

};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;