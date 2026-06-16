import { NextResponse } from 'next/server';
import { predictColleges } from '@/lib/prediction';
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
    if (!input.rank || !input.rankType || !input.category || !input.gender || !input.homeState) {
      return NextResponse.json({ error: 'Missing required fields: rank, rankType, category, gender, homeState' }, { status: 400 });
    }

    if (input.rank < 1 || input.rank > 10000000) {
      return NextResponse.json({ error: 'Rank must be between 1 and 10,000,000' }, { status: 400 });
    }

    const prediction = await predictColleges({
      rank: parseInt(input.rank),
      rankType: input.rankType,
      category: input.category,
      pwdStatus: input.pwdStatus || false,
      gender: input.gender,
      homeState: input.homeState,
      branches: input.branches || [],
      instituteTypes: input.instituteTypes || [],
      year: input.year || 2025,
      round: input.round,
    });

    return NextResponse.json({
      ...prediction,
      disclaimer: 'Predictions are estimates based on previous-year JoSAA cutoffs and are not guarantees. Actual cutoffs may vary.',
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: 'Prediction failed' }, { status: 500 });
  }
}
