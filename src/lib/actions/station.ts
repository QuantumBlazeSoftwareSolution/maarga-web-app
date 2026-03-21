'use server';

import { StationInsert, stationTable } from '@/src/lib/db/schema/station';
import { createBatchStations } from '../db/stations/write';
import { db } from '@/src/lib/db';
import { sql, eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { stationItemsTable } from '../db/schema/station-items';
import { itemsTable } from '../db/schema/items';

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

/**
 * Server Action to fetch all stations
 */
export async function getStations() {
  try {
    const stations = await db.select()
      .from(stationTable)
      .orderBy(desc(stationTable.createdAt));
    return { success: true, data: stations };
  } catch (error) {
    console.error('[GET STATIONS ERROR]', error);
    return { success: false, data: [] };
  }
}

/**
 * Server Action to create a single station manually
 */
export async function createStation(station: StationInsert) {
  try {
    await db.insert(stationTable).values(station);
    revalidatePath('/developer-back-door/dashboard/stations');
    return { success: true, message: 'Station created successfully' };
  } catch (error) {
    console.error('[CREATE STATION ERROR]', error);
    return { success: false, message: 'Failed to create station' };
  }
}

/**
 * Server Action to update a station
 */
export async function updateStation(id: string, data: Partial<StationInsert>) {
  try {
    await db.update(stationTable).set(data).where(eq(stationTable.id, id));
    revalidatePath('/developer-back-door/dashboard/stations');
    return { success: true, message: 'Station updated successfully' };
  } catch (error) {
    console.error('[UPDATE STATION ERROR]', error);
    return { success: false, message: 'Failed to update station' };
  }
}

/**
 * Server Action to delete a station
 */
export async function deleteStation(id: string) {
  try {
    await db.delete(stationTable).where(eq(stationTable.id, id));
    revalidatePath('/developer-back-door/dashboard/stations');
    return { success: true, message: 'Station deleted successfully' };
  } catch (error) {
    console.error('[DELETE STATION ERROR]', error);
    return { success: false, message: 'Failed to delete station' };
  }
}

/**
 * Bulk synchronizes all stations with their respective categorical items.
 * (e.g., all 'fuel' stations get all 'fuel' items).
 */
export async function syncAllStationItems() {
  try {
    // 1. Fetch only 'fuel' stations and 'fuel' items
    const allStations = await db
      .select({ id: stationTable.id, type: stationTable.type })
      .from(stationTable)
      .where(eq(stationTable.type, 'fuel'));
    const allItems = await db
      .select({ id: itemsTable.id, itemType: itemsTable.itemType })
      .from(itemsTable)
      .where(eq(itemsTable.itemType, 'fuel'));

    if (!allStations.length || !allItems.length) {
      return {
        success: false,
        message: 'No fuel stations or fuel items found to sync.',
      };
    }

    const inserts: (typeof stationItemsTable.$inferInsert)[] = [];

    // 2. Build the cross-join list locally (Fuel Only)
    for (const station of allStations) {
      for (const item of allItems) {
        inserts.push({
          stationId: station.id,
          itemId: item.id,
          availability: 'available', // Default to available on sync
        });
      }
    }

    // 3. Perform batch inserts to avoid payload/timeout limits
    const BATCH_SIZE = 500;
    let totalInserted = 0;

    for (let i = 0; i < inserts.length; i += BATCH_SIZE) {
      const batch = inserts.slice(i, i + BATCH_SIZE);
      
      // Filter out existing ones to prevent primary key/unique clashes if any
      // In this schema, we don't have a unique constraint on (stationId, itemId) yet, 
      // but let's be safe and check for existence or just insert if allowed.
      // Assuming we want to avoid duplicates:
      const filteredBatch = [];
      for (const ins of batch) {
        const existing = await db.select()
          .from(stationItemsTable)
          .where(and(
            eq(stationItemsTable.stationId, ins.stationId),
            eq(stationItemsTable.itemId, ins.itemId)
          ))
          .limit(1);
        
        if (existing.length === 0) {
          filteredBatch.push(ins);
        }
      }

      if (filteredBatch.length > 0) {
        await db.insert(stationItemsTable).values(filteredBatch);
        totalInserted += filteredBatch.length;
      }
      
      console.log(`[SYNC] Progress: ${Math.min(i + BATCH_SIZE, inserts.length)}/${inserts.length} | New: ${totalInserted}`);
    }

    revalidatePath('/developer-back-door/dashboard/stations');
    return { 
      success: true, 
      message: `Sync complete! Processed ${inserts.length} pairings. Added ${totalInserted} new records.`,
      count: totalInserted 
    };
  } catch (error) {
    console.error('[SYNC ERROR]', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error during sync' 
    };
  }
}
