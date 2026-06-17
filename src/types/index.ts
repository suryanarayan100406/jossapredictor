export interface CutoffRecord {
  id: number;
  year: number;
  round: number;
  instituteType: string; // IIT, NIT, IIIT, GFTI
  instituteName: string;
  branch: string; // academic program
  quota: string; // AI, HS, OS, GO, JK, LA
  category: string; // OPEN, OBC-NCL, SC, ST, EWS, etc.
  gender: string; // Gender-Neutral, Female-only
  openingRank: number;
  closingRank: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

export interface ImportLog {
  id: number;
  filename: string;
  rowsTotal: number;
  rowsImported: number;
  rowsSkipped: number;
  errors: string; // JSON string array
  importedAt: Date;
  adminId: number;
}

export interface Institute {
  id: number;
  name: string;
  type: string; // IIT, NIT, IIIT, GFTI
  state: string;
  city: string;
  website: string;
  nirfRank: number | null;
  logoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PredictionSettings {
  id: number;
  safeMultiplier: number;
  moderateMultiplier: number;
  ambitiousMultiplier: number;
}

export interface Feedback {
  id: number;
  message: string;
  email: string;
  createdAt: Date;
}

export interface PredictionInput {
  rank: number;
  rankType: 'advanced' | 'main';
  category: string;
  pwdStatus: boolean;
  gender: string;
  homeState: string;
  branches: string[]; // empty = all
  instituteTypes: string[]; // empty = all matching rank type
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

export type ImportMode = 'append' | 'replaceByYear' | 'replaceAll';

export interface ColumnMapping {
  year: string;
  round: string;
  instituteType: string;
  instituteName: string;
  branch: string;
  quota: string;
  category: string;
  gender: string;
  openingRank: string;
  closingRank: string;
}

export interface WizardStep {
  id: number;
  title: string;
  subtitle: string;
}

export interface CompareItem {
  id: string; // unique identifier (e.g., `${recordId}-${quota}`)
  record: PredictionResult;
}

export interface FilterState {
  search: string;
  instituteTypes: string[];
  states: string[];
  chances: ('safe' | 'moderate' | 'ambitious' | 'longshot')[];
  branches: string[];
  sortBy: 'probability' | 'closingRank' | 'instituteName';
  sortOrder: 'asc' | 'desc';
}

export enum ChanceBand {
  Safe = 'safe',
  Moderate = 'moderate',
  Ambitious = 'ambitious',
  Longshot = 'longshot',
}

export interface CollegeProfile {
  id: number;
  instituteName: string;
  instituteType: string;
  state: string;
  city: string;
  avgPackage: number | null;
  highestPackage: number | null;
  placementRate: number | null;
  logoUrl: string;
  imageUrl: string;
  codingCulture: number;
  technicalClubs: number;
  hackathonCulture: number;
  campusLife: number;
  hostelQuality: number;
  sportsFacilities: number;
  researchFocus: number;
  startupEcosystem: number;
  nirfRank: number | null;
  nirfYear: number;
  established: number | null;
  website: string;
  description: string;
}

export interface PreferenceWeights {
  placementWeight: number;
  codingCultureWeight: number;
  campusLifeWeight: number;
  hostelWeight: number;
  researchWeight: number;
  startupWeight: number;
  sportsWeight: number;
  technicalClubsWeight: number;
}

export interface RecommendationInput {
  rank: number;
  rankType: 'advanced' | 'main';
  category: string;
  pwdStatus: boolean;
  gender: string;
  homeState: string;
  branches: string[];
  instituteTypes: string[];
  year: number;
  preferences: PreferenceWeights;
}

export interface RecommendationResult extends PredictionResult {
  score: number;
  scoreBreakdown: {
    admission: number;
    preference: number;
    prestige: number;
  };
  profile: CollegeProfile | null;
}

export interface AlgorithmicAdvisorGuidance {
  overview: string;
  branchVsCollege: string;
  highlights: string[];
  tips: string[];
}

