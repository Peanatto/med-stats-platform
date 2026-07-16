import React, { useState } from 'react';
import FilterBar from '../../components/stats/FilterBar';
import ServiceCard from '../../components/stats/ServiceCard';
import { mockProfiles } from '../../data/mockProfiles';
import './Search.css';

const Search = () => {
    // Master State (tracks all active "marketplace" filters)
    const [filters, setFilters] = useState({
        category: '', 
        maxRate: '', 
        major: '', 
        minMcat: '', 
        minCgpa: '', 
        minSgpa: ''
    });

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
    const filteredProfiles = mockProfiles.filter(profile => {
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
        alert(`Initiating booking for "${serviceInfo.title}" with ${serviceInfo.displayName}. MUST UPDATE LATER`)
    }

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
                                displayName={profile.displayName}
                                undergradMajor={profile.undergradMajor}
                                title={profile.title}
                                category={profile.category}
                                hourlyRate={profile.hourlyRate}
                                rating={profile.rating}
                                reviewCount={profile.reviewCount}
                                cgpa={profile.cgpa}
                                sgpa={profile.cgpa}
                                mcat={profile.mcat}
                                clinicalHours={profile.clinicalHours}
                                researchHours={profile.researchHours}
                                shadowingHours={profile.shadowingHours}
                                volunteerHours={profile.volunteerHours}
                                adviceSnippet={profile.adviceSnippet}
                                onBookNow={handleBookingRequest}
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

        </div>
    );
};

export default Search;