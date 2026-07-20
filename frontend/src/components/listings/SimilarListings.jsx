import React from 'react';
import ServiceCard from '../stats/ServiceCard'; // Reusing our existing modular component!
import './SimilarListings.css';

const SimilarListings = ({ similarListings = [] }) => {

    // Graceful Degradation
    if (!similarListings || similarListings.length === 0) {
        return null;
    }

    // Cap the list at exactly 3 items to maintain visual grid
    const displayListings = similarListings.slice(0, 3);

    return (
        <section className="similar-listings-section">
            
            {/* Section Header */}
            <div className="similar-listings-header">
                <div>
                    <h3 className="section-title">Similar Mentors You Might Like</h3>
                    <p className="section-subtitle">
                        Explore alternative tutors with similar subjects and academic backgrounds
                    </p>
                </div>
            </div>

            {/* The Responsive Card Track */}
            <div className="similar-listings-track">
                {displayListings.map((listing) => (
                    <div key={listing.id} className="card-wrapper">
                        {/* Spread the listing object properties down into reusable ServiceCard */}
                        <ServiceCard {...listing} />
                    </div>
                ))}
            </div>

        </section>
    );
};

export default SimilarListings;