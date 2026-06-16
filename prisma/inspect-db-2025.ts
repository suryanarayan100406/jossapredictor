import { prisma } from '../src/lib/db';

async function main() {
  console.log('--- Inspecting 2025 Database Records ---');
  
  const total2025 = await prisma.cutoffRecord.count({ where: { year: 2025 } });
  console.log(`Total 2025 records: ${total2025}`);
  
  if (total2025 === 0) return;

  const rounds = await prisma.cutoffRecord.groupBy({
    by: ['round'],
    where: { year: 2025 },
    _count: true,
  });
  console.log('2025 Rounds:', rounds);

  const types = await prisma.cutoffRecord.groupBy({
    by: ['instituteType'],
    where: { year: 2025 },
    _count: true,
  });
  console.log('2025 Institute Types:', types);

  const categories = await prisma.cutoffRecord.groupBy({
    by: ['category'],
    where: { year: 2025 },
    _count: true,
  });
  console.log('2025 Categories:', categories.slice(0, 10));

  const genders = await prisma.cutoffRecord.groupBy({
    by: ['gender'],
    where: { year: 2025 },
    _count: true,
  });
  console.log('2025 Genders:', genders);

  const quotas = await prisma.cutoffRecord.groupBy({
    by: ['quota'],
    where: { year: 2025 },
    _count: true,
  });
  console.log('2025 Quotas:', quotas);

  // Let's print a few sample records
  const samples = await prisma.cutoffRecord.findMany({
    where: { year: 2025 },
    take: 5,
  });
  console.log('Sample 2025 Records:', JSON.stringify(samples, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
