import { predictColleges } from '../src/lib/prediction';

async function runTest() {
  console.log('🧪 Testing Prediction Engine...');

  // Query for JEE Advanced (IIT) rank
  console.log('\n--- Test Case 1: IIT (Advanced) Rank 10,000, OPEN, Gender-Neutral, 2025 ---');
  const iitResult = await predictColleges({
    rank: 10000,
    rankType: 'advanced',
    category: 'OPEN',
    pwdStatus: false,
    gender: 'Gender-Neutral',
    homeState: 'Maharashtra',
    branches: [],
    instituteTypes: ['IIT'],
    year: 2025,
  });

  console.log(`Matched results: ${iitResult.totalMatched}`);
  console.log(`Alternatives count: ${iitResult.alternatives.length}`);
  
  if (iitResult.results.length > 0) {
    console.log('Top 3 results:');
    iitResult.results.slice(0, 3).forEach(r => {
      console.log(`- [${r.chance.toUpperCase()} - Prob: ${r.probability}%] ${r.instituteName} - ${r.branch} (Closing Rank: ${r.closingRank})`);
    });
  }

  // Query for JEE Main (NIT/IIIT) rank
  console.log('\n--- Test Case 2: NIT/IIIT (Main) Rank 5,000, OBC-NCL, Gender-Neutral, Home State: Maharashtra, 2025 ---');
  const nitResult = await predictColleges({
    rank: 5000,
    rankType: 'main',
    category: 'OBC-NCL',
    pwdStatus: false,
    gender: 'Gender-Neutral',
    homeState: 'Maharashtra',
    branches: [],
    instituteTypes: ['NIT', 'IIIT'],
    year: 2025,
  });

  console.log(`Matched results: ${nitResult.totalMatched}`);
  console.log(`Alternatives count: ${nitResult.alternatives.length}`);
  
  if (nitResult.results.length > 0) {
    console.log('Top 3 results:');
    nitResult.results.slice(0, 3).forEach(r => {
      console.log(`- [${r.chance.toUpperCase()} - Prob: ${r.probability}%] [Quota: ${r.quota}] ${r.instituteName} - ${r.branch} (Closing Rank: ${r.closingRank})`);
    });
  }
}

runTest().catch(console.error);
