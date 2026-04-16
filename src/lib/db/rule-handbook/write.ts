import { db } from '..';
import { ruleHandbookTable, RuleHandbookInsert } from '../schema/rule-handbook';
import { eq } from 'drizzle-orm';

export async function insertRule(data: RuleHandbookInsert): Promise<void> {
  try {
    await db.insert(ruleHandbookTable).values(data);
  } catch (error) {
    console.error('[WRITE] Error inserting rule:', error);
    throw error;
  }
}

export async function updateRule(
  id: string,
  data: Partial<RuleHandbookInsert>,
): Promise<void> {
  try {
    await db.update(ruleHandbookTable).set(data).where(eq(ruleHandbookTable.id, id));
  } catch (error) {
    console.error('[WRITE] Error updating rule:', error);
    throw error;
  }
}

export async function deleteRule(id: string): Promise<void> {
  try {
    await db.delete(ruleHandbookTable).where(eq(ruleHandbookTable.id, id));
  } catch (error) {
    console.error('[WRITE] Error deleting rule:', error);
    throw error;
  }
}
