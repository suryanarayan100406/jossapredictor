import { prisma } from '../src/lib/db';

async function main() {
  const count = await prisma.cutoffRecord.count();
  console.log('Total Cutoff Records in DB:', count);
  
  const years = await prisma.cutoffRecord.groupBy({
    by: ['year'],
    _count: true,
  });
  console.log('Records by year in DB:', years);

  const rounds = await prisma.cutoffRecord.groupBy({
    by: ['round'],
    _count: true,
  });
  console.log('Records by round in DB:', rounds);

  const types = await prisma.cutoffRecord.groupBy({
    by: ['instituteType'],
    _count: true,
  });
  console.log('Records by instituteType in DB:', types);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
