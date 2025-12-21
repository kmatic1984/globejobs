'use client';

import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import { Job } from './types';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.village || '';
            const country = data.address?.country || '';
            setUserLocation(`${city}${city && country ? ', ' : ''}${country}`);
            setLocation(`${city}${city && country ? ', ' : ''}${country}`);
          } catch (error) {
            console.error('Error getting location:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Function to fetch jobs from the API
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        location: location || userLocation,
        limit: '20',
      });
      
      const response = await fetch(`/api/jobs?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data.jobs || []);
      
      if (data.jobs.length === 0) {
        setError('No jobs found. Try adjusting your search criteria.');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job with GlobeJobs</h1>
          <p className="text-xl text-gray-600">Search from thousands of job listings across multiple platforms worldwide</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Job title, keywords, or company</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Job title, keywords, or company"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="location" className="sr-only">Location</label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="City, state, or zip code"
                />
                {userLocation && (
                  <button
                    type="button"
                    onClick={() => setLocation(userLocation)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-primary hover:text-secondary"
                  >
                    Use my location
                  </button>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Jobs'}
            </button>
          </form>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setLocation('');
                    fetchJobs();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
