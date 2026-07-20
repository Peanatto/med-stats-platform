import React from 'react';
import './ServiceDetail.css';

const ServiceDetail = ({
    title, 
    category, 
    hourlyRate, 
    description, 
    tags = []
}) => {

    // Format hourly rate cleanly (handles Free/Volunteer sessions)
    const formattedRate = Number(hourlyRate) === 0 ? "Free / Volunteer" : `$${hourlyRate}/hr`;

    return (
        <div className="service-detail">

            <div className="service-header">
                <div className="title-area">
                    <span className="category-badge">{category}</span>
                    <h3 className="service-title">{title}</h3>
                </div>
                <div className="price-badge">
                    {formattedRate}
                </div>
            </div>

            <div className="service-description">
                <div className="service-description-box">
                    <h4 className="section-heading">About This Mentorship Session</h4>
                    <p>{description}</p>
                </div>
                <div className="service-description-tags">
                    {tags.map((tag, index) => {
                        return (
                            <span key={index} className="tag-pill">
                                #{tag}
                            </span>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default ServiceDetail;