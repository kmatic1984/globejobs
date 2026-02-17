import React from 'react';
import { useState, useEffect } from 'react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch('https://api.example.com/jobs');
      const data = await response.json();
      setJobs(data);
    };

    fetchJobs();
  }, []);

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Job Listings</h1>
      <ul>
        {currentJobs.map((job) => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
      <nav>
        <ul className='pagination'>
          {[...Array(Math.ceil(jobs.length / jobsPerPage)).keys()].map((number) => (
            <li key={number} className='page-item'>
              <a onClick={() => paginate(number + 1)} className='page-link' href='!#'>
                {number + 1}
              </a>
            </li>
          )))}
        </ul>
      </nav>
    </div>
  );
};

export default JobList;
