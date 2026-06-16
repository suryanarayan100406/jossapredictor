import { prisma } from '../src/lib/db';
import { parseCSV } from '../src/lib/csv-parser';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🌱 Starting CSV seeding...');
  
  const csvPath = 'C:\\Users\\samai\\Downloads\\888496d5-9ade-4aa3-92e1-60d853826eb6.csv';
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at ${csvPath}`);
    process.exit(1);
  }

  console.log(`Reading CSV file from ${csvPath}...`);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  console.log('Parsing CSV content...');
  const { valid, skipped, total } = parseCSV(csvContent);

  console.log(`Parsed ${total} rows. Valid: ${valid.length}, Skipped: ${skipped.length}`);
  if (skipped.length > 0) {
    console.log(`Skipped details (first 5):`, skipped.slice(0, 5));
  }

  console.log('Clearing existing CutoffRecord database entries...');
  await prisma.cutoffRecord.deleteMany({});

  console.log('Inserting records in batches...');
  const batchSize = 1000;
  let inserted = 0;

  for (let i = 0; i < valid.length; i += batchSize) {
    const batch = valid.slice(i, i + batchSize);
    await prisma.cutoffRecord.createMany({
      data: batch,
    });
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${valid.length} records...`);
  }

  console.log('🎉 CSV Seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('❌ CSV Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
