import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const institutes = await prisma.institute.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json({ institutes });
}

export async function PUT(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const { id, ...updateData } = data;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const institute = await prisma.institute.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json({ success: true, institute });
}
