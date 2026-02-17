import React from 'react';

const JobCard = ({ job }) => {
    return (
        <div className="job-card">
            <h2>{job.title}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p>{job.description}</p>
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
        </div>
    );
};

export default JobCard;