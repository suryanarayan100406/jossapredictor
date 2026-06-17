import { RecommendationResult, AlgorithmicAdvisorGuidance, PreferenceWeights } from '../types';

export function generateAdvisorGuidance(
  rank: number,
  rankType: 'advanced' | 'main',
  category: string,
  homeState: string,
  preferences: PreferenceWeights,
  recommendations: RecommendationResult[]
): AlgorithmicAdvisorGuidance {
  if (recommendations.length === 0) {
    return {
      overview: "No matching recommendations found for your input. Try expanding your branch filters or checking if your rank aligns with the selected category.",
      branchVsCollege: "Consider looking at secondary rounds or alternative branches.",
      highlights: ["No options met the threshold."],
      tips: ["Review your eligibility rank.", "Check if you have selected the correct category."]
    };
  }

  const bestOption = recommendations[0];
  const safeCount = recommendations.filter(r => r.chance === 'safe').length;
  const moderateCount = recommendations.filter(r => r.chance === 'moderate').length;
  const ambitiousCount = recommendations.filter(r => r.chance === 'ambitious').length;

  // 1. Overview text
  let overview = `Based on your rank of **${rank}** (${rankType === 'advanced' ? 'JEE Advanced' : 'JEE Main'}), we analyzed the historical cutoffs and identified ${recommendations.length} high-compatibility options matching your profile. `;
  overview += `Our analysis shows a balanced distribution: **${safeCount} Safe**, **${moderateCount} Moderate**, and **${ambitiousCount} Ambitious** choices. `;
  overview += `Your top-scored match is **${bestOption.instituteName}** offering **${bestOption.branch}**, which scores **${bestOption.score}/100** on your preference profile.`;

  // 2. Branch vs College analysis
  let branchVsCollege = "";
  const codingWeight = preferences.codingCultureWeight;
  const placementWeight = preferences.placementWeight;
  const researchWeight = preferences.researchWeight;

  const hasCSEinRecs = recommendations.some(r => r.branch.toLowerCase().includes('computer science') || r.branch.toLowerCase().includes('information technology'));
  const hasCoreinRecs = recommendations.some(r => r.branch.toLowerCase().includes('civil') || r.branch.toLowerCase().includes('metallurg') || r.branch.toLowerCase().includes('chemical'));

  if (codingWeight >= 8 || placementWeight >= 8) {
    if (hasCSEinRecs && hasCoreinRecs) {
      branchVsCollege = `**Branch-First Strategy Recommended**: Because you prioritized placement packages and coding culture, choosing a branch-focused path is highly advised. An NIT or IIIT offering a Computer Science (CSE) or Electronics (ECE) program will yield significantly better immediate career opportunities than a core or metallurgical branch at a higher-tier IIT.`;
    } else {
      branchVsCollege = `**Specialized Focus**: Your preference weights strongly favor industry placements. Focus your choice list entirely on CSE, IT, and software-allied branches. These options align best with your career objectives.`;
    }
  } else if (researchWeight >= 8) {
    const iitOption = recommendations.find(r => r.instituteType === 'IIT');
    if (iitOption) {
      branchVsCollege = `**College-First (Prestige) Strategy Recommended**: Given your focus on research and academic depth, we recommend prioritizing elite college brands like **${iitOption.instituteName}**, even if you have to choose a core branch. The research infrastructure, alumni network, and global prestige of IITs open unparalleled doors for MS, PhD, and R&D roles.`;
    } else {
      branchVsCollege = `**Research Focus**: Prioritize older, established NITs like Trichy, Surathkal, or Warangal. These institutes have deep funding, advanced lab facilities, and strong research departments compared to newer established colleges.`;
    }
  } else {
    branchVsCollege = `**Balanced Approach**: Your preferences are well-rounded. A recommended order is to prioritize CSE/ECE at Top-Tier NITs (like Trichy, Surathkal, Warangal, Allahabad) first, followed by Core/Electrical branches at Mid-Tier IITs. This ensures a solid brand name while maintaining strong career options.`;
  }

  // 3. Highlights
  const highlights: string[] = [];
  
  // Placement Highlight
  const topPlacementCollege = recommendations.find(r => r.profile?.avgPackage && r.profile.avgPackage > 0);
  if (topPlacementCollege && topPlacementCollege.profile && topPlacementCollege.profile.avgPackage) {
    highlights.push(`**Placement Hub**: **${topPlacementCollege.instituteName}** has an average package of **${topPlacementCollege.profile.avgPackage.toFixed(1)} LPA** with a placement rate of **${topPlacementCollege.profile.placementRate?.toFixed(1) || 'N/A'}%**.`);
  }

  // Coding Culture Highlight
  const topCodingCollege = recommendations.find(r => r.profile?.codingCulture && r.profile.codingCulture >= 8);
  if (topCodingCollege && topCodingCollege.profile) {
    highlights.push(`**Superb Coding Culture**: **${topCodingCollege.instituteName}** features a thriving coding environment (rated **${topCodingCollege.profile.codingCulture}/10**) with high hackathon participation.`);
  }

  // Campus Life / Hostel Highlight
  const topLifeCollege = recommendations.find(r => r.profile?.campusLife && r.profile.campusLife >= 8);
  if (topLifeCollege && topLifeCollege.profile) {
    highlights.push(`**Vibrant Campus Life**: **${topLifeCollege.instituteName}** offers excellent student life and facilities (hostels rated **${topLifeCollege.profile.hostelQuality}/10**).`);
  }

  // Fallback if not enough highlights
  if (highlights.length < 2) {
    highlights.push(`**NIRF Rated**: **${bestOption.instituteName}** holds a prominent national position (NIRF Rank: **${bestOption.profile?.nirfRank || 'Top 50'}**).`);
  }

  // 4. Actionable tips
  const tips: string[] = [];

  // Tip 1: Counseling Locking Order
  const ambitiousOption = recommendations.find(r => r.chance === 'ambitious');
  if (ambitiousOption) {
    tips.push(`**Locking Order**: Always place your Ambitious choice (**${ambitiousOption.instituteName} - ${ambitiousOption.branch}**) higher in the JoSAA preference list than Safe options. A safer option locked above an ambitious one will lock you out of the latter.`);
  } else {
    tips.push(`**Preference Ordering**: Arrange your choices strictly in descending order of your preference. Do not guess seat allotments when creating the sequence.`);
  }

  // Tip 2: Quota utilization
  const hsOption = recommendations.find(r => r.quota === 'HS');
  if (hsOption) {
    tips.push(`**Home State Quota**: You have a significant cutoff advantage at **${hsOption.instituteName}** under the **Home State (HS)** quota. Leverage this to secure a superior branch.`);
  }

  // Tip 3: Dual Degree warning
  const hasDualDegree = recommendations.some(r => r.branch.toLowerCase().includes('5 years') || r.branch.toLowerCase().includes('dual'));
  if (hasDualDegree) {
    tips.push(`**Dual Degree Check**: Some of your matched options are 5-year Integrated/Dual Degree programs. Verify the extra year fee structure and course timeline before finalizing.`);
  }

  // Tip 4: Branch Change
  tips.push(`**Branch Change Policy**: If choosing a lower-ranked branch at an elite college (e.g. Metallurgy or Ocean Eng) with the goal of sliding to CSE, keep in mind that most IITs/NITs require a CGPA > 8.5–9.0 in the first year, which is highly competitive.`);

  return {
    overview,
    branchVsCollege,
    highlights,
    tips
  };
}
