'use server';

import { StationInsert, stationTable } from '@/src/lib/db/schema/station';
import { createBatchStations } from '../db/stations/write';
import { db } from '@/src/lib/db';
import { sql, eq, desc, and, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { stationItemsTable } from '../db/schema/station-items';
import { itemsTable } from '../db/schema/items';
import { updateStationCoords } from '../db/stations/update';
import { District, StationStatus } from '../db/schema/enum';

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
        const existing = await db
          .select()
          .from(stationTable)
          .where(
            sql`name = ${station.name} AND longitude = ${station.longitude} AND latitude = ${station.latitude}`,
          )
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

      console.log(
        `[IMPORT] Progress: ${i + batch.length}/${stations.length} | Imported: ${importedCount} | Skipped: ${skippedCount}`,
      );
    }

    return {
      success: true,
      message: `Successfully imported ${importedCount} stations. ${skippedCount > 0 ? `(Skipped ${skippedCount} duplicates)` : ''}`,
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

/**
 * Server Action to fetch all stations with their associated items
 */
export async function getStations() {
  try {
    // 1. Fetch all stations
    const stations = await db
      .select()
      .from(stationTable)
      .orderBy(desc(stationTable.createdAt));

    if (stations.length === 0) return { success: true, data: [] };

    // 2. Fetch associated items ONLY for the specific stations we just retrieved
    const stationIds = stations.map((s) => s.id);
    const stationItems = await db
      .select({
        stationId: stationItemsTable.stationId,
        itemId: itemsTable.id,
        name: itemsTable.name,
        itemType: itemsTable.itemType,
        availability: stationItemsTable.availability,
      })
      .from(stationItemsTable)
      .innerJoin(itemsTable, eq(stationItemsTable.itemId, itemsTable.id))
      .where(inArray(stationItemsTable.stationId, stationIds));

    // 3. Map items to their respective stations
    const data = stations.map((station) => ({
      ...station,
      items: stationItems.filter((si) => si.stationId === station.id),
    }));

    return { success: true, data };
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
        const existing = await db
          .select()
          .from(stationItemsTable)
          .where(
            and(
              eq(stationItemsTable.stationId, ins.stationId),
              eq(stationItemsTable.itemId, ins.itemId),
            ),
          )
          .limit(1);

        if (existing.length === 0) {
          filteredBatch.push(ins);
        }
      }

      if (filteredBatch.length > 0) {
        await db.insert(stationItemsTable).values(filteredBatch);
        totalInserted += filteredBatch.length;
      }

      console.log(
        `[SYNC] Progress: ${Math.min(i + BATCH_SIZE, inserts.length)}/${inserts.length} | New: ${totalInserted}`,
      );
    }

    revalidatePath('/developer-back-door/dashboard/stations');
    return {
      success: true,
      message: `Sync complete! Processed ${inserts.length} pairings. Added ${totalInserted} new records.`,
      count: totalInserted,
    };
  } catch (error) {
    console.error('[SYNC ERROR]', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown error during sync',
    };
  }
}

/**
 * Server Action to update station coordinates with validation.
 */
export async function updateStationCoordinates(
  id: string,
  lat: string,
  lng: string,
) {
  try {
    // 1. Basic Validation
    if (!id || !lat || !lng) {
      return { success: false, message: 'ID and coordinates are required' };
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return { success: false, message: 'Invalid coordinate format' };
    }

    // 2. Range Validation
    if (latitude < -90 || latitude > 90) {
      return { success: false, message: 'Latitude must be between -90 and 90' };
    }
    if (longitude < -180 || longitude > 180) {
      return {
        success: false,
        message: 'Longitude must be between -180 and 180',
      };
    }

    // 3. Database Update
    await updateStationCoords(id, lat, lng);

    // 4. Revalidate
    revalidatePath('/developer-back-door/dashboard/stations');

    return {
      success: true,
      message: 'Station location updated successfully',
    };
  } catch (error) {
    console.error('[COORD UPDATE ERROR]', error);
    return { success: false, message: 'Failed to update coordinates' };
  }
}

/**
 * Server Action to verify and approve a station.
 * Updates name, address, district, status and sets level to 'approved'.
 */
export async function verifyAndApproveStation(
  id: string,
  data: {
    name: string;
    address: string;
    district: District;
    status: StationStatus;
    latitude: string;
    longitude: string;
  },
) {
  try {
    await db
      .update(stationTable)
      .set({
        name: data.name,
        address: data.address,
        district: data.district || null,
        status: data.status,
        latitude: data.latitude,
        longitude: data.longitude,
        level: 'approved',
      })
      .where(eq(stationTable.id, id));

    revalidatePath('/developer-back-door/dashboard/stations');
    return { success: true, message: 'Station verified and approved!' };
  } catch (error) {
    console.error('[VERIFY APPROVE ERROR]', error);
    return { success: false, message: 'Failed to verify station' };
  }
}

/**
 * Server Action to reject a station (sets level to 'rejected').
 */
export async function rejectStation(id: string) {
  try {
    await db
      .update(stationTable)
      .set({
        level: 'rejected',
      })
      .where(eq(stationTable.id, id));

    revalidatePath('/developer-back-door/dashboard/stations');
    return { success: true, message: 'Station rejected.' };
  } catch (error) {
    console.error('[REJECT STATION ERROR]', error);
    return { success: false, message: 'Failed to reject station' };
  }
}
