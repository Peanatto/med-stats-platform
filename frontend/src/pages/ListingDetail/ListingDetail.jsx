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
    const [similarListings, setSimilarListings] = useState([]);

    // State for Modals
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    useEffect(() => {
        const fetchListingData = async () => {
            try {
                // Find exact mentor in array whose ID matches URL
                const singleResponse = await fetch(`http://localhost:5000/api/listings/${id}`);

                if (singleResponse.ok) {
                    const activeData = await singleResponse.json();
                    setActiveListing(activeData);
                    setReviews(activeData.reviews || []);

                    const allResponse = await fetch('http://localhost:5000/api/listings');
                    if (allResponse.ok) {
                        const allListings = await allResponse.json();

                        // Filter out current mentor, match category, slice 3
                        let similar = allListings
                            .filter(profile => profile.id !== activeData.id && profile.category === activeData.category)
                            .slice(0, 3);

                        // Backfill if less than 3 in same category
                        if (similar.length < 3) {
                            const backfill = allListings
                                .filter(profile => profile.id !== activeData.id && !similar.some(s => s.id === profile.id))
                                .slice(0, 3 - similar.length);
                            similar = [...similar, ...backfill];
                        }

                        setSimilarListings(similar);
                    }
                }
            } catch (error) {
                console.error("Error finding mentor:", error);
            }
        };

        fetchListingData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const handleCreateReview = async (reviewPayload) => {
        try {
            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({
                    listing_id: reviewPayload.listingId, 
                    client_id: reviewPayload.authorId, 
                    rating: reviewPayload.rating, 
                    comment: reviewPayload.comment
                }),
            });

            if (response.ok) {
                // Use database-backed review returned from server
                const savedReview = await response.json();

                // Dynamically update UI with real data
                const updatedReviews = [savedReview, ...reviews];
                setReviews(updatedReviews);

                // Recalculate average rating
                const avgRating = (updatedReviews.reduce((acc, rev) => acc + rev.rating, 0) / updatedReviews.length).toFixed(1);
                setActiveListing(prev => ({ ...prev, rating: Number(avgRating) }));

                setIsReviewOpen(false);
                alert('Your review has been successfully added to this profile.');
            } else {
                const errorData = await response.json();
                alert(`Error submitting review: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Review submission error:", error);
            alert("Failed to connect to the server.");
        }
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
                        displayName={activeListing.provider?.profile?.displayName}
                        undergradMajor={activeListing.provider?.profile?.undergradMajor}
                        mcat={activeListing.provider?.profile?.mcatScore}
                        cgpa={activeListing.provider?.profile?.cumulativeGpa}
                        sgpa={activeListing.provider?.profile?.scienceGpa}
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
                mentorName={activeListing.provider?.profile?.displayName}
                hourlyRate={activeListing.hourlyRate}
                listingId={activeListing.id}
                user={user}
            />

            <ReviewModal 
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onSubmit={handleCreateReview}
                mentorName={activeListing.provider?.profile?.displayName}
                listingId={activeListing.id}
                user={user}
            />

        </div>
    );
};

export default ListingDetail;