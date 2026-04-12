import { db } from '..';
import { stationTable } from '../schema/station';
import { and, eq } from 'drizzle-orm';
import { DBOperationResponse } from '../types';
import { stationItemsTable } from '../schema/station-items';

/**
 * Updates the coordinates of a specific fuel station.
 * @param id - The UUID of the station.
 * @param latitude - The new latitude string.
 * @param longitude - The new longitude string.
 */
export async function updateStationCoords(
  id: string,
  latitude: string,
  longitude: string,
): Promise<void> {
  try {
    await db
      .update(stationTable)
      .set({ latitude, longitude, updatedAt: new Date() })
      .where(eq(stationTable.id, id));
  } catch (error) {
    console.error('Error updating station coordinates:', error);
    throw error;
  }
}

export async function updateStationItemAvailability(
  stationId: string,
  itemId: string,
  availability: 'available' | 'low' | 'out',
): Promise<DBOperationResponse> {
  try {
    await db
      .update(stationItemsTable)
      .set({
        availability,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(stationItemsTable.stationId, stationId),
          eq(stationItemsTable.itemId, itemId),
        ),
      );

    return {
      status: true,
      message: 'Station item availability updated successfully.',
    };
  } catch (error) {
    console.error('Update station item availability DB error:', error);
    return {
      status: false,
      message: 'Failed to update station item availability.',
    };
  }
}
