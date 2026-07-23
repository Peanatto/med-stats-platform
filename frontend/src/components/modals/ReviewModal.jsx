import React, { useState, useEffect } from 'react';
import './BookingModal.css';

const ReviewModal = ({ isOpen, onClose, onSubmit, mentorName, listingId, user }) => {
    const [rating, setRating] = useState('5');
    const [comment, setComment] = useState('');

    // Escape Key Listener
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Background Scroll-Lock
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!comment.trim()) {
            alert("Please enter a short comment for your review.");
            return;
        }

        const reviewPayload = {
            id: `rev-${Date.now()}`,
            listingId: listingId,
            authorName: user?.displayName || 'Student Mentor',
            authorId: user?.id || 'guest-id',
            rating: Number(rating),
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            comment: comment.trim()
        };

        onSubmit(reviewPayload);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
                
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Leave Feedback</h2>
                        <p className="modal-subtitle">
                            Sharing your experience with <span className="highlight-name">{mentorName}</span>
                        </p>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label htmlFor="rating">Overall Rating</label>
                        <select 
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            style={{ fontWeight: 'bold', color: '#f59e0b' }}
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                            <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                            <option value="3">⭐⭐⭐ (3 - Average)</option>
                            <option value="2">⭐⭐ (2 - Below Average)</option>
                            <option value="1">⭐ (1 - Poor)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="comment">Your Review *</label>
                        <textarea 
                            id="comment"
                            rows="4" 
                            required
                            placeholder="What was most helpful about this mentorship session? How did it help your prep?" 
                            value={comment} 
                            onChange={(e) => setComment(e.target.value)} 
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="primary-submit-btn">Submit Review</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default ReviewModal;