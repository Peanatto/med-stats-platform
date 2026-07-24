import React, { useState } from 'react';
import './ProfileSettings.css';

const ProfileSettings = ({ user, onSave, isOwner = true }) => {
    // Toggle between read-only View Mode and interactive Edit Mode
    const [isEditing, setIsEditing] = useState(false);

    // Local state to hold form edits before saving
    const [formData, setFormData] = useState({ 
        displayName: user.profile?.displayName || '',
        undergradMajor: user.profile?.undergradMajor || '',
        adviceSnippet: user.profile?.adviceSnippet || '',
        cgpa: user.profile?.cumulativeGpa || '',
        sgpa: user.profile?.scienceGpa || '',
        mcat: user.profile?.mcatScore || '',
        clinicalHours: user.profile?.clinicalHours || 0,
        researchHours: user.profile?.researchHours || 0,
        shadowingHours: user.profile?.shadowingHours || 0,
        volunteerHours: user.profile?.volunteerHours || 0,
    });

    // Universal change handler for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Save
    const handleSaveClick = (e) => {
        e.preventDefault();
        if (onSave) {
            // Format numerical inputs before sending to parent
            onSave({
                ...formData, 
                cgpa: parseFloat(formData.cgpa) || null, 
                sgpa: parseFloat(formData.sgpa) || null,
                mcat: parseInt(formData.mcat, 10) || null,
                clinicalHours: parseInt(formData.clinicalHours, 10) || 0,
                researchHours: parseInt(formData.researchHours, 10) || 0,
                shadowingHours: parseInt(formData.shadowingHours, 10) || 0,
                volunteerHours: parseInt(formData.volunteerHours, 10) || 0,
            });
        }
        setIsEditing(false); // Switch back to read-only view
    };

    // Handle Cancel (Revert edits back to original user props)
    const handleCancelClick = () => {
        setFormData({ 
            displayName: user.profile?.displayName || '',
            undergradMajor: user.profile?.undergradMajor || '',
            adviceSnippet: user.profile?.adviceSnippet || '',
            cgpa: user.profile?.cumulativeGpa || '',
            sgpa: user.profile?.scienceGpa || '',
            mcat: user.profile?.mcatScore || '',
            clinicalHours: user.profile?.clinicalHours || 0,
            researchHours: user.profile?.researchHours || 0,
            shadowingHours: user.profile?.shadowingHours || 0,
            volunteerHours: user.profile?.volunteerHours || 0,
        });
        setIsEditing(false);
    };

  return (
    <div className="profile-settings-container">
      
        {/* Header Section with Toggle Button */}
        <div className="settings-header">
            <div>
                <h2 className="settings-title">Account & Profile Settings</h2>
                <p className="settings-subtitle">Manage your marketplace identity, academic stats, and mentorship bio.</p>
            </div>
            {!isEditing && isOwner && (
                <button className="btn-edit-toggle" onClick={() => setIsEditing(true)}>
                    ✏️ Edit Profile
                </button>
            )}
        </div>

        <hr className="settings-divider" />

        {/* Profile Form / View */}
        <form onSubmit={handleSaveClick} className="settings-form">
        
            {/* Identity & Mentorship */}
            <div className="form-section">
                <h3 className="section-heading">Identity & Mentorship Bio</h3>
                
                <div className="form-grid-2">
                    <div className="form-group">
                        <label htmlFor="displayName">Display Name (Public)</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <div className="read-only-value">{user.profile?.displayName}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="undergradMajor">Undergraduate Major</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="undergradMajor"
                                name="undergradMajor"
                                value={formData.undergradMajor}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <div className="read-only-value">{user.profile?.undergradMajor}</div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="adviceSnippet">Mentorship Advice Snippet (Shown on your cards)</label>
                    {isEditing ? (
                    <textarea
                        id="adviceSnippet"
                        name="adviceSnippet"
                        rows="3"
                        value={formData.adviceSnippet}
                        onChange={handleChange}
                    />
                    ) : (
                    <div className="read-only-value quote-style">"{user.profile?.adviceSnippet}"</div>
                    )}
                </div>
            </div>

            {/* Academic Credentials */}
            <div className="form-section">
                <h3 className="section-heading">Academic Credentials</h3>
            
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="cgpa">Cumulative GPA</label>
                        {isEditing ? (
                            <input
                                type="number"
                                step="0.01"
                                min="0.00"
                                max="4.00"
                                id="cgpa"
                                name="cgpa"
                                value={formData.cgpa}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="read-only-value metric-highlight">{user.profile?.cumulativeGpa}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="sgpa">Science GPA</label>
                        {isEditing ? (
                            <input
                                type="number"
                                step="0.01"
                                min="0.00"
                                max="4.00"
                                id="sgpa"
                                name="sgpa"
                                value={formData.sgpa}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="read-only-value metric-highlight">{user.profile?.scienceGpa}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="mcat">MCAT Score</label>
                        {isEditing ? (
                            <input
                                type="number"
                                min="472"
                                max="528"
                                id="mcat"
                                name="mcat"
                                value={formData.mcat}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="read-only-value metric-highlight">{user.profile?.mcatScore}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Extracurricular Hours */}
            <div className="form-section">
                <h3 className="section-heading">Extracurricular Experience (Hours)</h3>
            
                <div className="form-grid-4">
                    <div className="form-group">
                        <label htmlFor="clinicalHours">Clinical</label>
                        {isEditing ? (
                            <input
                                type="number"
                                id="clinicalHours"
                                name="clinicalHours"
                                value={formData.clinicalHours}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="read-only-value">{user.profile?.clinicalHours} hrs</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="researchHours">Research</label>
                        {isEditing ? (
                            <input
                                type="number"
                                id="researchHours"
                                name="researchHours"
                                value={formData.researchHours}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="read-only-value">{user.profile?.researchHours} hrs</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="shadowingHours">Shadowing</label>
                        {isEditing ? (
                            <input
                                type="number"
                                id="shadowingHours"
                                name="shadowingHours"
                                value={formData.shadowingHours}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="read-only-value">{user.profile?.shadowingHours} hrs</div>
                        )}  
                    </div>

                    <div className="form-group">
                        <label htmlFor="volunteerHours">Volunteer</label>
                        {isEditing ? (
                            <input
                                type="number"
                                id="volunteerHours"
                                name="volunteerHours"
                                value={formData.volunteerHours}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="read-only-value">{user.profile?.volunteerHours} hrs</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons (Only visible in Edit Mode) */}
            {isEditing && isOwner && (
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleCancelClick}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-save">
                        Save Changes
                    </button>
                </div>
            )}

      </form>

    </div>
  );
};

export default ProfileSettings;