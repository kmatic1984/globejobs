import React from 'react';

const JobSearch = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filters, setFilters] = React.useState({});

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [filterKey]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add logic to perform search and filter
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {/* Example filter controls */}
            <select onChange={(e) => handleFilterChange('location', e.target.value)}>
                <option value="">Select Location</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
            </select>
            <button type="submit">Search</button>
        </form>
    );
};

export default JobSearch;