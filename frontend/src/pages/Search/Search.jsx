import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FilterBar from '../../components/stats/FilterBar';
import ServiceCard from '../../components/stats/ServiceCard';
import BookingModal from '../../components/modals/BookingModal';
import { mockProfiles } from '../../data/mockProfiles';
import './Search.css';

const Search = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Master State (tracks all active "marketplace" filters)
    const [filters, setFilters] = useState({
        category: '', 
        maxRate: '', 
        major: '', 
        minMcat: '', 
        minCgpa: '', 
        minSgpa: ''
    });

    // Booking Modal State
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Database State
    const [marketplaceListings, setMarketplaceListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/listings');
                const data = await response.json();
                setMarketplaceListings(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, []);

    const handleFilterChange = (name, value) => {
        // Handle "Clear Filters" button reset
        if (name === 'CLEAR_ALL') {
            setFilters({
                category: '', 
                maxRate: '', 
                major: '', 
                minMcat: '', 
                minCgpa: '', 
                minSgpa: ''
            });
            return;
        }

        // Dynamically update whichever specific filter field was changed
        setFilters(prevFilters => ({
            ...prevFilters, 
            [name]: value
        }));
    };

    // "MarketPlace" Filtering Engine
    const filteredProfiles = marketplaceListings.filter(profile => {
        // Check Category (Exact Match)
        if (filters.category && profile.category !== filters.category) {
            return false;
        }

        // Check Max Hourly Rate
        // Use Number to ensure integer comparison
        if (filters.maxRate && Number(profile.hourlyRate) > Number(filters.maxRate)) {
            return false;
        }

        // Check Undergraduate Major (case-insensitive partial match)
        if (filters.major && !profile.undergradMajor.toLowerCase().includes(filters.major.toLowerCase())) {
            return false;
        }

        // Check Minimum MCAT Score
        if (filters.minMcat && profile.mcat < Number(filters.minMcat)) {
            return false;
        }

        // Check Minimum Cumulative GPA
        if (filters.minCgpa && profile.cgpa < Number(filters.minCgpa)) {
            return false;
        }

        // Check Minimum Science GPA
        if (filters.minSgpa && profile.sgpa < Number(filters.minSgpa)) {
            return false;
        }

        // If profile got through checks, keep in display array
        return true;
    })

    // Action Handler for Bookings
    const handleBookingRequest = (serviceInfo) => {
        if (!user) {
            alert('Please sign in to request a session!');
            navigate('/login');
            return;
        }

        // Save specific mentor's details to state so modal knows who we are booking
        setSelectedService(serviceInfo);
        setIsBookingOpen(true);
    };

    const handleCreateBooking = async (bookingPayload) => {
        try {
            const requestBody = {
                client_id: bookingPayload.studentId, 
                provider_id: activeListing.providerId,
                listing_id: bookingPayload.listingId, 
                topic: bookingPayload.topic, 
                date_time: bookingPayload.dateTime, 
                duration: Number(bookingPayload.duration), 
                notes: bookingPayload.notes, 
                total_cost: bookingPayload.totalCost
            };

            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setIsBookingOpen(false);
                alert(`Booking requested for ${bookingPayload.dateTime}! Total: $${bookingPayload.totalCost}.`);
            } else {
                const errorData = await response.json();
                alert(`Error creating booking: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Booking submission error:", error);
            alert("Failed to connect to the server.");
        }
    };

    // Rendered Layout
    return (
        <div className="search-page-container">

            {/* Sidebar with page controls */}
            <aside className="search-sidebar">
                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </aside>

            {/* Main content area */}
            <main className="search-results-area">
                <div className="results-header">
                    <h2>Available Mentorship Services</h2>
                    <span className="results-count">Showing {filteredProfiles.length} active listings</span>
                </div>

                <div className="services-grid">
                    {filteredProfiles.length > 0 ? (
                        filteredProfiles.map(profile => (
                            <ServiceCard
                                key={profile.id}
                                id={profile.id}
                                displayName={profile.displayName}
                                undergradMajor={profile.undergradMajor}
                                title={profile.title}
                                category={profile.category}
                                hourlyRate={profile.hourlyRate}
                                rating={profile.rating}
                                reviewCount={profile.reviewCount}
                                cgpa={profile.cgpa}
                                sgpa={profile.sgpa}
                                mcat={profile.mcat}
                                clinicalHours={profile.clinicalHours}
                                researchHours={profile.researchHours}
                                shadowingHours={profile.shadowingHours}
                                volunteerHours={profile.volunteerHours}
                                adviceSnippet={profile.adviceSnippet}
                                onBookNow={(info) => handleBookingRequest({ ...info, id: profile.id })}
                            />
                        ))
                    ) : (
                        <div className="no-results-box">
                            <h3>No listing match your exact criteria</h3>
                            <p>Try changing budget, stat requirements, or clearing filters.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Booking Modal */}
            {selectedService && (
                <BookingModal 
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    onSubmit={handleCreateBooking}
                    mentorName={selectedService.displayName}
                    hourlyRate={selectedService.hourlyRate}
                    listingId={selectedService.id}
                    user={user}
                />
            )}

        </div>
    );
};

export default Search;