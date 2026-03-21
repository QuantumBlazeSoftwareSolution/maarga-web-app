'use server';

import { db } from '@/src/lib/db';
import { ItemInsert, itemsTable } from '@/src/lib/db/schema/items';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { insertItem } from '../db/items/write';

/**
 * Fetches all global items
 */
export async function getItems() {
  try {
    const items = await db
      .select()
      .from(itemsTable)
      .orderBy(desc(itemsTable.createdAt));
    return { success: true, data: items };
  } catch (error) {
    console.error('[GET ITEMS ERROR]', error);
    return { success: false, data: [] };
  }
}

/**
 * Creates a new item manually
 */
export async function createItem(item: ItemInsert) {
  try {
    await insertItem(item);
    revalidatePath('/developer-back-door/dashboard/station-items');
    return { success: true, message: 'Item created successfully' };
  } catch (error) {
    console.error('[CREATE ITEM ERROR]', error);
    return { success: false, message: 'Failed to create item' };
  }
}

/**
 * Updates an item
 */
export async function updateItem(id: string, data: Partial<ItemInsert>) {
  try {
    await db.update(itemsTable).set(data).where(eq(itemsTable.id, id));
    revalidatePath('/developer-back-door/dashboard/station-items');
    return { success: true, message: 'Item updated successfully' };
  } catch (error) {
    console.error('[UPDATE ITEM ERROR]', error);
    return { success: false, message: 'Failed to update item' };
  }
}

/**
 * Deletes an item
 */
export async function deleteItem(id: string) {
  try {
    await db.delete(itemsTable).where(eq(itemsTable.id, id));
    revalidatePath('/developer-back-door/dashboard/station-items');
    return { success: true, message: 'Item deleted successfully' };
  } catch (error) {
    console.error('[DELETE ITEM ERROR]', error);
    return { success: false, message: 'Failed to delete item' };
  }
}
