import prisma from './db';
import { getInstituteLocation } from './institute-states';
import { calculateProbability } from './utils';
import { RecommendationInput, RecommendationResult, CollegeProfile } from '../types';

export async function getRecommendations(input: RecommendationInput): Promise<{
  recommendations: RecommendationResult[];
  totalMatched: number;
}> {
  // 1. Fetch prediction settings
  const settings = await prisma.predictionSettings.findFirst();
  const safeThreshold = settings?.safeMultiplier ?? 0.90;
  const moderateThreshold = settings?.moderateMultiplier ?? 1.10;
  const ambitiousThreshold = settings?.ambitiousMultiplier ?? 1.30;

  // 2. Setup category and filters
  let effectiveCategory = input.category;
  if (input.pwdStatus && !effectiveCategory.includes('PwD')) {
    effectiveCategory = `${effectiveCategory} (PwD)`;
  }

  let queryInstituteTypes = input.instituteTypes;
  if (!queryInstituteTypes || queryInstituteTypes.length === 0) {
    queryInstituteTypes = input.rankType === 'advanced' ? ['IIT'] : ['NIT', 'IIIT', 'GFTI'];
  }

  // Find latest round
  let latestRound = 6;
  const roundCounts = await prisma.cutoffRecord.groupBy({
    by: ['round'],
    where: { year: input.year },
    _count: true,
  });
  if (roundCounts.length > 0) {
    const maxCount = Math.max(...roundCounts.map(r => r._count));
    const qualifyingRounds = roundCounts
      .filter(r => r._count >= maxCount * 0.5)
      .map(r => r.round);
    latestRound = Math.max(...qualifyingRounds);
  }

  // Query records
  const where: Record<string, any> = {
    year: input.year,
    round: latestRound,
    instituteType: { in: queryInstituteTypes },
    category: effectiveCategory,
    gender: input.gender,
  };

  if (input.branches && input.branches.length > 0) {
    where.branch = { in: input.branches };
  }

  const records = await prisma.cutoffRecord.findMany({
    where,
  });

  const allRecommendations: RecommendationResult[] = [];

  // Fetch all college profiles
  const profiles = await prisma.collegeProfile.findMany();
  const profileMap = new Map<string, CollegeProfile>();
  profiles.forEach(p => profileMap.set(p.instituteName, p as unknown as CollegeProfile));

  // Loop through all options
  for (const record of records) {
    const location = getInstituteLocation(record.instituteName);
    const instituteState = location?.state ?? 'Unknown';
    const instituteCity = location?.city ?? '';

    // Quota matching
    if (record.instituteType === 'IIT') {
      if (record.quota !== 'AI') continue;
    } else {
      if (record.quota === 'HS' && input.homeState !== instituteState) continue;
      if (record.quota === 'OS' && input.homeState === instituteState) continue;
    }

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

    // Filter out longshots for the Top 5 recommendations (recommend feasible options)
    if (chance === 'longshot') continue;

    const probability = calculateProbability(R, C);

    // Get or create default profile
    let profile = profileMap.get(record.instituteName) || null;

    // SCORING ALGORITHM
    // 1. Admission Score (30%) - safer options get higher scores
    const admissionScore = probability * 30;

    // 2. Preference Score (50%) - weighted average of slider ratings
    let preferenceScore = 0;
    const p = input.preferences;
    const totalWeight =
      p.placementWeight +
      p.codingCultureWeight +
      p.campusLifeWeight +
      p.hostelWeight +
      p.researchWeight +
      p.startupWeight +
      p.sportsWeight +
      p.technicalClubsWeight;

    if (totalWeight > 0) {
      let weightedRatingSum = 0;

      // Placement rating estimation
      let placementRating = 6; // default middle
      if (profile) {
        if (profile.avgPackage) {
          placementRating = Math.min(10, Math.max(1, profile.avgPackage / 2.5));
        } else if (profile.placementRate) {
          placementRating = Math.min(10, Math.max(1, profile.placementRate / 10));
        }
      }

      const collegeCoding = profile?.codingCulture ?? 5;
      const collegeCampusLife = profile?.campusLife ?? 5;
      const collegeHostel = profile?.hostelQuality ?? 5;
      const collegeResearch = profile?.researchFocus ?? 5;
      const collegeStartup = profile?.startupEcosystem ?? 5;
      const collegeSports = profile?.sportsFacilities ?? 5;
      const collegeClubs = profile?.technicalClubs ?? 5;

      weightedRatingSum += p.placementWeight * placementRating;
      weightedRatingSum += p.codingCultureWeight * collegeCoding;
      weightedRatingSum += p.campusLifeWeight * collegeCampusLife;
      weightedRatingSum += p.hostelWeight * collegeHostel;
      weightedRatingSum += p.researchWeight * collegeResearch;
      weightedRatingSum += p.startupWeight * collegeStartup;
      weightedRatingSum += p.sportsWeight * collegeSports;
      weightedRatingSum += p.technicalClubsWeight * collegeClubs;

      const avgRating = weightedRatingSum / totalWeight; // scale 1-10
      preferenceScore = (avgRating / 10) * 50; // scale 0-50
    } else {
      preferenceScore = 25; // default fallback
    }

    // 3. Prestige Score (20%) - based on NIRF and college type
    let prestigeScore = 0;
    // Type baseline (max 10 points)
    let typeBaseline = 3;
    if (record.instituteType === 'IIT') typeBaseline = 10;
    else if (record.instituteType === 'NIT') typeBaseline = 7;
    else if (record.instituteType === 'IIIT') typeBaseline = 6;

    // NIRF rank baseline (max 10 points)
    let nirfFactor = 4;
    if (profile?.nirfRank) {
      if (profile.nirfRank <= 10) nirfFactor = 10;
      else if (profile.nirfRank <= 30) nirfFactor = 8;
      else if (profile.nirfRank <= 50) nirfFactor = 7;
      else if (profile.nirfRank <= 100) nirfFactor = 5;
    } else if (record.instituteType === 'IIT') {
      nirfFactor = 8;
    } else if (record.instituteType === 'NIT') {
      nirfFactor = 5;
    }

    prestigeScore = typeBaseline + nirfFactor; // max 20 points

    const totalScore = Math.round(admissionScore + preferenceScore + prestigeScore);

    const recResult: RecommendationResult = {
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
      score: totalScore,
      scoreBreakdown: {
        admission: Math.round(admissionScore),
        preference: Math.round(preferenceScore),
        prestige: Math.round(prestigeScore),
      },
      profile,
    };

    allRecommendations.push(recResult);
  }

  // Sort by composite score descending, then by closingRank ascending
  allRecommendations.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.closingRank - b.closingRank;
  });

  return {
    recommendations: allRecommendations.slice(0, 5),
    totalMatched: allRecommendations.length,
  };
}
