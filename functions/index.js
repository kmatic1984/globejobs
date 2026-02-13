import { onRequest } from 'firebase-functions/v2/https';

const MAX_JOB_AGE_DAYS = 30;

const cleanHtml = (raw = '') => raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const isFreshJob = (postedDate) => {
  const posted = new Date(postedDate);
  if (Number.isNaN(posted.getTime())) return false;
  const ageMs = Date.now() - posted.getTime();
  return ageMs >= 0 && ageMs <= MAX_JOB_AGE_DAYS * 24 * 60 * 60 * 1000;
};

async function fetchRemotive() {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs');
    if (!res.ok) return { jobs: [], failed: true };

    const data = await res.json();
    return {
      failed: false,
      jobs: (data.jobs || []).map((job) => ({
        id: `remotive-${job.id}`,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location || 'Worldwide',
        description: cleanHtml(job.description),
        salary: job.salary || '',
        postedDate: job.publication_date,
        source: 'Remotive',
        applyUrl: job.url,
        tags: job.tags || [],
        remote: true,
      })),
    };
  } catch {
    return { jobs: [], failed: true };
  }
}

async function fetchArbeitnow() {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (!res.ok) return { jobs: [], failed: true };

    const data = await res.json();
    return {
      failed: false,
      jobs: (data.data || []).map((job) => ({
        id: `arbeitnow-${job.slug}`,
        title: job.title,
        company: job.company_name,
        location: job.location || (job.remote ? 'Remote' : 'Not specified'),
        description: cleanHtml(job.description),
        salary: '',
        postedDate: new Date(job.created_at * 1000).toISOString(),
        source: 'Arbeitnow',
        applyUrl: job.url,
        tags: job.tags || [],
        remote: Boolean(job.remote),
      })),
    };
  } catch {
    return { jobs: [], failed: true };
  }
}

function filterJobs(jobs, search, location, limit) {
  const q = search.toLowerCase();
  const loc = location.toLowerCase();

  return jobs
    .filter((job) => isFreshJob(job.postedDate))
    .filter((job) => {
      const qMatch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q));

      const locMatch =
        !loc ||
        job.location.toLowerCase().includes(loc) ||
        (job.remote && loc.includes('remote'));

      return qMatch && locMatch;
    })
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, limit);
}

export const jobsApi = onRequest({ region: 'us-central1' }, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed.' });
    return;
  }

  const search = (req.query.search || '').toString().trim();
  const location = (req.query.location || '').toString().trim();
  const rawLimit = (req.query.limit || '30').toString();
  const numericLimit = Number(rawLimit);

  if (Number.isNaN(numericLimit)) {
    res.status(400).json({ success: false, error: 'Invalid limit. Use a number between 1 and 100.' });
    return;
  }

  const limit = Math.min(Math.max(numericLimit, 1), 100);

  const [remotive, arbeitnow] = await Promise.all([fetchRemotive(), fetchArbeitnow()]);
  const jobs = filterJobs([...remotive.jobs, ...arbeitnow.jobs], search, location, limit);

  if (remotive.failed && arbeitnow.failed) {
    res.status(502).json({ success: false, error: 'All job providers are temporarily unavailable.' });
    return;
  }

  res.status(200).json({
    success: true,
    jobs,
    total: jobs.length,
    freshnessWindowDays: MAX_JOB_AGE_DAYS,
    partialData: remotive.failed || arbeitnow.failed,
  });
});
