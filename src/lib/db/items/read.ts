import { eq } from 'drizzle-orm';
import { db } from '..';
import { StationItem, stationItemsTable } from '../schema/station-items';
import { itemsTable } from '../schema/items';

export async function getItemsByStationId(
  stationId: string,
): Promise<StationItem[]> {
  try {
    const stationItems = await db
      .select({
        id: stationItemsTable.id,
        itemId: stationItemsTable.itemId,
        stationId: stationItemsTable.stationId,
        availability: stationItemsTable.availability,
        createdAt: stationItemsTable.createdAt,
        updatedAt: stationItemsTable.updatedAt,
        itemName: itemsTable.name,
        itemType: itemsTable.itemType,
      })
      .from(stationItemsTable)
      .leftJoin(itemsTable, eq(stationItemsTable.itemId, itemsTable.id))
      .where(eq(stationItemsTable.stationId, stationId));

    return stationItems;
  } catch (error) {
    console.error('[DB getItemsByStationId] Error:', error);
    return [];
  }
}
