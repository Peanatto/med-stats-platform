import React, { useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import ProfileSettings from '../../components/dashboard/ProfileSettings';
import MyListings from '../../components/dashboard/MyListings';
import MyBookings from '../../components/dashboard/MyBookings';

import { mockUser } from '../../data/mockUser';
import { mockBookings as initialBookings } from '../../data/mockBookings';
import { mockProfiles as initialProfiles } from '../../data/mockProfiles';

import './Dashboard.css';

const Dashboard = () => {
    // Navigation State: Defaults to 'profile' tab
    const [activeTab, setActiveTab] = useState('profile');

    // Data State: Storing mock data in state
    const [user, setUser] = useState(mockUser);
    const [bookings, setBookings] = useState(initialBookings);
    const [listings, setListings] = useState(initialProfiles);

    // --- BUTTON HANDLERS (Simulating Database Updates) ---

    // Handler for Tab 1: Saving Profile Edits
    const handleUpdateProfile = (updatedUserData) => {
        setUser(updatedUserData);
        alert('✅ Profile updated successfully! (In-memory simulation)');
    };

    // Handler for Tab 3: Accepting/Declining Bookings (To be passed down later)
    const handleUpdateBookingStatus = (bookingId, newStatus) => {
        setBookings(prevBookings => 
            prevBookings.map(booking => 
                booking.id === bookingId ? { ...booking, status: newStatus } : booking
            )
        );
    };

    // Handler to Pause/Unhide a listing
    const handleToggleListingStatus = (listingId) => {
        setListings(prevListings => 
            prevListings.map(listing => {
                if (listing.id === listingId) {
                    const currentStatus = listing.status || 'Active';
                    const nextStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
                    return { ...listing, status: nextStatus };
                }
                return listing;
            })
        );
    };

    // Handler to mock-delete a listing
    const handleDeleteListing = (listingId) => {
        setListings(prevListings => prevListings.filter(item => item.id !== listingId));
    };

    // Dynamic Content Router: Renders the active component
    const renderTabContent = () => {
        switch (activeTab) {
            case 'listings':
                return (
                    <MyListings 
                        user={user}
                        allListings={listings}
                        onToggleStatus={handleToggleListingStatus}
                        onDelete={handleDeleteListing}
                    />
                );
            case 'bookings':
                return (
                    <MyBookings
                        user={user}
                        allBookings={bookings}
                        onUpdateStatus={handleUpdateBookingStatus}
                    />
                );
            case 'profile':
            default:
                return <ProfileSettings user={user} onSave={handleUpdateProfile} />;
        }
    };

    return (
        <div className="dashboard-page-container">
            <div className="dashboard-layout">
                
                {/* Left Column: Sticky Sidebar */}
                <div className="dashboard-sidebar-wrapper">
                    <DashboardSidebar 
                        user={user} 
                        activeTab={activeTab} 
                        onTabChange={setActiveTab} 
                    />
                </div>

                {/* Right Column: Dynamic Tab Content Area */}
                <main className="dashboard-content-area">
                    {renderTabContent()}
                </main>

            </div>
        </div>
    );
};

export default Dashboard;