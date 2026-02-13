'use client';

import { useEffect, useState } from 'react';
import JobCard from '@/components/JobCard';
import { Job } from './types';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`;

        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || '';
          const country = data.address?.country || '';
          const formatted = `${city}${city && country ? ', ' : ''}${country}`;
          setUserLocation(formatted);
          setLocation(formatted);
        } catch {
          // noop
        }
      },
      () => {
        // noop
      }
    );
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search: searchTerm,
        location: location || userLocation,
        limit: '30',
      });

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to fetch jobs');
      }

      setJobs(payload.jobs ?? []);

      if ((payload.jobs ?? []).length === 0) {
        setError('No non-expired jobs found for this search/location yet.');
      }
    } catch (err) {
      setJobs([]);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Global jobs from free platforms</h1>
          <p className="text-lg text-gray-600">Aggregates active jobs from Remotive + Arbeitnow and filters out expired/old listings.</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              fetchJobs();
            }}
            className="grid md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              placeholder="Job title, company, or skill"
            />

            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                placeholder="City, country, or Remote"
              />
              {userLocation && (
                <button
                  type="button"
                  onClick={() => setLocation(userLocation)}
                  className="absolute inset-y-0 right-3 text-sm text-primary"
                >
                  Use my location
                </button>
              )}
            </div>

            <button type="submit" className="bg-primary text-white rounded-md px-6 py-3 hover:bg-secondary" disabled={loading}>
              {loading ? 'Searching...' : 'Search jobs'}
            </button>
          </form>
        </div>

        {error && <p className="mb-6 rounded bg-red-50 border border-red-200 p-4 text-red-700">{error}</p>}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>
      </div>
    </div>
  );
}
