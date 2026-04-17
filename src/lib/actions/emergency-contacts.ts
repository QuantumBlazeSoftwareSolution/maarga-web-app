'use server';

import { revalidatePath } from 'next/cache';
import { EmergencyContactInsert } from '../db/schema/emergency-contacts';
import { getAllEmergencyContacts } from '../db/emergency-contacts/read';
import {
  insertEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from '../db/emergency-contacts/write';

const REVALIDATE_PATH = '/developer-back-door/dashboard/rules';

/**
 * Fetch all emergency contacts from the database.
 */
export async function getEmergencyContacts() {
  try {
    const data = await getAllEmergencyContacts();
    return { success: true, data };
  } catch (error) {
    console.error('[getEmergencyContacts ERROR]', error);
    return { success: false, data: [] };
  }
}

/**
 * Create a new emergency contact.
 * Validates that a name and phone number are provided.
 */
export async function createEmergencyContact(input: EmergencyContactInsert) {
  try {
    const nameEn = (input.name as any)?.en?.trim();
    if (!nameEn) {
      return { success: false, message: 'English name is required' };
    }

    const phone = input.phone?.trim();
    if (!phone) {
      return { success: false, message: 'Phone number is required' };
    }

    const category = input.category?.trim();
    if (!category) {
      return { success: false, message: 'Category is required' };
    }

    await insertEmergencyContact(input);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Emergency contact created successfully' };
  } catch (error) {
    console.error('[createEmergencyContact ERROR]', error);
    return { success: false, message: 'Failed to create emergency contact' };
  }
}

/**
 * Update an existing emergency contact.
 */
export async function editEmergencyContact(
  id: string,
  input: Partial<EmergencyContactInsert>,
) {
  try {
    if (!id) return { success: false, message: 'Contact ID is required' };

    await updateEmergencyContact(id, input);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Emergency contact updated successfully' };
  } catch (error) {
    console.error('[editEmergencyContact ERROR]', error);
    return { success: false, message: 'Failed to update emergency contact' };
  }
}

/**
 * Delete an emergency contact by ID.
 */
export async function removeEmergencyContact(id: string) {
  try {
    if (!id) return { success: false, message: 'Contact ID is required' };

    await deleteEmergencyContact(id);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Emergency contact deleted successfully' };
  } catch (error) {
    console.error('[removeEmergencyContact ERROR]', error);
    return { success: false, message: 'Failed to delete emergency contact' };
  }
}
