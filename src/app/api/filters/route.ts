import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getInstituteLocation } from '@/lib/institute-states';

export async function GET() {
  const [branchesRaw, typesRaw, yearsRaw, categoriesRaw, quotasRaw, institutesRaw] = await Promise.all([
    prisma.cutoffRecord.findMany({ distinct: ['branch'], select: { branch: true }, orderBy: { branch: 'asc' } }),
    prisma.cutoffRecord.findMany({ distinct: ['instituteType'], select: { instituteType: true } }),
    prisma.cutoffRecord.findMany({ distinct: ['year'], select: { year: true }, orderBy: { year: 'desc' } }),
    prisma.cutoffRecord.findMany({ distinct: ['category'], select: { category: true } }),
    prisma.cutoffRecord.findMany({ distinct: ['quota'], select: { quota: true } }),
    prisma.cutoffRecord.findMany({ distinct: ['instituteName'], select: { instituteName: true }, orderBy: { instituteName: 'asc' } }),
  ]);

  // Derive states from institute names
  const statesSet = new Set<string>();
  for (const inst of institutesRaw) {
    const loc = getInstituteLocation(inst.instituteName);
    if (loc) statesSet.add(loc.state);
  }

  return NextResponse.json({
    branches: branchesRaw.map(b => b.branch),
    instituteTypes: typesRaw.map(t => t.instituteType),
    years: yearsRaw.map(y => y.year),
    categories: categoriesRaw.map(c => c.category),
    quotas: quotasRaw.map(q => q.quota),
    institutes: institutesRaw.map(i => i.instituteName),
    states: Array.from(statesSet).sort(),
  });
}
