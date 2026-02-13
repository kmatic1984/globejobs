import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const PORT = Number(process.env.PORT || 3000);
const MAX_JOB_AGE_DAYS = 30;

const contentType = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

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
      const qMatch = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.tags.some((t) => t.toLowerCase().includes(q));
      const locMatch = !loc || job.location.toLowerCase().includes(loc) || (job.remote && loc.includes('remote'));
      return qMatch && locMatch;
    })
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, limit);
}

async function handleApiJobs(url, res) {
  const search = (url.searchParams.get('search') || '').trim();
  const location = (url.searchParams.get('location') || '').trim();
  const rawLimit = url.searchParams.get('limit') || '30';
  const numericLimit = Number(rawLimit);

  if (Number.isNaN(numericLimit)) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: false, error: 'Invalid limit. Use a number between 1 and 100.' }));
    return;
  }

  const limit = Math.min(Math.max(numericLimit, 1), 100);

  const [remotive, arbeitnow] = await Promise.all([fetchRemotive(), fetchArbeitnow()]);
  const jobs = filterJobs([...remotive.jobs, ...arbeitnow.jobs], search, location, limit);

  if (remotive.failed && arbeitnow.failed) {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: false, error: 'All job providers are temporarily unavailable.' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(
    JSON.stringify({
      success: true,
      jobs,
      total: jobs.length,
      freshnessWindowDays: MAX_JOB_AGE_DAYS,
      partialData: remotive.failed || arbeitnow.failed,
    })
  );
}

async function serveStatic(pathname, res) {
  const filePath = pathname === '/' ? join(process.cwd(), 'public/index.html') : join(process.cwd(), 'public', pathname);
  try {
    const file = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType[extname(filePath)] || 'text/plain; charset=utf-8' });
    res.end(file);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = createServer(async (req, res) => {
  if (!req.url || !req.headers.host) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: false, error: 'Malformed request.' }));
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed.' }));
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  if (url.pathname === '/api/jobs') return handleApiJobs(url, res);
  return serveStatic(url.pathname, res);
});

server.listen(PORT, () => {
  console.log(`GlobeJobs running on http://localhost:${PORT}`);
});
