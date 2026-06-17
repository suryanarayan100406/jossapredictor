import { NextResponse } from 'next/server';
import { generateAdvisorGuidance } from '@/lib/algorithmic-guidance';
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

    // Validate inputs
    if (!input.rank || !input.rankType || !input.category || !input.homeState || !input.preferences || !input.recommendations) {
      return NextResponse.json({ error: 'Missing required fields: rank, rankType, category, homeState, preferences, recommendations' }, { status: 400 });
    }

    const rankVal = parseInt(input.rank, 10);
    if (isNaN(rankVal)) {
      return NextResponse.json({ error: 'Rank must be a valid number' }, { status: 400 });
    }

    // Generate cache key
    const cacheKey = `guidance:${rankVal}:${input.rankType}:${input.category}:${input.homeState}:${JSON.stringify(input.preferences)}:${input.recommendations.map((r: any) => `${r.id}-${r.chance}`).join(',')}`;

    // Try to get from Redis
    const cachedData = await cacheGet(cacheKey);
    if (cachedData) {
      return new NextResponse(cachedData, {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
        },
      });
    }

    // Generate guidance
    const guidance = generateAdvisorGuidance(
      rankVal,
      input.rankType,
      input.category,
      input.homeState,
      input.preferences,
      input.recommendations
    );

    const responsePayload = JSON.stringify(guidance);

    // Save to cache for 1 hour
    await cacheSet(cacheKey, responsePayload, 3600);

    return new NextResponse(responsePayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
      },
    });

  } catch (error) {
    console.error('Guidance API error:', error);
    return NextResponse.json({ error: 'Failed to generate guidance' }, { status: 500 });
  }
}
