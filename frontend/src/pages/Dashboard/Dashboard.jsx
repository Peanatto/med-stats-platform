import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import ProfileSettings from '../../components/dashboard/ProfileSettings';
import MyListings from '../../components/dashboard/MyListings';
import MyBookings from '../../components/dashboard/MyBookings';
import ListingFormModal from '../../components/modals/ListingFormModal';

import { mockBookings as initialBookings } from '../../data/mockBookings';
import { mockProfiles as initialProfiles } from '../../data/mockProfiles';

import './Dashboard.css';

const Dashboard = () => {

    const { user, updateUser } = useAuth();

    // Navigation State: Defaults to 'profile' tab
    const [activeTab, setActiveTab] = useState('profile');

    // Data State: Storing mock data in state
    const [bookings, setBookings] = useState(initialBookings);
    const [listings, setListings] = useState(initialProfiles);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingListing, setEditingListing] = useState(null); // Null -> Create, Object -> Edit

    // Update user profile (now updating global auth state)
    const handleUpdateProfile = (updatedUserData) => {
        updateUser(updatedUserData);
        alert('Profile updated successfully!');
    };

    // Creating a new listing
    const handleOpenCreateModal = () => {
        setEditingListing(null);
        setIsModalOpen(true);
    };

    // Editing an existing listing (we pass in the listing)
    const handleOpenEditModal = (listing) => {
        setEditingListing(listing);
        setIsModalOpen(true);
    };

    const handleSaveListing = (formData) => {
        if (editingListing) {
            setListings(prev => prev.map(item => item.id === editingListing.id ? { ...item, ...formData } : item));
            alert('Listing updated successfully!');
        } else {
            const newListing = {
                ...formData, 
                id: `custom-${Date.now()}`, 
                mentorId: user.id, 
                displayName: user.displayName || user.email, 
                undergradMajor: user.undergradMajor || 'Pre-Med', 
                rating: 5.0,
                reviewCount: 0, 
                status: 'Active', 
                reviews: []
            };
            setListings(prev => [newListing, ...prev]);
            alert('New listing created successfully!');
        }
        setIsModalOpen(false);
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
                        onCreateClick={handleOpenCreateModal}
                        onEditClick={handleOpenEditModal}
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
                return <ProfileSettings user={user} onSave={handleUpdateProfile}/>;
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

            {isModalOpen && (
                <ListingFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveListing}
                    initialData={editingListing}
                />
            )}
        </div>
    );
};

export default Dashboard;