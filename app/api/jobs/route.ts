import { NextRequest, NextResponse } from 'next/server';
import { Job } from '@/app/types';

const MAX_JOB_AGE_DAYS = 30;

type RemotiveResponse = {
  jobs: Array<{
    id: number;
    title: string;
    company_name: string;
    candidate_required_location: string;
    description: string;
    publication_date: string;
    salary?: string;
    url: string;
    company_logo_url?: string;
    tags?: string[];
  }>;
};

type ArbeitnowResponse = {
  data: Array<{
    slug: string;
    title: string;
    company_name: string;
    location: string;
    description: string;
    created_at: number;
    remote: boolean;
    tags: string[];
    url: string;
    company_logo?: string;
  }>;
};

const isFreshJob = (postedDate: string) => {
  const posted = new Date(postedDate);
  if (Number.isNaN(posted.getTime())) return false;
  const ageMs = Date.now() - posted.getTime();
  return ageMs >= 0 && ageMs <= MAX_JOB_AGE_DAYS * 24 * 60 * 60 * 1000;
};

const normalize = (jobs: Job[], query: string, location: string, limit: number) => {
  const lowerQuery = query.toLowerCase();
  const lowerLocation = location.toLowerCase();

  return jobs
    .filter((job) => isFreshJob(job.postedDate))
    .filter((job) => {
      const q = lowerQuery.length === 0
        || job.title.toLowerCase().includes(lowerQuery)
        || job.company.toLowerCase().includes(lowerQuery)
        || job.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));

      const locationMatch = lowerLocation.length === 0
        || job.location.toLowerCase().includes(lowerLocation)
        || (job.remote && lowerLocation.includes('remote'));

      return q && locationMatch;
    })
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, limit);
};

const fetchRemotiveJobs = async (): Promise<Job[]> => {
  const response = await fetch('https://remotive.com/api/remote-jobs', {
    next: { revalidate: 1800 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as RemotiveResponse;

  return data.jobs.map((job) => ({
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || 'Worldwide',
    description: job.description.replace(/<[^>]+>/g, ' ').trim(),
    salary: job.salary || undefined,
    postedDate: job.publication_date,
    source: 'Remotive',
    logo: job.company_logo_url,
    applyUrl: job.url,
    tags: job.tags || [],
    remote: true,
  }));
};

const fetchArbeitnowJobs = async (): Promise<Job[]> => {
  const response = await fetch('https://www.arbeitnow.com/api/job-board-api', {
    next: { revalidate: 1800 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as ArbeitnowResponse;

  return data.data.map((job) => ({
    id: `arbeitnow-${job.slug}`,
    title: job.title,
    company: job.company_name,
    location: job.location || (job.remote ? 'Remote' : 'Not specified'),
    description: job.description.replace(/<[^>]+>/g, ' ').trim(),
    postedDate: new Date(job.created_at * 1000).toISOString(),
    source: 'Arbeitnow',
    logo: job.company_logo,
    applyUrl: job.url,
    tags: job.tags,
    remote: job.remote,
  }));
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('search')?.trim() || '';
  const location = searchParams.get('location')?.trim() || '';
  const limit = Math.min(Number(searchParams.get('limit') || '30'), 60);

  try {
    const [remotive, arbeitnow] = await Promise.all([
      fetchRemotiveJobs(),
      fetchArbeitnowJobs(),
    ]);

    const jobs = normalize([...remotive, ...arbeitnow], query, location, limit);

    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
      freshnessWindowDays: MAX_JOB_AGE_DAYS,
    });
  } catch (error) {
    console.error('Unable to fetch jobs', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load job feeds. Please try again shortly.',
      },
      { status: 502 }
    );
  }
}
