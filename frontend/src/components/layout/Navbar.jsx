import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
  // Extract initial for avatar fallback if displayName exists
  const initial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'M';

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

          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            📊 My Dashboard
          </NavLink>
        </nav>

        {/* User Profile Badge (Links directly to Dashboard) */}
        <Link to="/dashboard" className="navbar-user-widget" title="Go to Account Settings">
          <div className="user-avatar">{initial}</div>
          <span className="user-display-name">{user?.displayName || 'My Account'}</span>
          <span className="status-dot"></span>
        </Link>

      </div>
    </header>
  );
};

export default Navbar;