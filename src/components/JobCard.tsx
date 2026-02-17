import React from 'react';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobType: string;
  description: string;
  postedDate: string;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  location,
  salary,
  jobType,
  description,
  postedDate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-gray-600 font-semibold">{company}</p>
        </div>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {jobType}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {location}
        </div>
        {salary && (
          <div className="flex items-center text-green-600 font-semibold">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.16 5a.5.5 0 00-.5.5v3H5.5a.5.5 0 000 1h2.16v3a.5.5 0 001 0v-3h2.16a.5.5 0 000-1H8.66v-3a.5.5 0 00-.5-.5z" />
            </svg>
            {salary}
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-400">{postedDate}</span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;