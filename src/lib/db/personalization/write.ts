import { eq } from 'drizzle-orm';
import { db } from '../index';
import {
  Personalization,
  PersonalizationInsert,
  personalizationTable,
} from '../schema/personalization';

export async function upsertPersonalization(
  data: PersonalizationInsert,
): Promise<Personalization | null> {
  try {
    const existing = await db
      .select()
      .from(personalizationTable)
      .where(eq(personalizationTable.userId, data.userId))
      .limit(1);

    if (existing.length > 0) {
      // Update
      const result = await db
        .update(personalizationTable)
        .set({
          preferredFuels: data.preferredFuels,
          nearbyAlerts: data.nearbyAlerts,
          updatedAt: new Date(),
        })
        .where(eq(personalizationTable.userId, data.userId))
        .returning();
      return result[0];
    } else {
      // Insert
      const result = await db
        .insert(personalizationTable)
        .values(data)
        .returning();
      return result[0];
    }
  } catch (error) {
    console.error('[DB upsertPersonalization] Error:', error);
    return null;
  }
}
