import { desc, eq } from 'drizzle-orm';
import { db } from '..';
import { newStationReportsTable } from '../schema/new-station-reports';
import { usersTable } from '../schema/users';

/**
 * Fetches all reported new stations with user details.
 */
export async function getAllNewStationReports() {
  try {
    const data = await db
      .select({
        id: newStationReportsTable.id,
        latitude: newStationReportsTable.latitude,
        longitude: newStationReportsTable.longitude,
        status: newStationReportsTable.status,
        createdAt: newStationReportsTable.createdAt,
        userName: usersTable.name,
      })
      .from(newStationReportsTable)
      .leftJoin(usersTable, eq(newStationReportsTable.userId, usersTable.id))
      .orderBy(desc(newStationReportsTable.createdAt));

    return { status: true, data };
  } catch (error) {
    console.error('Fetch new station reports error:', error);
    return { status: false, data: [] };
  }
}
