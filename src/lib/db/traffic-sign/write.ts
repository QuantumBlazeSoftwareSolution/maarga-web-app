import { db } from '..';
import { trafficSignTable, TrafficSignInsert } from '../schema/traffic-sign';
import { eq } from 'drizzle-orm';

export async function insertTrafficSign(data: TrafficSignInsert): Promise<void> {
  try {
    await db.insert(trafficSignTable).values(data);
  } catch (error) {
    console.error('[WRITE] Error inserting traffic sign:', error);
    throw error;
  }
}

export async function updateTrafficSign(
  id: string,
  data: Partial<TrafficSignInsert>,
): Promise<void> {
  try {
    await db.update(trafficSignTable).set(data).where(eq(trafficSignTable.id, id));
  } catch (error) {
    console.error('[WRITE] Error updating traffic sign:', error);
    throw error;
  }
}

export async function deleteTrafficSign(id: string): Promise<void> {
  try {
    await db.delete(trafficSignTable).where(eq(trafficSignTable.id, id));
  } catch (error) {
    console.error('[WRITE] Error deleting traffic sign:', error);
    throw error;
  }
}
