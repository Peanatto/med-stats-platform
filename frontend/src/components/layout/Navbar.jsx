import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Extract initial for avatar fallback if displayName exists
  const initial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'M';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="global-navbar">
      <div className="navbar-container">
        
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🩺</span>
          <span className="brand-name">Med<span className="brand-highlight">Mentor</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="navbar-links">
          <NavLink 
            to="/explore" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end
          >
            🔍 Explore Mentors
          </NavLink>

          {user && (
            <NavLink 
              to="/dashboard/:id" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              📊 My Dashboard
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              {/* User Profile Badge (Links directly to Dashboard) */}
              <Link to="/dashboard/:id" className="navbar-user-widget" title="Go to Account Settings">
                <div className="user-avatar">{initial}</div>
                <span className="user-display-name">{user?.displayName || 'My Account'}</span>
                <span className="status-dot"></span>
              </Link>

              {/* Log Out Button */}
              <button onClick={handleLogout} className="btn-logout">
                Log Out
              </button>
            </>
          ) : (
            /* Guest Fallback Sign-In Button */
            <Link to="/login" className="btn-signin">
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;