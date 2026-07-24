import React, { useState, useEffect } from 'react';
import './ListingFormModal.css';

const ListingFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'MCAT Tutoring',
        hourlyRate: '',
        description: '',
        tags: ''
    });

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                category: initialData.category || 'MCAT Tutoring',
                hourlyRate: initialData.hourlyRate || '',
                description: initialData.description || '',
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || '')
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedTags = formData.tags
            ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : ['Mentorship'];

        onSave({
            ...formData,
            hourlyRate: Number(formData.hourlyRate) || 0,
            tags: formattedTags
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {initialData ? 'Edit Mentorship Listing' : 'Create New Listing'}
                    </h2>
                    <button type="button" onClick={onClose} className="btn-modal-close" aria-label="Close modal">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="listing-form">
                    
                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label">Listing Title *</label>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            value={formData.title} 
                            onChange={handleChange}
                            placeholder="e.g., 1-on-1 MCAT CARS Dissection & Strategy"
                            className="form-input"
                        />
                    </div>

                    {/* Category & Hourly Rate Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="MCAT Tutoring">MCAT Tutoring</option>
                                <option value="Personal Statement">Personal Statement</option>
                                <option value="Mock Interview">Mock Interview</option>
                                <option value="General Mentorship">General Mentorship</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Hourly Rate ($) *</label>
                            <input 
                                type="number" 
                                name="hourlyRate" 
                                required 
                                min="0" 
                                value={formData.hourlyRate} 
                                onChange={handleChange}
                                placeholder="0 for Free/Volunteer"
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Detailed Service Description *</label>
                        <textarea 
                            name="description" 
                            required 
                            rows="4" 
                            value={formData.description} 
                            onChange={handleChange}
                            placeholder="Explain your tutoring style, what students can expect, and your background..."
                            className="form-textarea"
                        />
                    </div>

                    {/* Tags */}
                    <div className="form-group">
                        <label className="form-label">Tags (Comma-separated)</label>
                        <input 
                            type="text" 
                            name="tags" 
                            value={formData.tags} 
                            onChange={handleChange}
                            placeholder="MCAT, Biology, Anki, Study Schedules"
                            className="form-input"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-modal-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-modal-submit">
                            {initialData ? 'Save Changes' : 'Create Listing'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ListingFormModal;