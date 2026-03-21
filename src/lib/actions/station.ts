'use server';

import { StationInsert, stationTable } from '@/src/lib/db/schema/station';
import { createBatchStations } from '../db/stations/write';
import { db } from '@/src/lib/db';
import { sql } from 'drizzle-orm';

/**
 * Server Action to bulk import stations with batching.
 * @param stations - Array of station objects to insert.
 */
export async function bulkImportStations(stations: StationInsert[]) {
  try {
    if (!stations.length) {
      return { success: false, message: 'No stations provided for import' };
    }

    // Process in batches of 100 to avoid Vercel timeout/ Neon limits
    const BATCH_SIZE = 100;
    let importedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < stations.length; i += BATCH_SIZE) {
      const batch: StationInsert[] = stations.slice(i, i + BATCH_SIZE);
      
      // Basic Deduplication: Filter out stations that already exist (same name AND location)
      // This is a simple check, for production we might want a spatial query
      const filteredBatch = [];
      for (const station of batch) {
        const existing = await db.select()
          .from(stationTable)
          .where(sql`name = ${station.name} AND longitude = ${station.longitude} AND latitude = ${station.latitude}`)
          .limit(1);
        
        if (existing.length === 0) {
          filteredBatch.push(station);
        } else {
          skippedCount++;
        }
      }

      if (filteredBatch.length > 0) {
        await createBatchStations(filteredBatch);
        importedCount += filteredBatch.length;
      }
      
      console.log(`[IMPORT] Progress: ${i + batch.length}/${stations.length} | Imported: ${importedCount} | Skipped: ${skippedCount}`);
    }

    return { 
      success: true, 
      message: `Successfully imported ${importedCount} stations. ${skippedCount > 0 ? `(Skipped ${skippedCount} duplicates)` : ''}`,
      count: importedCount 
    };
  } catch (error) {
    console.error('[IMPORT ERROR]', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown error during import',
    };
  }
}
