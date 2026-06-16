import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { parseCSV, autoMapColumns, detectHeaders } from '@/lib/csv-parser';
import type { ColumnMapping } from '@/lib/csv-parser';

export async function POST(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mode = (formData.get('mode') as string) || 'append';
    const forceYearStr = formData.get('forceYear') as string;
    const mappingStr = formData.get('mapping') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const csvContent = await file.text();
    const headers = detectHeaders(csvContent);
    const mapping: ColumnMapping = mappingStr ? JSON.parse(mappingStr) : autoMapColumns(headers);
    const forceYear = forceYearStr ? parseInt(forceYearStr) : undefined;

    const { valid, skipped, total } = parseCSV(csvContent, mapping, forceYear);

    // Handle import mode
    if (mode === 'replaceAll') {
      await prisma.cutoffRecord.deleteMany();
    } else if (mode === 'replaceByYear' && valid.length > 0) {
      const years = [...new Set(valid.map(r => r.year))];
      await prisma.cutoffRecord.deleteMany({ where: { year: { in: years } } });
    }

    // In-memory de-duplication if mode is 'append'
    let recordsToInsert = valid;
    let skippedCount = skipped.length;

    if (mode === 'append' && valid.length > 0) {
      const years = [...new Set(valid.map(r => r.year))];
      const existing = await prisma.cutoffRecord.findMany({
        where: { year: { in: years } },
        select: {
          year: true,
          round: true,
          instituteType: true,
          instituteName: true,
          branch: true,
          quota: true,
          category: true,
          gender: true,
        }
      });

      const existingKeys = new Set(
        existing.map(r =>
          `${r.year}-${r.round}-${r.instituteType}-${r.instituteName}-${r.branch}-${r.quota}-${r.category}-${r.gender}`.toLowerCase()
        )
      );

      recordsToInsert = valid.filter(r => {
        const key = `${r.year}-${r.round}-${r.instituteType}-${r.instituteName}-${r.branch}-${r.quota}-${r.category}-${r.gender}`.toLowerCase();
        const exists = existingKeys.has(key);
        if (exists) {
          skippedCount++;
        }
        return !exists;
      });
    }

    // Batch insert
    let imported = 0;
    const batchSize = 500;
    const errors: string[] = [];

    for (let i = 0; i < recordsToInsert.length; i += batchSize) {
      const batch = recordsToInsert.slice(i, i + batchSize);
      try {
        const result = await prisma.cutoffRecord.createMany({
          data: batch,
        });
        imported += result.count;
      } catch (err) {
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${err}`);
      }
    }

    // Create import log
    const log = await prisma.importLog.create({
      data: {
        filename: file.name,
        rowsTotal: total,
        rowsImported: imported,
        rowsSkipped: skippedCount,
        errors: JSON.stringify(errors.concat(skipped.slice(0, 20).map(s => `Row ${s.row}: ${s.reason}`))),
        adminId: admin.id,
      },
    });

    return NextResponse.json({
      success: true,
      imported,
      skipped: skippedCount,
      total,
      errors: errors.length,
      logId: log.id,
      detectedHeaders: headers,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed: ' + String(error) }, { status: 500 });
  }
}
