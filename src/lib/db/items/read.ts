import { eq } from 'drizzle-orm';
import { db } from '..';
import { StationItem, stationItemsTable } from '../schema/station-items';
import { Item, itemsTable } from '../schema/items';

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
        itemSinhalaName: itemsTable.sinhalaName,
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

export async function getAllItems(): Promise<Item[]> {
  try {
    const items = await db.select().from(itemsTable);
    return items;
  } catch (error) {
    console.error('[DB getAllItems] Error:', error);
    return [];
  }
}
