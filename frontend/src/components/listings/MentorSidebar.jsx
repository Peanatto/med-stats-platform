import React from 'react';
import './MentorSidebar.css';

const MentorSidebar = ({
    displayName, 
    undergradMajor, 
    mcat, 
    cgpa, 
    sgpa, 
    onBookNow
}) => {

    return (

        <div className="mentor-sidebar">

            <div className="mentor-identity">
                <span className="display-name">{displayName}</span>
                <span className="major-tag">{undergradMajor}</span>
            </div>

            <div className="academic-grid">
                <div className="stat-item">
                    <span className="stat-label">MCAT</span>
                    <span className="stat-value highlight">{mcat || 'N/A'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">cGPA</span>
                    <span className="stat-value">{cgpa || 'N/A'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">sGPA</span>
                    <span className="stat-value">{sgpa || 'N/A'}</span>
                </div>
            </div>

            <div className="mentor-footer">
                <button
                    className="book-now-btn"
                    onClick={onBookNow}
                >
                    Request Booking
                </button>
            </div>

        </div>
    );

};

export default MentorSidebar;