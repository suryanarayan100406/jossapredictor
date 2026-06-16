import { prisma } from '../src/lib/db';
import { parseCSV, alignBranch } from '../src/lib/csv-parser';
import * as fs from 'fs';
import * as path from 'path';

// Helper to determine quota from college type and state based on candidate's profile (UP resident)
function getQuota(collegeType: string, collegeState: string): string {
  const t = collegeType.toUpperCase();
  const state = collegeState.toLowerCase().trim();
  if (t === 'IIIT' || t === 'GFTI') return 'AI';
  if (state === 'uttar pradesh') return 'HS';
  return 'OS';
}

async function main() {
  console.log('🌱 Starting comprehensive data import...');

  // --- 1. Import CSV files from dataset folder ---
  const datasetDir = path.join(__dirname, '..', 'dataset');
  if (!fs.existsSync(datasetDir)) {
    console.error(`❌ Dataset directory not found at ${datasetDir}`);
    process.exit(1);
  }

  const csvFiles: string[] = [];
  function scanDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath);
      } else if (file.endsWith('.csv')) {
        csvFiles.push(fullPath);
      }
    }
  }
  scanDir(datasetDir);
  console.log(`Found ${csvFiles.length} CSV files in dataset folder.`);

  let totalCsvRecords = 0;
  const existingKeys = new Set<string>();
  
  // Clear the database cutoff entries first so we start fresh
  console.log('Clearing existing CutoffRecord database entries...');
  await prisma.cutoffRecord.deleteMany({});

  for (const filePath of csvFiles) {
    console.log(`\nProcessing CSV file: ${path.basename(filePath)}...`);
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const { valid, skipped, total } = parseCSV(csvContent);
    console.log(`Parsed ${total} rows. Valid: ${valid.length}, Skipped: ${skipped.length}`);

    // Track existing keys in memory to prevent duplicates from API
    for (const record of valid) {
      const key = `${record.year}-${record.round}-${record.instituteType}-${record.instituteName}-${record.branch}-${record.quota}-${record.category}-${record.gender}`.toLowerCase();
      existingKeys.add(key);
    }

    console.log(`Inserting ${valid.length} records in batches...`);
    const batchSize = 2000;
    let inserted = 0;

    for (let i = 0; i < valid.length; i += batchSize) {
      const batch = valid.slice(i, i + batchSize);
      await prisma.cutoffRecord.createMany({
        data: batch,
      });
      inserted += batch.length;
    }
    console.log(`Successfully imported ${inserted} records from ${path.basename(filePath)}.`);
    totalCsvRecords += inserted;
  }

  console.log(`\n✅ Completed CSV imports. Total records in DB: ${await prisma.cutoffRecord.count()}`);

  // --- 2. Scrape and merge data from the API URL ---
  console.log('\n📡 Fetching historical data from external API...');
  const apiUrl = 'https://4bifdwkvqi.execute-api.ap-south-1.amazonaws.com/default/collegePrediction/6916bc6dd3614120b34b9acc?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cnlhbmFyYXlhbjEwMDQwNkBnbWFpbC5jb20iLCJpYXQiOjE3ODE2MDMyMzAsImV4cCI6MTc4NDE5NTIzMH0.UMkryBFrfYTu8T6vpRZni7jeoO8Rssu1bzZEZXgtHWY&cutoffValue=1&name=Surya%20Narayan&email=suryanarayan100406@gmail.com&phoneNumber=undefined';
  
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    const responseJson = await res.json();
    console.log('API response message:', responseJson.message);
    
    const colleges = responseJson.data?.colleges || [];
    console.log(`API returned ${colleges.length} colleges.`);

    const apiRecords: any[] = [];
    let skippedApiBranches = 0;

    colleges.forEach((c: any) => {
      const instituteType = c.type.toUpperCase() === 'CFI' ? 'GFTI' : c.type.toUpperCase();
      const instituteName = c.title.trim();
      const state = c.state || '';
      
      const quota = getQuota(instituteType, state);
      
      (c.branches || []).forEach((b: any) => {
        const alignedBranch = alignBranch(b.title);
        if (!alignedBranch) {
          skippedApiBranches++;
          return;
        }

        (b.rounds || []).forEach((r: any) => {
          const year = parseInt(r.year, 10);
          const round = parseInt(r.round, 10);
          const openingRank = parseInt(r.opening, 10);
          const closingRank = parseInt(r.closing, 10);

          if (isNaN(year) || isNaN(round) || isNaN(closingRank) || closingRank <= 0) {
            return;
          }

          apiRecords.push({
            year,
            round,
            instituteType,
            instituteName,
            branch: alignedBranch,
            quota,
            category: 'OPEN', // API is filtered for Surya Narayan's profile
            gender: 'Gender-Neutral',
            openingRank: isNaN(openingRank) ? 0 : openingRank,
            closingRank,
          });
        });
      });
    });

    console.log(`Parsed ${apiRecords.length} historical records from API. (Skipped unaligned branches: ${skippedApiBranches})`);

    const filteredApiRecords = apiRecords.filter((record: any) => {
      const key = `${record.year}-${record.round}-${record.instituteType}-${record.instituteName}-${record.branch}-${record.quota}-${record.category}-${record.gender}`.toLowerCase();
      if (existingKeys.has(key)) {
        return false;
      }
      existingKeys.add(key);
      return true;
    });
    console.log(`Filtered out duplicates. Records to insert from API: ${filteredApiRecords.length}`);

    console.log('Inserting API records in batches...');
    const apiBatchSize = 2000;
    let apiInserted = 0;

    for (let i = 0; i < filteredApiRecords.length; i += apiBatchSize) {
      const batch = filteredApiRecords.slice(i, i + apiBatchSize);
      const result = await prisma.cutoffRecord.createMany({
        data: batch,
      });
      apiInserted += result.count;
    }
    console.log(`Successfully merged ${apiInserted} new historical records from API.`);

  } catch (error: any) {
    console.error('⚠️ Could not complete API scraping/merge:', error.message);
    console.log('Will proceed with the CSV database records only.');
  }

  // --- 3. Run validation and print final statistics ---
  const finalCount = await prisma.cutoffRecord.count();
  console.log('\n📊 FINAL DATABASE STATISTICS:');
  console.log(`Total Cutoff Records: ${finalCount}`);
  
  const yearsBreakdown = await prisma.cutoffRecord.groupBy({
    by: ['year'],
    _count: true,
  });
  console.log('Records by year:', yearsBreakdown);

  const roundsBreakdown = await prisma.cutoffRecord.groupBy({
    by: ['round'],
    _count: true,
  });
  console.log('Records by round:', roundsBreakdown);

  const typesBreakdown = await prisma.cutoffRecord.groupBy({
    by: ['instituteType'],
    _count: true,
  });
  console.log('Records by instituteType:', typesBreakdown);

  console.log('🎉 Data import and alignment complete successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Data import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
