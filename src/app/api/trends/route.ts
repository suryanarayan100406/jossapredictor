import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instituteName = searchParams.get('instituteName');
  const branch = searchParams.get('branch');
  const category = searchParams.get('category') || 'OPEN';
  const gender = searchParams.get('gender') || 'Gender-Neutral';
  const quota = searchParams.get('quota') || 'AI';

  if (!instituteName || !branch) {
    return NextResponse.json({ error: 'instituteName and branch are required' }, { status: 400 });
  }

  const records = await prisma.cutoffRecord.findMany({
    where: { instituteName, branch, category, gender, quota },
    select: { year: true, round: true, closingRank: true, openingRank: true },
    orderBy: [{ year: 'asc' }, { round: 'asc' }],
  });

  return NextResponse.json({ trends: records });
}
