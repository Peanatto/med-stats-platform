import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({
    displayName, 
    undergradMajor,
    // New Marketplace Props
    title,
    category,
    hourlyRate,
    rating = 5.0,
    reviewCount = 0,
    // Academic & Experience Props
    cgpa, 
    sgpa, 
    mcat, 
    clinicalHours, 
    researchHours, 
    shadowingHours, 
    volunteerHours, 
    adviceSnippet,
    // Action Handler
    onBookNow
}) => {
    
    // Format hourly rate cleanly (handles Free/Volunteer sessions)
    const formattedRate = Number(hourlyRate) === 0 ? "Free / Volunteer" : `$${hourlyRate}/hr`;

    return (
        <div className="service-card">
            
            {/* 1. Marketplace Header: Title, Category, and Price */}
            <div className="service-header">
                <div className="title-area">
                    <span className="category-badge">{category}</span>
                    <h3 className="service-title">{title}</h3>
                </div>
                <div className="price-badge">
                    {formattedRate}
                </div>
            </div>

            {/* 2. Mentor Identity & Community Rating */}
            <div className="mentor-info-bar">
                <div className="mentor-identity">
                    <span className="display-name">By {displayName}</span>
                    <span className="major-tag">• {undergradMajor}</span>
                </div>
                <div className="rating-display">
                    <span className="star">★</span> {rating} <span className="review-count">({reviewCount} reviews)</span>
                </div>
            </div>

            {/* 3. Academic Credentials Grid */}
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

            {/* 4. Advice Snippet */}
            {adviceSnippet && (
                <div className="advice-section">
                    <h4 className="section-title">Mentor's Advice Snippet</h4>
                    <p className="advice-text">"{adviceSnippet}"</p>
                </div>
            )}

            {/* 5. Collapsible Experience Hours (Keeps card UI clean) */}
            <details className="hours-accordion">
                <summary className="accordion-summary">View Extracurricular Background</summary>
                <div className="hours-grid">
                    <div><strong>Clinical:</strong> {clinicalHours} hrs</div>
                    <div><strong>Research:</strong> {researchHours} hrs</div>
                    <div><strong>Shadowing:</strong> {shadowingHours} hrs</div>
                    <div><strong>Volunteer:</strong> {volunteerHours} hrs</div>
                </div>
            </details>

            {/* 6. Marketplace Action Footer */}
            <div className="service-footer">
                <button 
                    className="book-now-btn"
                    onClick={() => onBookNow && onBookNow({ title, displayName, hourlyRate })}
                >
                    Request Booking
                </button>
            </div>

        </div>
    );
};

export default ServiceCard;