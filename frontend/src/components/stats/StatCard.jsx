import React from 'react';
import './StatCard.css';

const StatCard = ({
    displayName, 
    undergradMajor, 
    cgpa, 
    sgpa, 
    mcat, 
    clinicalHours, 
    researchHours, 
    shadowingHours, 
    volunteerHours, 
    adviceText
}) => {
    return (
        <div className="stat-card">
            {/* Header Section: Identity and Major */}
            <div className="stat-card-header">
                <h3 className="display-name">{displayName}</h3>
                <span className="major-badge">{undergradMajor}</span>
            </div>

            {/* Academic Performance Section */}
            <div className="academic-grid">
                <div className="stat-item">
                    <span className="stat-label">MCAT</span>
                    <span className="stat-value highlight">{mcat}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">CGPA</span>
                    <span className="stat-value">{cgpa}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">SGPA</span>
                    <span className="stat-value">{sgpa}</span>
                </div>
            </div>

            {/* Extracurriculars Section */}
            <div className="hours-section">
                <h4 className="section-title">Experience (Hours)</h4>
                <div className="hours-grid">
                    <div><strong>Clinical:</strong> {clinicalHours}</div>
                    <div><strong>Research:</strong> {researchHours}</div>
                    <div><strong>Shadowing:</strong> {shadowingHours}</div>
                    <div><strong>Volunteer:</strong> {volunteerHours}</div>
                </div>
            </div>


            {/* Advice Section */}
            {adviceText && (
                <div className="advice-section">
                    <h4 className="advice-header">Advice</h4>
                    <p className="advice-text">{adviceText}</p>
                </div>
            )}
        </div>
    );
};

export default StatCard;