'use server';

import { revalidatePath } from 'next/cache';
import { FineGuideInsert } from '../db/schema/fine-guide';
import { getAllFines } from '../db/fine-guide/read';
import { insertFine, updateFine, deleteFine } from '../db/fine-guide/write';

const REVALIDATE_PATH = '/developer-back-door/dashboard/rules';

/**
 * Fetch all fine guide entries from the database.
 */
export async function getFines() {
  try {
    const data = await getAllFines();
    return { success: true, data };
  } catch (error) {
    console.error('[getFines ERROR]', error);
    return { success: false, data: [] };
  }
}

/**
 * Create a new fine guide entry.
 * Validates offense name and fine amount before inserting.
 */
export async function createFine(input: FineGuideInsert) {
  try {
    const offenseEn = (input.offense as any)?.en?.trim();
    if (!offenseEn) {
      return { success: false, message: 'English offense name is required' };
    }

    // Validate fine amount is a positive number
    const amount = Number(input.fineAmount);
    if (isNaN(amount) || amount < 0) {
      return { success: false, message: 'Fine amount must be a valid positive number' };
    }

    await insertFine(input);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Fine entry created successfully' };
  } catch (error) {
    console.error('[createFine ERROR]', error);
    return { success: false, message: 'Failed to create fine entry' };
  }
}

/**
 * Update an existing fine guide entry.
 * Re-validates fine amount if it is being changed.
 */
export async function editFine(id: string, input: Partial<FineGuideInsert>) {
  try {
    if (!id) return { success: false, message: 'Fine ID is required' };

    if (input.fineAmount !== undefined) {
      const amount = Number(input.fineAmount);
      if (isNaN(amount) || amount < 0) {
        return { success: false, message: 'Fine amount must be a valid positive number' };
      }
    }

    await updateFine(id, input);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Fine entry updated successfully' };
  } catch (error) {
    console.error('[editFine ERROR]', error);
    return { success: false, message: 'Failed to update fine entry' };
  }
}

/**
 * Delete a fine guide entry by ID.
 */
export async function removeFine(id: string) {
  try {
    if (!id) return { success: false, message: 'Fine ID is required' };

    await deleteFine(id);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Fine entry deleted successfully' };
  } catch (error) {
    console.error('[removeFine ERROR]', error);
    return { success: false, message: 'Failed to delete fine entry' };
  }
}
