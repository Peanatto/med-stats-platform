import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import ProfileSettings from '../../components/dashboard/ProfileSettings';
import MyListings from '../../components/dashboard/MyListings';
import MyBookings from '../../components/dashboard/MyBookings';
import ListingFormModal from '../../components/modals/ListingFormModal';

import './Dashboard.css';

const Dashboard = () => {

    const { user, updateUser } = useAuth();

    // Navigation State: Defaults to 'profile' tab
    const [activeTab, setActiveTab] = useState('profile');

    // Data State: Storing mock data in state
    const [bookings, setBookings] = useState([]);
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingListing, setEditingListing] = useState(null); // Null -> Create, Object -> Edit

    // Initial Data Fetch
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;
            try {
                setIsLoading(true);
                // Fetch Listings and Bookings concurrently
                const [listingsRes, bookingsRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/users/${user.id}/listings`), 
                    fetch(`http://localhost:5000/api/users/${user.id}/bookings`)
                ]);

                if (listingsRes.ok) setListings(await listingsRes.json());
                if (bookingsRes.ok) setBookings(await bookingsRes.json());
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.id]);

    // Update Profile
    const handleUpdateProfile = async (updatedUserData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUserData)
            });

            if (response.ok) {
                const savedProfile = await response.json();
                updateUser({ ...user, profile: savedProfile });
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error("Profile update error:", error);
        }
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

    // Create & Update Listings
    const handleSaveListing = async (formData) => {
        try {
            if (editingListing) {
                // UPDATE Existing Listing
                const response = await fetch(`http://localhost:5000/api/listings/${editingListing.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    const updated = await response.json();
                    setListings(prev => prev.map(item => item.id === editingListing.id ? updated : item));
                    alert('Listing updated successfully!');
                }
            } else {
                // CREATE New Listing
                const payload = { ...formData, providerId: user.id };
                const response = await fetch(`http://localhost:5000/api/listings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const created = await response.json();
                    setListings(prev => [created, ...prev]);
                    alert('New listing created successfully!');
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving listing:", error);
            alert("Failed to save the listing.");
        }
    };

    // Update Booking Status
    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            } else {
                alert("Failed to update booking status.");
            }
        } catch (error) {
            console.error("Booking status update error:", error);
        }
    };

    // Pause/Unhide Listing
    const handleToggleListingStatus = async (listingId, currentIsActive) => {
        try {
            const response = await fetch(`http://localhost:5000/api/listings/${listingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentIsActive })
            });

            if (response.ok) {
                setListings(prev => prev.map(listing => 
                    listing.id === listingId ? { ...listing, isActive: !currentIsActive } : listing
                ));
            } else {
                alert("Failed to update listing status.");
            }
        } catch (error) {
            console.error("Listing toggle error:", error);
        }
    };

    // Delete Listing
    const handleDeleteListing = async (listingId) => {
        if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/listings/${listingId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setListings(prev => prev.filter(item => item.id !== listingId));
            } else {
                alert("Failed to delete the listing.");
            }
        } catch (error) {
            console.error("Listing deletion error:", error);
        }
    };

    // Dynamic Content Router: Renders the active component
    const renderTabContent = () => {
        if (isLoading) return <div className="loading-spinner">Loading dashboard data...</div>;

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