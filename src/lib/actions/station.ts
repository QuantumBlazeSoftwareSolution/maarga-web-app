'use server';

import { StationInsert } from '@/src/lib/db/schema/station';
import { createBatchStations } from '../db/stations/write';

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

    for (let i = 0; i < stations.length; i += BATCH_SIZE) {
      const batch: StationInsert[] = stations.slice(i, i + BATCH_SIZE);

      await createBatchStations(batch);
      importedCount += batch.length;

      console.log(
        `[IMPORT] Batch complete: ${importedCount}/${stations.length}`,
      );
    }

    return {
      success: true,
      message: `Successfully imported ${importedCount} stations.`,
      count: importedCount,
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
