import React, { useState } from 'react';
import './MyBookings.css';

const MyBookings = ({ user, allBookings = [], onUpdateStatus }) => {

    const [filterRole, setFilterRole] = useState('all'); // 'all', 'mentor', or 'student'

    // Grab all bookings where the user is EITHER the mentor or the mentee
    const userBookings = allBookings.filter(booking => 
        booking.mentorId === user.id || booking.studentId === user.id
    );

    // Apply sub-tab filtering if selected
    const displayedBookings = userBookings.filter(booking => {
        if (filterRole === 'mentor') return booking.mentorId === user.id;
        if (filterRole === 'student') return booking.studentId === user.id;
        return true;
    });

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'status-badge confirmed';
            case 'completed': return 'status-badge completed';
            case 'pending':
            default: return 'status-badge pending';
        }
    };

    return (
        <div className="my-bookings-container">
        
        {/* Header with Role Filter Tabs */}
        <div className="bookings-header">
            <div>
                <h2 className="bookings-title">Mentorship Sessions & Bookings</h2>
                <p className="bookings-subtitle">
                    Track your upcoming tutoring schedule, whether you are teaching or learning.
                </p>
            </div>

            {/* Role Toggle for Dual-Sided Users */}
            <div className="role-filter-group">
                <button 
                    className={`role-btn ${filterRole === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterRole('all')}
                >
                    All Sessions
                </button>
                <button 
                    className={`role-btn ${filterRole === 'student' ? 'active' : ''}`}
                    onClick={() => setFilterRole('student')}
                >
                    Sessions I'm Attending (Pre-Med)
                </button>
                <button 
                    className={`role-btn ${filterRole === 'mentor' ? 'active' : ''}`}
                    onClick={() => setFilterRole('mentor')}
                >
                    Requests to Mentor (Med Student)
                </button>
            </div>
        </div>

        <hr className="bookings-divider" />

        {/* Defensive Array Rendering */}
        {displayedBookings.length > 0 ? (
            <div className="bookings-list">
                {displayedBookings.map((booking) => {
                    // DETERMINE ROLE FOR THIS SPECIFIC CARD:
                    const isMentor = booking.mentorId === user.id;

                    return (
                        <div key={booking.id} className="booking-card">
                            
                            {/* Top Row: Service Title, Role Tag, & Status Badge */}
                            <div className="booking-card-header">
                                <div>
                                    <span className={`role-tag ${isMentor ? 'role-mentor' : 'role-student'}`}>
                                        {isMentor ? 'You are Teaching' : 'You are Learning'}
                                    </span>
                                    <h3 className="booking-service-title">{booking.serviceTitle}</h3>
                                </div>
                                <span className={getStatusBadgeClass(booking.status)}>
                                    {booking.status}
                                </span>
                            </div>

                            {/* Middle Row: Dynamic Counterparty Details */}
                            <div className="booking-details-grid">
                                <div className="detail-item">
                                    {/* If Mentor, show Student name. If Pre-Med, show Mentor name! */}
                                    <span className="detail-label">{isMentor ? 'STUDENT (PRE-MED)' : 'MENTOR (MED STUDENT)'}</span>
                                    <span className="detail-value font-bold">
                                        {isMentor ? `${booking.studentName} (${booking.studentMajor})` : booking.mentorName}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">SCHEDULED TIME</span>
                                    <span className="detail-value">🗓️ {booking.date} • ⏰ {booking.time}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">RATE</span>
                                    <span className="detail-value">${booking.hourlyRate}/hr</span>
                                </div>
                            </div>

                            {/* Student Note Snippet */}
                            {booking.notes && (
                                <div className="booking-notes">
                                    <strong>{isMentor ? "Student Note:" : "Your Note to Mentor:"}</strong> "{booking.notes}"
                                </div>
                            )}

                            {/* Bottom Row: ROLE-BASED ACTION BUTTONS */}
                            <div className="booking-actions">
                            
                                {/* --- CASE 1: PENDING BOOKINGS --- */}
                                {booking.status === 'Pending' && (
                                    isMentor ? (
                                        // Mentor Actions:
                                        <>
                                            <button 
                                                className="btn-accept"
                                                onClick={() => onUpdateStatus(booking.id, 'Confirmed')}
                                            >
                                                ✔ Accept Request
                                            </button>
                                            <button 
                                                className="btn-decline"
                                                onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                                            >
                                                ✖ Decline
                                            </button>
                                        </>
                                    ) : (
                                        // Pre-Med Actions:
                                        <>
                                            <span className="waiting-text">⏳ Waiting for mentor approval...</span>
                                            <button 
                                                className="btn-decline"
                                                onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                                            >
                                                Cancel Request
                                            </button>
                                        </>
                                    )
                                )}

                                {/* --- CASE 2: CONFIRMED BOOKINGS --- */}
                                {booking.status === 'Confirmed' && (
                                    <>
                                        <button 
                                            className="btn-secondary"
                                            onClick={() => alert('Added "${booking.serviceTitle}" to your calendar!')}
                                        >
                                            📅 Add to Calendar
                                        </button>
                                        {!isMentor && (
                                            <button 
                                                className="btn-review"
                                                onClick={() => alert('Opening Reschedule Request modal...')}
                                            >
                                                🔄 Request Reschedule
                                            </button>
                                        )}
                                    </>
                                )}

                                {/* --- CASE 3: COMPLETED BOOKINGS --- */}
                                {booking.status === 'Completed' && (
                                    isMentor ? (
                                        // Mentor Actions:
                                        <button 
                                            className="btn-review"
                                            onClick={() => alert('Opening student feedback modal...')}
                                        >
                                            ⭐ Read Student Review
                                        </button>
                                    ) : (
                                        // Pre-Med Actions:
                                        <button 
                                            className="btn-accept"
                                            onClick={() => alert('Opening review submission form...')}
                                        >
                                            ⭐ Leave a Review
                                        </button>
                                    )
                                )}

                                {/* --- CASE 4: CANCELLED BOOKINGS --- */}
                                {booking.status === 'Cancelled' && (
                                    <span className="waiting-text" style={{ color: '#dc2626' }}>
                                        This session was cancelled or declined.
                                    </span>
                                )}

                            </div>

                        </div>
                    );
                })}
            </div>
        ) : (
            /* Defensive Empty State */
            <div className="empty-state">
            <span className="empty-icon">📅</span>
            <h3>No Sessions Found</h3>
            <p>No bookings match this view. Check your filters or explore the marketplace to book a session!</p>
            </div>
        )}

        </div>
    );
};

export default MyBookings;