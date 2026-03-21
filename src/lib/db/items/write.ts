import { db } from '..';
import { ItemInsert, itemsTable } from '../schema/items';

export async function insertItem(item: ItemInsert): Promise<ItemInsert | null> {
  try {
    const result = await db.insert(itemsTable).values(item).returning();
    return result[0];
  } catch (error) {
    console.error('[INSERT ITEM ERROR]', error);
    return null;
  }
}
