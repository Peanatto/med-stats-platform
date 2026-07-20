import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockProfiles } from '../../data/mockProfiles';
import ServiceDetail from '../../components/listings/ServiceDetail';
import MentorSidebar from '../../components/listings/MentorSidebar';
import ReviewSection from '../../components/reviews/ReviewSection';
import SimilarListings from '../../components/listings/SimilarListings';
import BookingModal from '../../components/modals/BookingModal';
import './ListingDetail.css';

const ListingDetail = () => {

    // Grab ":id" out of URL
    const { id } = useParams();

    // Find exact mentor in array whose ID matches URL
    const activeListing = mockProfiles.find(profile => profile.id === id);

    // State for Booking Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fallback for id error
    if (!activeListing) {
        return (
            <div className="not-found-container">
                <h2>Listing Not Found</h2>
                <p>We couldn't find a mentor matching that ID.</p>
            </div>
        );
    }

    // Dynamically grab 3 similar listings
    const similarListings = mockProfiles
        .filter(profile => profile.id !== activeListing.id && profile.category === activeListing.category)
        .slice(0, 3);

    // If not enough same-category profiles, backfill with others so UI looks full
    if (similarListings.length < 3) {
        const backfill = mockProfiles 
            .filter(profile => profile.id !== activeListing.id && !similarListings.includes(profile))
            .slice(0, 3 - similarListings.length);
        similarListings.push(...backfill);
    }

    return (
        <div className="listing-detail-page">
            
            {/* TOP SECTION: 2-Column Grid */}
            <div className="listing-detail-container">
                
                {/* Left Column: Product Details & Reviews */}
                <div className="main-content">
                    <ServiceDetail 
                        title={activeListing.title}
                        category={activeListing.category}
                        hourlyRate={activeListing.hourlyRate}
                        description={activeListing.description || "No description provided."}
                        tags={activeListing.tags || []}
                    />

                    <ReviewSection 
                        reviews={activeListing.reviews || []} 
                        averageRating={activeListing.rating}
                    />
                </div>

                {/* Right Column: Sticky Mentor Sidebar */}
                <div className="sidebar-content">
                    <MentorSidebar 
                        displayName={activeListing.displayName}
                        undergradMajor={activeListing.undergradMajor}
                        mcat={activeListing.mcat}
                        cgpa={activeListing.cgpa}
                        sgpa={activeListing.sgpa}
                        onBookNow={() => setIsModalOpen(true)}
                    />
                </div>

            </div>

            {/* BOTTOM SECTION: Full-Width Outside the 2-Column Grid */}
            <div className="full-width-bottom-section">
                <SimilarListings similarListings={similarListings} />
            </div>

            {/* Floating Modal Overlay */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mentorName={activeListing.displayName}
                hourlyRate={activeListing.hourlyRate}
            />

        </div>
    );
};

export default ListingDetail;