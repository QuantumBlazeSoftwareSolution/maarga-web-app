import { eq } from 'drizzle-orm';
import { db } from '..';
import { StationItem, stationItemsTable } from '../schema/station-items';

export async function getItemsByStationId(
  stationId: string,
): Promise<StationItem[]> {
  try {
    const stationItems = await db
      .select()
      .from(stationItemsTable)
      .where(eq(stationItemsTable.stationId, stationId));

    return [];
  } catch (error) {
    console.error('[DB getItemsByStationId] Error:', error);
    return [];
  }
}
