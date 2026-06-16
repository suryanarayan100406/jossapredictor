import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [totalRecords, lastImport] = await Promise.all([
    prisma.cutoffRecord.count(),
    prisma.importLog.findFirst({ orderBy: { importedAt: 'desc' } }),
  ]);

  // Get distinct counts using raw queries for SQLite
  const institutes = await prisma.cutoffRecord.findMany({
    distinct: ['instituteName'],
    select: { instituteName: true },
  });

  const branches = await prisma.cutoffRecord.findMany({
    distinct: ['branch'],
    select: { branch: true },
  });

  const years = await prisma.cutoffRecord.findMany({
    distinct: ['year'],
    select: { year: true },
    orderBy: { year: 'asc' },
  });

  // Records by type
  const allRecords = await prisma.cutoffRecord.findMany({
    select: { instituteType: true, year: true, branch: true },
  });

  const recordsByType: Record<string, number> = {};
  const recordsByYear: Record<string, number> = {};
  const branchCounts: Record<string, number> = {};

  for (const r of allRecords) {
    recordsByType[r.instituteType] = (recordsByType[r.instituteType] || 0) + 1;
    recordsByYear[r.year.toString()] = (recordsByYear[r.year.toString()] || 0) + 1;
    branchCounts[r.branch] = (branchCounts[r.branch] || 0) + 1;
  }

  const topBranches = Object.entries(branchCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json({
    totalRecords,
    totalInstitutes: institutes.length,
    totalBranches: branches.length,
    yearsAvailable: years.map(y => y.year),
    lastImport: lastImport?.importedAt ?? null,
    recordsByType: Object.entries(recordsByType).map(([name, value]) => ({ name, value })),
    recordsByYear: Object.entries(recordsByYear).map(([name, value]) => ({ name, value })),
    topBranches,
  });
}
