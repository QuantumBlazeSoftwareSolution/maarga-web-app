import { eq } from 'drizzle-orm';
import { db } from '../index';
import { Personalization, personalizationTable } from '../schema/personalization';

export async function getPersonalizationByUserId(
  userId: string,
): Promise<Personalization | null> {
  try {
    const result = await db
      .select()
      .from(personalizationTable)
      .where(eq(personalizationTable.userId, userId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('[DB getPersonalizationByUserId] Error:', error);
    return null;
  }
}
