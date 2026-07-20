import React from 'react';
import { useState, useEffect } from 'react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, mentorName, hourlyRate }) => {

    // Form State
    const [formData, setFormData] = useState({
        topic: 'General Content Review', 
        dateTime: '', 
        duration: '1', // string representing hours
        notes: ''
    });

    // Escape Key Listener
    useEffect(() => {
            const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Background Scroll-Lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // If modal isn't open, render nothing to DOM
    if (!isOpen) return null;

    // Total cost based on duration
    const totalCost = (Number(hourlyRate) * Number(formData.duration)).toFixed(2);

    // Generalized Input Handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData, 
            [name]: value
        }));
    };

    // Handle Sumbit: prepare data for backend
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.dateTime) {
            alert("Please select a preferred date and time for your session.");
            return;
        }

        const bookingPayload = {
            mentorName, 
            hourlyRate: Number(hourlyRate), 
            ...formData, 
            totalCost: Number(totalCost), 
            requestedAt: new Date().toISOString()
        };

        console.log("Prepared Database Payload:", bookingPayload);
        alert(`Booking request sent for ${mentorName}! Total: $${totalCost}. Check browser console for JSON payload.`);

        onClose();
    }

    return (

        /* Backdrop Overlay, clicking on dimmed background calls onClose */
        <div className="modal-overlay" onClick={onClose}>

            {/* Content Box: e.stopPropagation() doesn't let background clicks leak inside */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Header (Title and Close Button) */}
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Request a Session</h2>
                        <p className="modal-subtitle">
                            Booking with <span className="highlight-name">{mentorName}</span> • ${hourlyRate}/hr
                        </p>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="booking-form">

                    <div className="form-group">
                        <label htmlFor="topic">Session Focus</label>
                        <select 
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                        >
                            <option value="General Content Review">General Content Review</option>
                            <option value="Practice Exam Dissection">Practice Exam Dissection</option>
                            <option value="Study Strategy & Pacing">Study Strategy & Pacing</option>
                            <option value="Targeted Weak-Point Therapy">Targeted Weak-Point Therapy</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-2">
                            <label htmlFor="dateTime">Preferred Date & Time</label>
                            <input 
                                type="datetime-local"
                                id="dateTime"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group flex-1">
                            <label htmlFor="duration">Duration</label>
                            <select 
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                            >
                                <option value="1">1 Hour</option>
                                <option value="1.5">1.5 Hours</option>
                                <option value="2">2 Hours</option>
                                <option value="3">3 Hours</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">What would you like help with?</label>
                        <textarea 
                            id="notes"
                            name="notes"
                            rows="3"
                            placeholder="e.g., I keep missing questions on endocrine metabolic feedback loops..."
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="price-review-box">
                        <span>Estimated Total ({formData.duration} hrs @ ${hourlyRate}/hr):</span>
                        <span className="total-price">${totalCost}</span>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="secondary-btn" onClick={onClose}>
                            Cancel 
                        </button>
                        <button type="submit" className="primary-submit-btn">
                            Confirm & Request
                        </button>
                    </div>

                </form>

            </div>
            
        </div>

    );

};

export default BookingModal;