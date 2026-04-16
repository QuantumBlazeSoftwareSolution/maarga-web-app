import { db } from '..';
import { ruleHandbookTable, RuleHandbook } from '../schema/rule-handbook';
import { desc } from 'drizzle-orm';

export async function getAllRules(): Promise<RuleHandbook[]> {
  try {
    const rules = await db
      .select()
      .from(ruleHandbookTable)
      .orderBy(desc(ruleHandbookTable.createdAt));
    return rules;
  } catch (error) {
    console.error('[READ] Error fetching rule handbook:', error);
    return [];
  }
}
