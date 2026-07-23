import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockProfiles } from '../../data/mockProfiles';
import ServiceDetail from '../../components/listings/ServiceDetail';
import MentorSidebar from '../../components/listings/MentorSidebar';
import ReviewSection from '../../components/reviews/ReviewSection';
import SimilarListings from '../../components/listings/SimilarListings';
import BookingModal from '../../components/modals/BookingModal';
import ReviewModal from '../../components/modals/ReviewModal';
import './ListingDetail.css';

const ListingDetail = () => {

    // Grab ":id" out of URL
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Local State
    const [activeListing, setActiveListing] = useState(null);
    const [reviews, setReviews] = useState([]);

    // State for Modals
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Find exact mentor in array whose ID matches URL
    // const initialListing = mockProfiles.find(profile => profile.id === id);
    useEffect(() => {
        const foundListing = mockProfiles.find(profile => profile.id === id);

        if (foundListing) {
            setActiveListing(foundListing);
            setReviews(foundListing.reviews || []);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [id]);

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

    // HANDLERS
    // Auth Guard
    const handleActionGuard = (openModalCallback) => {
        if (!user) {
            alert('Please sign in to request a session or leave feedback!');
            navigate('/login');
            return;
        }
        openModalCallback(true);
    };

    const handleCreateBooking = (bookingPayload) => {
        console.log("Prepared Database Booking Payload:", bookingPayload);
        setIsBookingOpen(false);
        alert('Booking requested for ${bookingPayload.dateTime}! Total: $${bookingPayload.totalCost}.');
    };

    const handleCreateReview = (reviewPayload) => {
        console.log("Prepared Database Review Payload:", reviewPayload);

        // Dynamically update UI
        const updatedReviews = [reviewPayload, ...reviews];
        setReviews(updatedReviews);

        // Recalculate average rating
        const avgRating = (updatedReviews.reduce((acc, rev) => acc + rev.rating, 0) / updatedReviews.length).toFixed(1);
        setActiveListing(prev => ({ ...prev, rating: Number(avgRating) }));

        setIsReviewOpen(false);
        alert('Your review has been added to this profile.')
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
                        reviews={reviews || []} 
                        averageRating={activeListing.rating}
                        onAddReview={() => handleActionGuard(setIsReviewOpen)}
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
                        onBookNow={() => handleActionGuard(setIsBookingOpen)}
                    />
                </div>

            </div>

            {/* BOTTOM SECTION: Full-Width Outside the 2-Column Grid */}
            <div className="full-width-bottom-section">
                <SimilarListings similarListings={similarListings} />
            </div>

            {/* Floating Modal Overlays */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                onSubmit={handleCreateBooking}
                mentorName={activeListing.displayName}
                hourlyRate={activeListing.hourlyRate}
                listingId={activeListing.id}
                user={user}
            />

            <ReviewModal 
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onSubmit={handleCreateReview}
                mentorName={activeListing.displayName}
                listingId={activeListing.id}
                user={user}
            />

        </div>
    );
};

export default ListingDetail;