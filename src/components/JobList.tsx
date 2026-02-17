import React, { useState } from 'react';
import JobCard from './JobCard';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    jobType: string;
    description: string;
    postedDate: string;
}

interface JobListProps {
    jobs: Job[];
    isLoading: boolean;
    error?: string;
}

const JobList: React.FC<JobListProps> = ({ jobs, isLoading, error }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(jobs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error loading jobs</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-gray-200 h-40 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700">No jobs found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <p className="text-gray-600 font-semibold">Found {jobs.length} jobs</p>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-8">
                {paginatedJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-8">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded-lg transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}> 
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobList;