import { db } from '..';
import { StationInsert, stationTable } from '../schema/station';

export async function createBatchStations(
  batch: StationInsert[],
): Promise<void> {
  try {
    await db.insert(stationTable).values(batch);
  } catch (error) {
    console.error('Error creating batch stations:', error);
    throw error;
  }
}
