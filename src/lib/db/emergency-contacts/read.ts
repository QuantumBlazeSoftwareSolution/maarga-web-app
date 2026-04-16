import { db } from '..';
import { emergencyContactsTable, EmergencyContact } from '../schema/emergency-contacts';
import { desc } from 'drizzle-orm';

export async function getAllEmergencyContacts(): Promise<EmergencyContact[]> {
  try {
    const contacts = await db
      .select()
      .from(emergencyContactsTable)
      .orderBy(desc(emergencyContactsTable.createdAt));
    return contacts;
  } catch (error) {
    console.error('[READ] Error fetching emergency contacts:', error);
    return [];
  }
}
