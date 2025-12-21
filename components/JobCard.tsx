import React, { useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Job } from '@/app/types';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick?: (jobId: string) => void;
  className?: string;
}

const JobCard: React.FC<JobCardProps> = React.memo(({ job, onClick, className = '' }) => {
  // Memoize the formatted date to prevent recalculation on every render
  const formattedDate = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return job.postedDate;
    }
  }, [job.postedDate]);

  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(job.id);
    }
  }, [job.id, onClick]);

  // Handle image error with a fallback to company initials
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Fallback to a placeholder with company initials
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      const fallback = document.createElement('div');
      fallback.className = 'w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold';
      fallback.textContent = job.company.substring(0, 2).toUpperCase();
      parent.appendChild(fallback);
    }
  }, [job.company]);

  // Generate a unique ID for accessibility
  const cardId = `job-card-${job.id}`;

  return (
    <article 
      id={cardId}
      aria-labelledby={`${cardId}-title`}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-100 dark:border-gray-700 ${className}`}
      data-testid="job-card"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            {job.logo ? (
              <Image
                src={job.logo}
                alt={`${job.company} logo`}
                width={48}
                height={48}
                className="h-full w-full object-contain"
                onError={handleImageError}
                unoptimized={process.env.NODE_ENV !== 'production'}
                priority={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                {job.company.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between space-x-2">
              <h3 
                id={`${cardId}-title`}
                className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                title={job.title}
              >
                {job.title}
              </h3>
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex-shrink-0"
                aria-label={`Posted on ${job.source}`}
              >
                {job.source}
              </span>
            </div>
            
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate" title={job.company}>
                <Briefcase className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
                {job.company}
              </p>
              {job.location && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {job.description && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3" aria-label="Job description">
              {job.description}
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              {job.salary && (
                <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                  <DollarSign className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400" />
                  <span>{job.salary}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <a
                href={job.applyUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 transition-colors"
                aria-label={`Apply for ${job.title} at ${job.company}`}
                onClick={(e) => {
                  // Track outbound link clicks
                  if (window.gtag && job.applyUrl) {
                    window.gtag('event', 'click', {
                      'event_category': 'Outbound Link',
                      'event_label': job.applyUrl,
                      'transport_type': 'beacon',
                    });
                  }
                }}
              >
                Apply Now
                <ExternalLink className="ml-1.5 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
