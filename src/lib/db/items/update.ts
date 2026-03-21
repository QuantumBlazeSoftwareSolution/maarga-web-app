import { db } from '..';
import { ItemInsert, itemsTable } from '../schema/items';
import { eq } from 'drizzle-orm';

export async function updateItem(
  id: string,
  data: ItemInsert,
) {
  try {
    await db.update(itemsTable).set(data).where(eq(itemsTable.id, id));
    return { success: true, message: 'Item updated successfully' };
  } catch (error) {
    console.error('[UPDATE ITEM ERROR]', error);
    return { success: false, message: 'Failed to update item' };
  }
}
