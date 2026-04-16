'use server';

import { revalidatePath } from 'next/cache';
import { RuleHandbookInsert } from '../db/schema/rule-handbook';
import { getAllRules } from '../db/rule-handbook/read';
import { insertRule, updateRule, deleteRule } from '../db/rule-handbook/write';

const REVALIDATE_PATH = '/developer-back-door/dashboard/rules';

/**
 * Fetch all road rules from the database.
 */
export async function getRules() {
  try {
    const data = await getAllRules();
    return { success: true, data };
  } catch (error) {
    console.error('[getRules ERROR]', error);
    return { success: false, data: [] };
  }
}

/**
 * Create a new road rule entry.
 * Validates that required localized fields are not empty.
 */
export async function createRule(input: RuleHandbookInsert) {
  try {
    const titleEn = (input.title as any)?.en?.trim();
    if (!titleEn) {
      return { success: false, message: 'English title is required' };
    }

    const category = input.category?.trim();
    if (!category) {
      return { success: false, message: 'Category is required' };
    }

    await insertRule(input);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Rule created successfully' };
  } catch (error) {
    console.error('[createRule ERROR]', error);
    return { success: false, message: 'Failed to create rule' };
  }
}

/**
 * Update an existing road rule.
 */
export async function editRule(id: string, input: Partial<RuleHandbookInsert>) {
  try {
    if (!id) return { success: false, message: 'Rule ID is required' };

    await updateRule(id, input);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Rule updated successfully' };
  } catch (error) {
    console.error('[editRule ERROR]', error);
    return { success: false, message: 'Failed to update rule' };
  }
}

/**
 * Delete a road rule by ID.
 */
export async function removeRule(id: string) {
  try {
    if (!id) return { success: false, message: 'Rule ID is required' };

    await deleteRule(id);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Rule deleted successfully' };
  } catch (error) {
    console.error('[removeRule ERROR]', error);
    return { success: false, message: 'Failed to delete rule' };
  }
}
