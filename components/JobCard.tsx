'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Job } from '@/app/types';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formattedDate = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });
    } catch {
      return job.postedDate;
    }
  }, [job.postedDate]);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100" data-testid="job-card">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
            {job.logo ? (
              <Image src={job.logo} alt={`${job.company} logo`} width={48} height={48} className="h-full w-full object-contain" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                {job.company.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate" title={job.title}>{job.title}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shrink-0">
                {job.source}
              </span>
            </div>

            <p className="text-sm font-medium text-gray-700 truncate mt-1" title={job.company}>
              <Briefcase className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
              {job.company}
            </p>

            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 overflow-hidden max-h-16 mt-3">{job.description}</p>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            {job.salary && (
              <div className="flex items-center text-sm font-medium text-gray-900">
                <DollarSign className="w-4 h-4 mr-1.5 text-green-600" />
                <span>{job.salary}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-secondary"
          >
            Apply Now
            <ExternalLink className="ml-1.5 w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
