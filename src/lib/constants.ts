/** All Indian states and union territories */
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
] as const;

/** Seat categories */
export const CATEGORIES = [
  'OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS',
  'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'ST (PwD)', 'EWS (PwD)'
] as const;

/** Quota types */
export const QUOTAS = ['AI', 'HS', 'OS', 'GO', 'JK', 'LA'] as const;

/** Institute types */
export const INSTITUTE_TYPES = ['IIT', 'NIT', 'IIIT', 'GFTI'] as const;

/** Gender pools */
export const GENDER_POOLS = ['Gender-Neutral', 'Female-only (including Supernumerary)'] as const;

/** Popular engineering branches */
export const POPULAR_BRANCHES = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Mathematics and Computing',
  'Data Science and Artificial Intelligence',
  'Artificial Intelligence',
  'Engineering Physics',
  'Biotechnology',
  'Metallurgical and Materials Engineering',
  'Mining Engineering',
  'Production and Industrial Engineering',
  'Information Technology',
  'Electronics and Instrumentation Engineering',
  'Biomedical Engineering',
  'Environmental Engineering',
  'Industrial Chemistry',
  'Ocean Engineering',
  'Agricultural and Food Engineering',
  'Textile Engineering',
  'Architecture',
] as const;

/** Rank type options */
export const RANK_TYPES = [
  { value: 'advanced' as const, label: 'JEE Advanced (CRL)', description: 'For IIT admissions', icon: '🏛️' },
  { value: 'main' as const, label: 'JEE Main (CRL)', description: 'For NIT/IIIT/GFTI admissions', icon: '🎓' },
] as const;

/** Default prediction settings */
export const DEFAULT_PREDICTION_SETTINGS = {
  safeMultiplier: 0.90,
  moderateMultiplier: 1.10,
  ambitiousMultiplier: 1.30,
};

/** CSV column name mapping (CSV headers → database fields) */
export const CSV_COLUMN_MAPPING = {
  year: 'year',
  round: 'round',
  type: 'instituteType',
  institute: 'instituteName',
  program: 'branch',
  quota: 'quota',
  category: 'category',
  gender: 'gender',
  orank: 'openingRank',
  crank: 'closingRank',
} as const;

/** Wizard step labels */
export const WIZARD_STEPS = [
  { id: 1, label: 'Rank', description: 'Enter your exam rank', icon: '📊' },
  { id: 2, label: 'Demographics', description: 'Select category & gender', icon: '👤' },
  { id: 3, label: 'State', description: 'Choose your home state', icon: '📍' },
  { id: 4, label: 'Personalization', description: 'Configure preferences', icon: '⚙️' },
  { id: 5, label: 'Branches', description: 'Pick branches & types', icon: '🎯' },
] as const;

export const PREFERENCE_PRESETS = [
  {
    name: 'Placement Focused',
    description: 'Prioritizes average package, placement rate, and coding culture.',
    weights: {
      placementWeight: 10,
      codingCultureWeight: 9,
      campusLifeWeight: 5,
      hostelWeight: 6,
      researchWeight: 4,
      startupWeight: 7,
      sportsWeight: 5,
      technicalClubsWeight: 8,
    }
  },
  {
    name: 'Research & Higher Studies',
    description: 'Prioritizes academic depth, research focus, and prestige.',
    weights: {
      placementWeight: 6,
      codingCultureWeight: 7,
      campusLifeWeight: 6,
      hostelWeight: 7,
      researchWeight: 10,
      startupWeight: 6,
      sportsWeight: 5,
      technicalClubsWeight: 8,
    }
  },
  {
    name: 'Startup Dream',
    description: 'Prioritizes startup ecosystem, coding, and networking.',
    weights: {
      placementWeight: 7,
      codingCultureWeight: 10,
      campusLifeWeight: 7,
      hostelWeight: 6,
      researchWeight: 6,
      startupWeight: 10,
      sportsWeight: 6,
      technicalClubsWeight: 9,
    }
  },
  {
    name: 'All-Rounder Campus Life',
    description: 'Balances hostel, sports, campus life, and placement.',
    weights: {
      placementWeight: 8,
      codingCultureWeight: 7,
      campusLifeWeight: 10,
      hostelWeight: 9,
      researchWeight: 5,
      startupWeight: 6,
      sportsWeight: 9,
      technicalClubsWeight: 8,
    }
  }
] as const;

