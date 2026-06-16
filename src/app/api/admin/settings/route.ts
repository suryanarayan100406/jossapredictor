import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let settings = await prisma.predictionSettings.findFirst();
  if (!settings) {
    settings = await prisma.predictionSettings.create({
      data: { safeMultiplier: 0.90, moderateMultiplier: 1.10, ambitiousMultiplier: 1.30 },
    });
  }
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const { safeMultiplier, moderateMultiplier, ambitiousMultiplier } = data;

  if ([safeMultiplier, moderateMultiplier, ambitiousMultiplier].some(v => v < 0 || v > 2)) {
    return NextResponse.json({ error: 'Values must be between 0 and 2' }, { status: 400 });
  }

  let settings = await prisma.predictionSettings.findFirst();
  if (settings) {
    settings = await prisma.predictionSettings.update({
      where: { id: settings.id },
      data: { safeMultiplier, moderateMultiplier, ambitiousMultiplier },
    });
  } else {
    settings = await prisma.predictionSettings.create({
      data: { safeMultiplier, moderateMultiplier, ambitiousMultiplier },
    });
  }
  return NextResponse.json({ success: true, settings });
}
