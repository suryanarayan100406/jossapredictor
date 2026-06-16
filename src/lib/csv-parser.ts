import Papa from 'papaparse';

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

  const valid: ParsedRow[] = [];
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

      valid.push({
        year, round,
        instituteType: normalizeInstituteType(type),
        instituteName: institute.trim(),
        branch: program.trim(),
        quota: quota.trim().toUpperCase(),
        category: category.trim(),
        gender: gender.trim(),
        openingRank: isNaN(openingRank) ? 0 : openingRank,
        closingRank,
      });
    } catch {
      skipped.push({ row: i + 2, reason: 'Parse error' });
    }
  });

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
