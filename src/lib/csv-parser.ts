import Papa from 'papaparse';
import { POPULAR_BRANCHES } from './constants';

export function alignBranch(rawBranch: string): string | null {
  const clean = rawBranch.trim().toLowerCase();
  
  // 1. Exact or direct substring match
  for (const branch of POPULAR_BRANCHES) {
    if (clean.includes(branch.toLowerCase())) {
      return branch;
    }
  }

  // 2. Fuzzy/manual mappings for common variations
  const mappings: [RegExp, string][] = [
    [/computer science/i, 'Computer Science and Engineering'],
    [/cse/i, 'Computer Science and Engineering'],
    [/electronics.*communication/i, 'Electronics and Communication Engineering'],
    [/ece/i, 'Electronics and Communication Engineering'],
    [/electronics/i, 'Electronics and Communication Engineering'],
    [/electrical/i, 'Electrical Engineering'],
    [/eee/i, 'Electrical Engineering'],
    [/mechanical/i, 'Mechanical Engineering'],
    [/me\b/i, 'Mechanical Engineering'],
    [/civil/i, 'Civil Engineering'],
    [/ce\b/i, 'Civil Engineering'],
    [/chemical/i, 'Chemical Engineering'],
    [/aerospace/i, 'Aerospace Engineering'],
    [/space science/i, 'Aerospace Engineering'],
    [/aeronautical/i, 'Aerospace Engineering'],
    [/math/i, 'Mathematics and Computing'],
    [/data science/i, 'Data Science and Artificial Intelligence'],
    [/artificial intelligence/i, 'Artificial Intelligence'],
    [/ai/i, 'Artificial Intelligence'],
    [/physics/i, 'Engineering Physics'],
    [/biotech/i, 'Biotechnology'],
    [/bio.*engineering/i, 'Biotechnology'],
    [/metallurg/i, 'Metallurgical and Materials Engineering'],
    [/materials/i, 'Metallurgical and Materials Engineering'],
    [/mining/i, 'Mining Engineering'],
    [/production/i, 'Production and Industrial Engineering'],
    [/industrial/i, 'Production and Industrial Engineering'],
    [/manufacturing/i, 'Production and Industrial Engineering'],
    [/information technology/i, 'Information Technology'],
    [/instrumentation/i, 'Electronics and Instrumentation Engineering'],
    [/biomedical/i, 'Biomedical Engineering'],
    [/environmental/i, 'Environmental Engineering'],
    [/chemistry/i, 'Industrial Chemistry'],
    [/ocean/i, 'Ocean Engineering'],
    [/agricultural/i, 'Agricultural and Food Engineering'],
    [/textile/i, 'Textile Engineering'],
    [/architecture/i, 'Architecture'],
  ];

  for (const [regex, branch] of mappings) {
    if (regex.test(clean)) {
      return branch;
    }
  }

  return null;
}

export interface ParsedRow {
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
}

export interface ParseResult {
  valid: ParsedRow[];
  skipped: { row: number; reason: string }[];
  total: number;
}

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

const DEFAULT_MAPPING: ColumnMapping = {
  year: 'year',
  round: 'round',
  instituteType: 'type',
  instituteName: 'institute',
  branch: 'program',
  quota: 'quota',
  category: 'category',
  gender: 'gender',
  openingRank: 'orank',
  closingRank: 'crank',
};

function normalizeInstituteType(type: string): string {
  const t = type.trim().toUpperCase();
  if (t === '3IT' || t === 'IIIT') return 'IIIT';
  if (t === 'CFI' || t === 'GFTI') return 'GFTI';
  return t;
}

