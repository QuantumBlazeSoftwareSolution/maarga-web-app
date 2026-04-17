import { db } from '..';
import { trafficSignTable, TrafficSign } from '../schema/traffic-sign';
import { desc } from 'drizzle-orm';

export async function getAllTrafficSigns(): Promise<TrafficSign[]> {
  try {
    const signs = await db
      .select()
      .from(trafficSignTable)
      .orderBy(desc(trafficSignTable.createdAt));
    return signs;
  } catch (error) {
    console.error('[READ] Error fetching traffic signs:', error);
    return [];
  }
}
