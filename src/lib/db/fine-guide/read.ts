import { db } from '..';
import { fineGuideTable, FineGuide } from '../schema/fine-guide';
import { desc } from 'drizzle-orm';

export async function getAllFines(): Promise<FineGuide[]> {
  try {
    const fines = await db
      .select()
      .from(fineGuideTable)
      .orderBy(desc(fineGuideTable.createdAt));
    return fines;
  } catch (error) {
    console.error('[READ] Error fetching fine guide:', error);
    return [];
  }
}
