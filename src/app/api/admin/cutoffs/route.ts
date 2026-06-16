import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
  const year = searchParams.get('year');
  const instituteType = searchParams.get('instituteType');
  const category = searchParams.get('category');
  const quota = searchParams.get('quota');
  const branch = searchParams.get('branch');

  const where: Record<string, unknown> = {};
  if (year) where.year = parseInt(year);
  if (instituteType) where.instituteType = instituteType;
  if (category) where.category = category;
  if (quota) where.quota = quota;
  if (branch) where.branch = { contains: branch };
  if (search) {
    where.OR = [
      { instituteName: { contains: search } },
      { branch: { contains: search } },
    ];
  }

  const [records, total] = await Promise.all([
    prisma.cutoffRecord.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.cutoffRecord.count({ where }),
  ]);

  return NextResponse.json({ records, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const record = await prisma.cutoffRecord.create({ data });
    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
