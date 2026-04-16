import { db } from '..';
import { fineGuideTable, FineGuideInsert } from '../schema/fine-guide';
import { eq } from 'drizzle-orm';

export async function insertFine(data: FineGuideInsert): Promise<void> {
  try {
    await db.insert(fineGuideTable).values(data);
  } catch (error) {
    console.error('[WRITE] Error inserting fine guide entry:', error);
    throw error;
  }
}

export async function updateFine(
  id: string,
  data: Partial<FineGuideInsert>,
): Promise<void> {
  try {
    await db.update(fineGuideTable).set(data).where(eq(fineGuideTable.id, id));
  } catch (error) {
    console.error('[WRITE] Error updating fine guide entry:', error);
    throw error;
  }
}

export async function deleteFine(id: string): Promise<void> {
  try {
    await db.delete(fineGuideTable).where(eq(fineGuideTable.id, id));
  } catch (error) {
    console.error('[WRITE] Error deleting fine guide entry:', error);
    throw error;
  }
}
