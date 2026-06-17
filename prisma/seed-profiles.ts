import { prisma } from '../src/lib/db';
import { alignBranch } from '../src/lib/csv-parser';

// Map of institute name (from JoSAA DB) -> NIRF 2024 Engineering Rank
const NIRF_RANKS: Record<string, number> = {
  // IITs
  "Indian Institute of Technology Madras": 1,
  "Indian Institute of Technology Delhi": 2,
  "Indian Institute of Technology Bombay": 3,
  "Indian Institute of Technology Kanpur": 4,
  "Indian Institute of Technology Kharagpur": 5,
  "Indian Institute of Technology Roorkee": 6,
  "Indian Institute of Technology Guwahati": 7,
  "Indian Institute of Technology Hyderabad": 8,
  "Indian Institute of Technology Indore": 16,
  "Indian Institute of Technology BHU Varanasi": 10,
  "Indian Institute of Technology ISM Dhanbad": 15,
  "Indian Institute of Technology Gandhinagar": 18,
  "Indian Institute of Technology Ropar": 22,
  "Indian Institute of Technology Patna": 34,
  "Indian Institute of Technology Bhubaneswar": 54,
  "Indian Institute of Technology Mandi": 31,
  "Indian Institute of Technology Jodhpur": 28,
  "Indian Institute of Technology Tirupati": 59,
  "Indian Institute of Technology Bhilai": 73,
  "Indian Institute of Technology Goa": 90,
  "Indian Institute of Technology Jammu": 62,
  "Indian Institute of Technology Dharwad": 94,
  "Indian Institute of Technology Palakkad": 64,

  // NITs
  "National Institute of Technology, Tiruchirappalli": 21,
  "National Institute of Technology Karnataka, Surathkal": 12,
  "National Institute of Technology Rourkela": 19,
  "Motilal Nehru National Institute of Technology Allahabad": 49,
  "National Institute of Technology Warangal": 21,
  "Malaviya National Institute of Technology Jaipur": 37,
  "Visvesvaraya National Institute of Technology Nagpur": 43,
  "National Institute of Technology Calicut": 23,
  "National Institute of Technology Silchar": 40,
  "National Institute of Technology Durgapur": 43,
  "National Institute of Technology Kurukshetra": 58,
  "National Institute of Technology Jamshedpur": 79,
  "Sardar Vallabhbhai National Institute of Technology Surat": 65,
  "National Institute of Technology, Patna": 55,
  "National Institute of Technology, Raipur": 70,
  "National Institute of Technology, Srinagar": 82,
  "Maulana Azad National Institute of Technology Bhopal": 80,
  "Dr. B R Ambedkar National Institute of Technology Jalandhar": 46,
  "National Institute of Technology Meghalaya": 72,
  "National Institute of Technology Goa": 90,
  "National Institute of Technology Agartala": 91,
  "National Institute of Technology, Manipur": 95,
  
  // IIITs
  "Atal Bihari Vajpayee Indian Institute of Information Technology & Management Gwalior": 88,
  "Indian Institute of Information Technology, Allahabad": 89,
  "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur": 97,
  "Indian Institute of Information Technology, Design and Manufacturing, Kancheepuram": 101,
};