export function parseCSV(
  csvContent: string,
  mapping: ColumnMapping = DEFAULT_MAPPING,
  forceYear?: number
): ParseResult {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim().toLowerCase(),
  });

  const dedupedMap = new Map<string, ParsedRow>();
  const skipped: { row: number; reason: string }[] = [];

  (result.data as Record<string, string>[]).forEach((row, i) => {
    try {
      const yearStr = forceYear?.toString() ?? row[mapping.year.toLowerCase()];
      const roundStr = row[mapping.round.toLowerCase()];
      const type = row[mapping.instituteType.toLowerCase()];
      const institute = row[mapping.instituteName.toLowerCase()];
      const program = row[mapping.branch.toLowerCase()];
      const quota = row[mapping.quota.toLowerCase()];
      const category = row[mapping.category.toLowerCase()];
      const gender = row[mapping.gender.toLowerCase()];
      const orankStr = row[mapping.openingRank.toLowerCase()];
      const crankStr = row[mapping.closingRank.toLowerCase()];

      if (!yearStr || !roundStr || !type || !institute || !program || !quota || !category || !gender) {
        skipped.push({ row: i + 2, reason: 'Missing required field(s)' });
        return;
      }

      const year = parseInt(yearStr, 10);
      const round = parseInt(roundStr, 10);
      const closingRank = parseInt(crankStr, 10);
      const openingRank = parseInt(orankStr, 10);

      if (isNaN(year) || isNaN(round)) {
        skipped.push({ row: i + 2, reason: 'Invalid year or round' });
        return;
      }
      if (isNaN(closingRank) || closingRank <= 0) {
        skipped.push({ row: i + 2, reason: 'Invalid closing rank' });
        return;
      }

      const alignedBranch = alignBranch(program);
      if (!alignedBranch) {
        skipped.push({ row: i + 2, reason: `Branch "${program}" could not be mapped and was removed` });
        return;
      }

      const record: ParsedRow = {
        year, round,
        instituteType: normalizeInstituteType(type),
        instituteName: institute.trim(),
        branch: alignedBranch,
        quota: quota.trim().toUpperCase(),
        category: category.trim(),
        gender: gender.trim(),
        openingRank: isNaN(openingRank) ? 0 : openingRank,
        closingRank,
      };

      const key = `${record.year}-${record.round}-${record.instituteType}-${record.instituteName}-${record.branch}-${record.quota}-${record.category}-${record.gender}`.toLowerCase();
      if (dedupedMap.has(key)) {
        const existing = dedupedMap.get(key)!;
        // Keep the one with the higher closing rank
        if (record.closingRank > existing.closingRank) {
          dedupedMap.set(key, record);
        }
      } else {
        dedupedMap.set(key, record);
      }
    } catch {
      skipped.push({ row: i + 2, reason: 'Parse error' });
    }
  });

  const valid = Array.from(dedupedMap.values());
  return { valid, skipped, total: result.data.length };
}

export function detectHeaders(csvContent: string): string[] {
  const result = Papa.parse(csvContent, { header: true, preview: 1 });
  return result.meta.fields ?? [];
}

export function autoMapColumns(headers: string[]): ColumnMapping {
  const mapping = { ...DEFAULT_MAPPING };
  const lower = headers.map(h => h.toLowerCase().trim());

  const rules: Record<keyof ColumnMapping, string[]> = {
    year: ['year', 'yr'],
    round: ['round', 'rnd'],
    instituteType: ['type', 'institute_type', 'institutetype'],
    instituteName: ['institute', 'institute_name', 'college'],
    branch: ['program', 'branch', 'course', 'programme'],
    quota: ['quota', 'seat_type'],
    category: ['category', 'cat', 'seat_category'],
    gender: ['gender', 'gender_pool'],
    openingRank: ['orank', 'opening_rank', 'openingrank'],
    closingRank: ['crank', 'closing_rank', 'closingrank'],
  };

  for (const [field, aliases] of Object.entries(rules)) {
    for (const alias of aliases) {
      const idx = lower.indexOf(alias);
      if (idx >= 0) {
        (mapping as Record<string, string>)[field] = headers[idx];
        break;
      }
    }
  }

  return mapping;
}
