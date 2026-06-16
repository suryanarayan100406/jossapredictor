import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const logs = await prisma.importLog.findMany({
    orderBy: { importedAt: 'desc' },
    include: { admin: { select: { email: true } } },
  });
  return NextResponse.json({ logs });
}