// Map of institute name -> established year
const ESTABLISHED_YEARS: Record<string, number> = {
  "Indian Institute of Technology Kharagpur": 1951,
  "Indian Institute of Technology Bombay": 1958,
  "Indian Institute of Technology Madras": 1959,
  "Indian Institute of Technology Kanpur": 1959,
  "Indian Institute of Technology Delhi": 1961,
  "Indian Institute of Technology Guwahati": 1994,
  "Indian Institute of Technology Roorkee": 1847,
  "Indian Institute of Technology BHU Varanasi": 1919,
  "Indian Institute of Technology ISM Dhanbad": 1926,
  "Indian Institute of Technology Hyderabad": 2008,
  "Indian Institute of Technology Indore": 2009,
  "Indian Institute of Technology Patna": 2008,
  "Indian Institute of Technology Ropar": 2008,
  "Indian Institute of Technology Bhubaneswar": 2008,
  "Indian Institute of Technology Gandhinagar": 2008,
  "Indian Institute of Technology Jodhpur": 2008,
  "Indian Institute of Technology Mandi": 2009,
  "Indian Institute of Technology Tirupati": 2015,
  "Indian Institute of Technology Palakkad": 2015,
  "Indian Institute of Technology Bhilai": 2016,
  "Indian Institute of Technology Dharwad": 2016,
  "Indian Institute of Technology Jammu": 2016,
  "Indian Institute of Technology Goa": 2016,

  "National Institute of Technology, Tiruchirappalli": 1964,
  "National Institute of Technology Karnataka, Surathkal": 1960,
  "National Institute of Technology Warangal": 1959,
  "National Institute of Technology Rourkela": 1961,
  "Motilal Nehru National Institute of Technology Allahabad": 1961,
  "Malaviya National Institute of Technology Jaipur": 1963,
  "Visvesvaraya National Institute of Technology Nagpur": 1960,
  "National Institute of Technology Calicut": 1961,
  "National Institute of Technology Silchar": 1967,
  "National Institute of Technology Durgapur": 1960,
  "National Institute of Technology Kurukshetra": 1963,
  "National Institute of Technology Jamshedpur": 1960,
  "Sardar Vallabhbhai National Institute of Technology Surat": 1961,
  "National Institute of Technology, Patna": 1886,
  "National Institute of Technology, Raipur": 1956,
  "National Institute of Technology, Srinagar": 1960,
  "Maulana Azad National Institute of Technology Bhopal": 1960,
  "Dr. B R Ambedkar National Institute of Technology Jalandhar": 1987,
  "National Institute of Technology Meghalaya": 2010,
  "National Institute of Technology Goa": 2010,
  "National Institute of Technology Agartala": 1965,
};

