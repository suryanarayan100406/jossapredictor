import prisma from './db';
import { getInstituteLocation } from './institute-states';
import { calculateProbability } from './utils';

export interface PredictionInput {
  rank: number;
  rankType: 'advanced' | 'main';
  category: string;
  pwdStatus: boolean;
  gender: string;
  homeState: string;
  branches: string[];
  instituteTypes: string[];
  year: number;
  round?: number;
}

export interface PredictionResult {
  id: number;
  year: number;
  round: number;
  instituteType: string;
  instituteName: string;
  branch: string;
  quota: string;
  category: string;
  gender: string;
  openingRank: number;
  closingRank: number;
  chance: 'safe' | 'moderate' | 'ambitious' | 'longshot';
  probability: number;
  instituteState: string;
  instituteCity: string;
}

export async function predictColleges(input: PredictionInput): Promise<{
  results: PredictionResult[];
  alternatives: PredictionResult[];
  totalMatched: number;
}> {
  // Get admin-tunable prediction thresholds
  const settings = await prisma.predictionSettings.findFirst();
  const safeThreshold = settings?.safeMultiplier ?? 0.90;
  const moderateThreshold = settings?.moderateMultiplier ?? 1.10;
  const ambitiousThreshold = settings?.ambitiousMultiplier ?? 1.30;

  // Build effective category (add PwD suffix if needed)
  let effectiveCategory = input.category;
  if (input.pwdStatus && !effectiveCategory.includes('PwD')) {
    effectiveCategory = `${effectiveCategory} (PwD)`;
  }

  // Determine institute types based on rank type
  let queryInstituteTypes: string[];
  if (input.instituteTypes.length > 0) {
    queryInstituteTypes = input.instituteTypes;
  } else {
    queryInstituteTypes = input.rankType === 'advanced'
      ? ['IIT']
      : ['NIT', 'IIIT', 'GFTI'];
  }

  // Find latest round for the year
  const latestRound = input.round ?? (await prisma.cutoffRecord.findFirst({
    where: { year: input.year },
    orderBy: { round: 'desc' },
    select: { round: true },
  }))?.round ?? 6;

  // Query matching records
  const where: Record<string, unknown> = {
    year: input.year,
    round: latestRound,
    instituteType: { in: queryInstituteTypes },
    category: effectiveCategory,
    gender: input.gender,
  };

  if (input.branches.length > 0) {
    where.branch = { in: input.branches };
  }

  const records = await prisma.cutoffRecord.findMany({
    where,
    orderBy: { closingRank: 'asc' },
  });

  const results: PredictionResult[] = [];
  const alternatives: PredictionResult[] = [];

  for (const record of records) {
    const location = getInstituteLocation(record.instituteName);
    const instituteState = location?.state ?? 'Unknown';
    const instituteCity = location?.city ?? '';

    // Quota matching: IITs use AI only; NITs use HS/OS logic
    if (record.instituteType === 'IIT') {
      if (record.quota !== 'AI') continue;
    } else {
      if (record.quota === 'HS' && input.homeState !== instituteState) continue;
      if (record.quota === 'OS' && input.homeState === instituteState) continue;
    }

    // Calculate chance band
    const R = input.rank;
    const C = record.closingRank;
    const ratio = R / C;

    let chance: 'safe' | 'moderate' | 'ambitious' | 'longshot';
    if (ratio <= safeThreshold) {
      chance = 'safe';
    } else if (ratio <= moderateThreshold) {
      chance = 'moderate';
    } else if (ratio <= ambitiousThreshold) {
      chance = 'ambitious';
    } else {
      chance = 'longshot';
    }

    const probability = calculateProbability(R, C);

    const result: PredictionResult = {
      id: record.id,
      year: record.year,
      round: record.round,
      instituteType: record.instituteType,
      instituteName: record.instituteName,
      branch: record.branch,
      quota: record.quota,
      category: record.category,
      gender: record.gender,
      openingRank: record.openingRank,
      closingRank: record.closingRank,
      chance,
      probability,
      instituteState,
      instituteCity,
    };

    if (chance !== 'longshot') {
      results.push(result);
    } else if (ratio <= 1.5) {
      alternatives.push(result);
    }
  }

  // Sort: safe > moderate > ambitious, each by closingRank
  const order = { safe: 0, moderate: 1, ambitious: 2, longshot: 3 };
  results.sort((a, b) => {
    if (order[a.chance] !== order[b.chance]) return order[a.chance] - order[b.chance];
    return a.closingRank - b.closingRank;
  });

  alternatives.sort((a, b) => a.closingRank - b.closingRank);

  return {
    results,
    alternatives: alternatives.slice(0, 10),
    totalMatched: results.length,
  };
}
