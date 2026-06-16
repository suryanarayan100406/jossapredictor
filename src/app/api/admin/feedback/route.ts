import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ feedback });
}

export async function DELETE(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ids } = await request.json();
  if (ids && Array.isArray(ids)) {
    await prisma.feedback.deleteMany({ where: { id: { in: ids } } });
  } else if (id) {
    await prisma.feedback.delete({ where: { id } });
  }
  return NextResponse.json({ success: true });
}
