import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function DELETE(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    let deleted = 0;

    if (body.ids && Array.isArray(body.ids)) {
      const result = await prisma.cutoffRecord.deleteMany({
        where: { id: { in: body.ids } },
      });
      deleted = result.count;
    } else if (body.filter) {
      const where: Record<string, unknown> = {};
      if (body.filter.year) where.year = body.filter.year;
      if (body.filter.instituteType) where.instituteType = body.filter.instituteType;
      const result = await prisma.cutoffRecord.deleteMany({ where });
      deleted = result.count;
    } else {
      return NextResponse.json({ error: 'Provide ids or filter' }, { status: 400 });
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: 'Failed to delete records' }, { status: 500 });
  }
}
