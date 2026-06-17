import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/recommendation';
import { cacheGet, cacheSet } from '@/lib/redis';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!rateLimit(ip, 30, 60000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const input = await request.json();

    // Validate required fields
    if (!input.rank || !input.rankType || !input.category || !input.gender || !input.homeState || !input.preferences) {
      return NextResponse.json({ error: 'Missing required fields: rank, rankType, category, gender, homeState, preferences' }, { status: 400 });
    }

    const rankVal = parseInt(input.rank, 10);
    if (isNaN(rankVal) || rankVal < 1 || rankVal > 10000000) {
      return NextResponse.json({ error: 'Rank must be a valid number between 1 and 10,000,000' }, { status: 400 });
    }

    // Generate cache key
    const cacheKey = `recommend:${rankVal}:${input.rankType}:${input.category}:${input.pwdStatus || false}:${input.gender}:${input.homeState}:${input.year || 2025}:${JSON.stringify(input.preferences)}:${JSON.stringify(input.branches || [])}:${JSON.stringify(input.instituteTypes || [])}`;

    // Try to get from Redis cache
    const cachedData = await cacheGet(cacheKey);
    if (cachedData) {
      // Return cached results with a cache hit header
      return new NextResponse(cachedData, {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
        },
      });
    }

    // Call recommendation engine
    const results = await getRecommendations({
      rank: rankVal,
      rankType: input.rankType,
      category: input.category,
      pwdStatus: input.pwdStatus || false,
      gender: input.gender,
      homeState: input.homeState,
      branches: input.branches || [],
      instituteTypes: input.instituteTypes || [],
      year: input.year || 2025,
      preferences: input.preferences,
    });

    const responsePayload = JSON.stringify({
      ...results,
      disclaimer: 'Recommendations are computed dynamically based on your preferences and previous-year JoSAA cutoffs. Seat allotment is not guaranteed.',
    });

    // Save to Redis cache for 1 hour
    await cacheSet(cacheKey, responsePayload, 3600);

    return new NextResponse(responsePayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
      },
    });

  } catch (error: any) {
    console.error('Recommendation API error:', error);
    return NextResponse.json({ error: 'Failed to process recommendations' }, { status: 500 });
  }
}
