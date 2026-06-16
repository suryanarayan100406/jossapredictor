import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const where: Record<string, unknown> = {};
  const year = searchParams.get('year');
  const instituteType = searchParams.get('instituteType');
  if (year) where.year = parseInt(year);
  if (instituteType) where.instituteType = instituteType;

  const records = await prisma.cutoffRecord.findMany({ where, orderBy: { id: 'asc' } });

  const headers = ['year', 'round', 'type', 'institute', 'program', 'quota', 'category', 'gender', 'orank', 'crank'];
  const rows = records.map(r =>
    [r.year, r.round, r.instituteType, `"${r.instituteName}"`, `"${r.branch}"`, r.quota, `"${r.category}"`, `"${r.gender}"`, r.openingRank, r.closingRank].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="cutoffs_export_${Date.now()}.csv"`,
    },
  });
}
