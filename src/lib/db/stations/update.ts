import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { stationItemsTable } from '../schema/station-items';
import { DBOperationResponse } from '../types';

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