async function fetchFromApi(cutoff: number): Promise<any[]> {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cnlhbmFyYXlhbjEwMDQwNkBnbWFpbC5jb20iLCJpYXQiOjE3ODE2MDMyMzAsImV4cCI6MTc4NDE5NTIzMH0.UMkryBFrfYTu8T6vpRZni7jeoO8Rssu1bzZEZXgtHWY';
  const url = `https://4bifdwkvqi.execute-api.ap-south-1.amazonaws.com/default/collegePrediction/6916bc6dd3614120b34b9acc?token=${token}&cutoffValue=${cutoff}&name=Surya%20Narayan&email=suryanarayan100406@gmail.com&phoneNumber=undefined`;
  
  console.log(`📡 Fetching API for cutoffValue = ${cutoff}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`⚠️ API responded with status ${res.status}`);
      return [];
    }
    const json = await res.json();
    return json.data?.colleges || [];
  } catch (err: any) {
    console.error(`❌ Error fetching API for cutoff ${cutoff}:`, err.message);
    return [];
  }
}

async function main() {
  console.log('🌱 Starting College Profile Seeding & Scraping...');

  // Get all unique institutes in the CutoffRecord table
  const records = await prisma.cutoffRecord.findMany({
    select: { instituteName: true, instituteType: true },
    distinct: ['instituteName'],
  });
  
  console.log(`Found ${records.length} unique institutes in local CutoffRecord database.`);

  const scrapedData = new Map<string, {
    logoUrl: string;
    imageUrl: string;
    avgPackage?: number;
    highestPackage?: number;
    placementRate?: number;
  }>();

  // We sample multiple ranks to cover IITs (low ranks) and NITs/IIITs/GFTIs (higher ranks)
  const cutoffsToScrape = [100, 1000, 5000, 15000, 30000, 60000, 100000];
  
  for (const cutoff of cutoffsToScrape) {
    const colleges = await fetchFromApi(cutoff);
    console.log(`Scraped ${colleges.length} colleges for cutoff ${cutoff}.`);

    colleges.forEach((c: any) => {
      const name = c.title.trim();
      
      // Calculate average package across all branches
      let totalPkg = 0;
      let pkgCount = 0;
      let placementRateSum = 0;
      let placementRateCount = 0;
      
      (c.branches || []).forEach((b: any) => {
        (b.placementDetails || []).forEach((p: any) => {
          const avg = parseFloat(p.avgPackage);
          if (!isNaN(avg) && avg > 0) {
            totalPkg += avg;
            pkgCount++;
          }
          const rate = parseFloat(p.placementRate);
          if (!isNaN(rate) && rate > 0) {
            placementRateSum += rate;
            placementRateCount++;
          }
        });
      });

      // Parse highest package for the college
      let highestPkg: number | undefined = undefined;
      if (c.highestPackage) {
        const parsedHighest = parseFloat(c.highestPackage.replace(/[^\d.]/g, ''));
        if (!isNaN(parsedHighest)) {
          highestPkg = parsedHighest;
        }
      }

      const avgPkg = pkgCount > 0 ? totalPkg / pkgCount : undefined;
      const placementRate = placementRateCount > 0 ? placementRateSum / placementRateCount : undefined;

      // Update map if we don't have this college or if we got better placement details
      const existing = scrapedData.get(name);
      scrapedData.set(name, {
        logoUrl: c.logo || existing?.logoUrl || '',
        imageUrl: c.image || existing?.imageUrl || '',
        avgPackage: avgPkg || existing?.avgPackage,
        highestPackage: highestPkg || existing?.highestPackage,
        placementRate: placementRate || existing?.placementRate,
      });
    });
  }

  console.log(`Scraped metadata for ${scrapedData.size} colleges from AWS API.`);

  // Create or Update profiles for all institutes in the DB
  let created = 0;
  let updated = 0;

  for (const record of records) {
    const name = record.instituteName;
    const type = record.instituteType;
    const scraped = scrapedData.get(name);

    // Default ratings based on college tier/type
    let codingCulture = 5;
    let technicalClubs = 5;
    let hackathonCulture = 5;
    let campusLife = 5;
    let hostelQuality = 5;
    let sportsFacilities = 5;
    let researchFocus = 5;
    let startupEcosystem = 5;

    if (type === 'IIT') {
      codingCulture = 9;
      technicalClubs = 9;
      hackathonCulture = 9;
      campusLife = 9;
      hostelQuality = 7;
      sportsFacilities = 8;
      researchFocus = 9;
      startupEcosystem = 9;
    } else if (type === 'NIT') {
      const isTopNIT = ["National Institute of Technology, Tiruchirappalli", "National Institute of Technology Karnataka, Surathkal", "National Institute of Technology Warangal"].includes(name);
      codingCulture = isTopNIT ? 8 : 7;
      technicalClubs = isTopNIT ? 8 : 7;
      hackathonCulture = isTopNIT ? 8 : 7;
      campusLife = isTopNIT ? 8 : 7;
      hostelQuality = 6;
      sportsFacilities = 7;
      researchFocus = 7;
      startupEcosystem = isTopNIT ? 7 : 6;
    } else if (type === 'IIIT') {
      // IIITs have very strong coding culture but smaller campus life/sports
      codingCulture = 9;
      technicalClubs = 8;
      hackathonCulture = 8;
      campusLife = 6;
      hostelQuality = 7;
      sportsFacilities = 5;
      researchFocus = 7;
      startupEcosystem = 6;
    } else {
      // GFTI
      codingCulture = 6;
      technicalClubs = 6;
      hackathonCulture = 6;
      campusLife = 6;
      hostelQuality = 5;
      sportsFacilities = 6;
      researchFocus = 5;
      startupEcosystem = 5;
    }

    const state = name.includes('IIT') ? 'AI' : ''; // Home state filled dynamically in predictions if needed

    await prisma.collegeProfile.upsert({
      where: { instituteName: name },
      update: {
        logoUrl: scraped?.logoUrl || '',
        imageUrl: scraped?.imageUrl || '',
        avgPackage: scraped?.avgPackage || null,
        highestPackage: scraped?.highestPackage || null,
        placementRate: scraped?.placementRate || null,
        nirfRank: NIRF_RANKS[name] || null,
        established: ESTABLISHED_YEARS[name] || null,
      },
      create: {
        instituteName: name,
        instituteType: type,
        state: 'Unknown', // Will be filled below
        city: 'Unknown',
        logoUrl: scraped?.logoUrl || '',
        imageUrl: scraped?.imageUrl || '',
        avgPackage: scraped?.avgPackage || null,
        highestPackage: scraped?.highestPackage || null,
        placementRate: scraped?.placementRate || null,
        codingCulture,
        technicalClubs,
        hackathonCulture,
        campusLife,
        hostelQuality,
        sportsFacilities,
        researchFocus,
        startupEcosystem,
        nirfRank: NIRF_RANKS[name] || null,
        established: ESTABLISHED_YEARS[name] || null,
        website: '',
        description: `${name} is a premier engineering institution of type ${type} in India.`,
      },
    });

    created++;
  }

  // Backfill state and city from existing Institute data where available
  const institutes = await prisma.institute.findMany();
  for (const inst of institutes) {
    await prisma.collegeProfile.updateMany({
      where: { instituteName: inst.name },
      data: {
        state: inst.state,
        city: inst.city,
        website: inst.website,
        logoUrl: inst.logoUrl || undefined,
      },
    });
  }

  console.log(`✅ Seeded ${created} college profiles in database.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding college profiles failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
