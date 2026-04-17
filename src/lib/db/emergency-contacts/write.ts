import { db } from '..';
import { emergencyContactsTable, EmergencyContactInsert } from '../schema/emergency-contacts';
import { eq } from 'drizzle-orm';

export async function insertEmergencyContact(data: EmergencyContactInsert): Promise<void> {
  try {
    await db.insert(emergencyContactsTable).values(data);
  } catch (error) {
    console.error('[WRITE] Error inserting emergency contact:', error);
    throw error;
  }
}

export async function updateEmergencyContact(
  id: string,
  data: Partial<EmergencyContactInsert>,
): Promise<void> {
  try {
    await db.update(emergencyContactsTable).set(data).where(eq(emergencyContactsTable.id, id));
  } catch (error) {
    console.error('[WRITE] Error updating emergency contact:', error);
    throw error;
  }
}

export async function deleteEmergencyContact(id: string): Promise<void> {
  try {
    await db.delete(emergencyContactsTable).where(eq(emergencyContactsTable.id, id));
  } catch (error) {
    console.error('[WRITE] Error deleting emergency contact:', error);
    throw error;
  }
}
