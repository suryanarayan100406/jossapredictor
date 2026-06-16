import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getInstituteLocation } from '@/lib/institute-states';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsStr = searchParams.get('ids') || '';
  if (!idsStr) {
    return NextResponse.json({ records: [] });
  }

  const ids = idsStr.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
  if (ids.length === 0) {
    return NextResponse.json({ records: [] });
  }

  try {
    // Fetch cutoff records
    const records = await prisma.cutoffRecord.findMany({
      where: { id: { in: ids } },
    });

    // Fetch corresponding institute details
    const instituteNames = Array.from(new Set(records.map(r => r.instituteName)));
    const institutes = await prisma.institute.findMany({
      where: { name: { in: instituteNames } },
    });

    // Combine data
    const compareData = records.map(record => {
      const inst = institutes.find(i => i.name === record.instituteName);
      const loc = getInstituteLocation(record.instituteName);
      return {
        ...record,
        state: inst?.state || loc?.state || 'Unknown',
        city: inst?.city || loc?.city || '',
        website: inst?.website || '',
        nirfRank: inst?.nirfRank || null,
        logoUrl: inst?.logoUrl || '',
      };
    });

    return NextResponse.json({ records: compareData });
  } catch (error) {
    console.error('Compare API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve comparison data' }, { status: 500 });
  }
}
