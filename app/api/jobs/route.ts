import { NextResponse } from 'next/server';
import { jobService } from '@/lib/services/jobService';
import { JobSearchParams } from '@/app/types';
import { rateLimit } from '@/lib/rate-limit';
import { getToken } from 'next-auth/jwt';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 requests per interval
});

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const { isRateLimited, limit, remaining } = await limiter.check(10, identifier); // 10 requests per minute

    // Set rate limit headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', limit.toString());
    headers.set('X-RateLimit-Remaining', remaining.toString());

    if (isRateLimited) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        { status: 429, headers }
      );
    }

    // Get query parameters with type validation
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const location = searchParams.get('location')?.trim() || '';
    const limitParam = searchParams.get('limit');
    const limit = Math.min(parseInt(limitParam || '25', 10) || 25, 50);

    // Validate input
    if (search.length > 100) {
      return NextResponse.json(
        { error: 'Search query is too long' },
        { status: 400, headers }
      );
    }

    // Get user session if available
    const session = await getToken({ req: request as any });
    
    // Log the search for analytics (in production, you'd want to store this in a database)
    if (process.env.NODE_ENV === 'production') {
      console.log(`Job search: ${search} in ${location} (user: ${session?.email || 'anonymous'})`);
    }

    // Fetch jobs from job boards
    const searchParams: JobSearchParams = {
      query: search,
      location: location,
      limit,
      userId: session?.sub, // Pass user ID for personalized results if needed
    };

    const { jobs, total, error } = await jobService.searchJobs(searchParams);

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch jobs' },
        { status: error.status || 500, headers }
      );
    }

    // Add cache control headers
    headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        data: { 
          jobs, 
          total,
          page: 1,
          limit,
          hasMore: total > limit
        } 
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error in jobs API route:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'An unexpected error occurred' 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS preflight
// This is important for API routes that might be called from the browser
export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return new NextResponse(null, { status: 204, headers });
}
