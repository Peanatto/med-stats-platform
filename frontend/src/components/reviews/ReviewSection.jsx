import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewSection.css';

const ReviewSection = ({ reviews = [], averageRating = 5.0, onAddReview }) => {
    const navigate = useNavigate();

    // Defensive Empty State Handling
    if (!reviews || reviews.length === 0) {
        return (
            <div className="review-section-empty">
                <h3 className="section-title">Student Reviews</h3>
                <p className="empty-message">
                    No reviews yet. Be the first student to book a session and leave feedback!
                </p>
                <button 
                    type="button"
                    className="btn-add-review-empty"
                    onClick={onAddReview}
                >
                    + Leave First Review
                </button>
            </div>
            
        );
    }

    // Click Handler for Reviewer Profiles
    const handleNameClick = (reviewerId) => {
        if (reviewerId) {
            navigate(`/dashboard/${reviewerId}`);
        }
    };

    return (
        <section className="review-section">
            
            {/* Aggregate Header */}
            <div className="review-section-header">
                <h3 className="section-title">Student Reviews</h3>
                <div className="aggregate-rating badge">
                    <span className="star-icon">★</span>
                    <span className="rating-number">{averageRating}</span>
                    <span className="review-count">({reviews.length} reviews)</span>
                </div>

                <button 
                    type="button"
                    className="btn-leave-review"
                    onClick={onAddReview}
                >
                    + Leave a Review
                </button>
            </div>

            {/* Review List Mapping */}
            <div className="review-list">
                {reviews.map((review) => (
                    <article key={review.id} className="review-card">
                        
                        {/* Reviewer Metadata & Clickable Name */}
                        <div className="review-card-header">
                            <div className="reviewer-info">
                                <button 
                                    type="button"
                                    className="clickable-name"
                                    onClick={() => handleNameClick(review.reviewerId)}
                                >
                                    {review.displayName || 'Student'}
                                </button>
                                {review.major && <span className="reviewer-major"> • {review.major}</span>}
                            </div>
                            <span className="review-date">{review.date}</span>
                        </div>

                        {/* Rating & Comment Body */}
                        <div className="review-rating">
                            {"★".repeat(Math.floor(review.rating || 5))}
                            <span className="numerical-rating"> ({review.rating || 5}.0)</span>
                        </div>
                        
                        <p className="review-comment">{review.comment}</p>

                    </article>
                ))}
            </div>

        </section>
    );
};

export default ReviewSection;