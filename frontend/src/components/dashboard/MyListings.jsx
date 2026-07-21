import React from 'react';
import ServiceCard from '../stats/ServiceCard';
import './MyListings.css';

const MyListings = ({ user, allListings = [], onToggleStatus, onDelete }) => {
  // Filter the global marketplace database for listings owned by this user
  const userListings = allListings.filter(listing => listing.mentorId === user.id);

  return (
    <div className="my-listings-container">
      
      {/* Header & Action Button */}
      <div className="listings-header">
        <div>
          <h2 className="listings-title">My Active Service Listings</h2>
          <p className="listings-subtitle">
            Manage the tutoring services, rates, and subjects you currently offer to students.
          </p>
        </div>
        <button className="btn-add-listing" onClick={() => alert('Navigate to New Listing Form!')}>
          + Add New Listing
        </button>
      </div>

      <hr className="listings-divider" />

      {/* Defensive Array Rendering */}
      {userListings.length > 0 ? (
        <div className="listings-grid">
          {userListings.map((listing) => (
            <div key={listing.id} className="listing-card-wrapper">
              
              {/* Reuse ServiceCard */}
              <ServiceCard {...listing} />
              
              {/* Dashboard-Specific Quick Actions */}
              <div className="listing-card-actions">
                <button 
                    className="btn-card-edit"
                    onClick={() => alert(`Opening edit form for: ${listing.title}`)}
                >
                    Edit Listing
                </button>

                <button 
                    className="btn-card-pause"
                    onClick={() => onToggleStatus(listing.id)}
                    style={{
                        backgroundColor: listing.status === 'Paused' ? '#fef9c3' : '#ffffff', 
                        color: listing.status === 'Paused' ? '#854d0e' : '#64748b'
                    }}
                >
                    {listing.status === 'Paused' ? 'Unpase / Show' : 'Pause / Hide'}
                </button>

                <button 
                    className="btn-card-pause"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this listing?')) {
                            onDelete(listing.id);
                        }
                    }}
                    style={{ color: '#dc2626', borderColor: 'fca5a5' }}
                >
                    Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Defensive Empty State */
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <h3>No Active Listings Yet</h3>
          <p>You haven't published any mentorship services to the marketplace. Create your first listing to start accepting students!</p>
          <button className="btn-add-listing-empty">Create First Listing</button>
        </div>
      )}

    </div>
  );
};

export default MyListings;