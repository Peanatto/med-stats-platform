import React from "react";
import './DashboardSidebar.css';

const DashboardSidebar = ({ user, activeTab, onTabChange }) => {

    // Privacy-Friendly Avatar Generator
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    // Nav Items Array
    const navItems = [
        { id: 'profile', label: 'Account Settings', icon: '⚙️' }, 
        { id: 'listings', label: 'My Listings', icon: '📋' }, 
        { id: 'bookings', label: 'My Bookings', icon: '📅' }
    ];

    return (
        <aside className="dashboard-sidebar">

            {/* User Identity Card */}
            <div className="sidebar-user-card">
                <div className="user-avatar">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.profile?.displayName || 'User Avatar'} />
                    ) : (
                        <span className = "avatar-initials">{getInitials(user.profile?.displayName)}</span>
                    )}
                </div>
                <div className="user-info">
                    <h3 className="user-display-name">{user.profile?.displayName || 'Anonymous User'}</h3>
                    <span className="user-major">• {user.profile?.undergradMajor || 'Pre-Med'}</span>
                </div>
            </div>

            <hr className="sidebar-divider" />

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                <span className="nav-header">DASHBOARD MENU</span>
                <ul className="nav-list">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <li key={item.id}>
                                <button 
                                    className={`nav-btn ${isActive ? 'active': ''}`}
                                    onClick={() => onTabChange(item.id)}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                    {isActive && <span className="active-indicator"></span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Privacy/Trust Footer */}
            <div className="sidebar-footer">
                <div className="privacy-badge">
                    Anonymity Protected
                </div>
                <p className="privacy-subtext">
                    Your real identity is hidden from the public marketplace.
                </p>
            </div>

        </aside>
    );

};

export default DashboardSidebar;