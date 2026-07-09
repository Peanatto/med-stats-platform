import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange }) => {

    // Helper function to handle input changes cleanly
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the filter state in the parent component
        onFilterChange(name, value);
    };

    return (
        <div className="filter-bar-container">
            <h3>Filter Profiles</h3>

            <div className="filter-group">
                <label htmlFor="major">Undergraduate Major</label>
                
                {/* Input for filtering by undergraduate major */}
                <input
                    list="major-options"
                    name="major"
                    id="major"
                    placeholder="Type a major..."
                    value={filters.major}
                    onChange={handleChange}
                />

                <datalist id="major-options">
                    <option value="Biology" />
                    <option value="Biochemistry" />
                    <option value="Chemistry" />
                    <option value="Neuroscience" />
                    <option value="Physics" />
                    <option value="Biomedical Engineering" />
                    <option value="Psychology" />
                    <option value="Public Health" />
                    <option value="Sociology" />
                    {/* Additional majors can be added here, CHECK BACK LATER */}
                </datalist>

            </div>

            <div className="filter-group">
                <label htmlFor="minMcat">Min MCAT Score</label>
                <input
                    type="number"
                    name="minMcat"
                    id="minMcat"
                    min="472"
                    max="528"
                    placeholder="e.g., 500"
                    value={filters.minMcat}
                    onChange={handleChange}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="minCgpa">Min Cumulative GPA</label>
                <input
                    type="number"
                    name="minCgpa"
                    id="minCgpa"
                    step="0.01"
                    min="0.0"
                    max="4.0"
                    placeholder="e.g., 3.5"
                    value={filters.minCgpa}
                    onChange={handleChange}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="minSgpa">Min Science GPA</label>
                <input
                    type="number"
                    name="minSgpa"
                    id="minSgpa"
                    step="0.01"
                    min="0.0"
                    max="4.0"
                    placeholder="e.g., 3.5"
                    value={filters.minSgpa}
                    onChange={handleChange}
                />
            </div>

            {/* Additional filters can be added here in a similar manner */}

            {/*Clear Filters Button*/}
            <button
                className="clear-btn"
                onClick={() => onFilterChange('CLEAR_ALL', null)}
            >
                Clear Filters
            </button>

        </div>
    );

};

export default FilterBar;