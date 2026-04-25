'use server';

import { revalidatePath } from 'next/cache';
import { TrafficSignInsert } from '../db/schema/traffic-sign';
import { getAllTrafficSigns } from '../db/traffic-sign/read';
import { insertTrafficSign, updateTrafficSign, deleteTrafficSign } from '../db/traffic-sign/write';

const REVALIDATE_PATH = '/developer-back-door/dashboard/rules';

/**
 * Fetch all traffic signs from the database.
 */
export async function getTrafficSigns() {
  try {
    const data = await getAllTrafficSigns();
    return { success: true, data };
  } catch (error) {
    console.error('[getTrafficSigns ERROR]', error);
    return { success: false, data: [] };
  }
}

/**
 * Create a new traffic sign entry.
 * Validates required fields before inserting.
 */
export async function createTrafficSign(input: TrafficSignInsert) {
  try {
    const nameEn = (input.name as any)?.en?.trim();
    if (!nameEn) {
      return { success: false, message: 'English name is required' };
    }

    const identifier = input.identifier?.trim();
    if (!identifier) {
      return { success: false, message: 'Identifier is required' };
    }

    const category = input.category?.trim();
    if (!category) {
      return { success: false, message: 'Category is required' };
    }

    await insertTrafficSign(input);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Traffic sign created successfully' };
  } catch (error) {
    console.error('[createTrafficSign ERROR]', error);
    return { success: false, message: 'Failed to create traffic sign' };
  }
}

/**
 * Update an existing traffic sign.
 */
export async function editTrafficSign(id: string, input: Partial<TrafficSignInsert>) {
  try {
    if (!id) return { success: false, message: 'Sign ID is required' };

    await updateTrafficSign(id, input);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Traffic sign updated successfully' };
  } catch (error) {
    console.error('[editTrafficSign ERROR]', error);
    return { success: false, message: 'Failed to update traffic sign' };
  }
}

/**
 * Delete a traffic sign by ID.
 */
export async function removeTrafficSign(id: string) {
  try {
    if (!id) return { success: false, message: 'Sign ID is required' };

    await deleteTrafficSign(id);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Traffic sign deleted successfully' };
  } catch (error) {
    console.error('[removeTrafficSign ERROR]', error);
    return { success: false, message: 'Failed to delete traffic sign' };
  }
}
