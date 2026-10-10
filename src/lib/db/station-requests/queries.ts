import { desc, eq } from 'drizzle-orm';
import { db } from '..';
import {
  stationNameRequestsTable,
  StationNameRequest,
} from '../schema/station-name-requests';
import {
  stationDeleteRequestsTable,
  StationDeleteRequest,
} from '../schema/station-delete-requests';
import { stationTable } from '../schema/station';
import { usersTable } from '../schema/users';

export async function createStationNameRequest(data: {
  stationId: string;
  userId: string;
  suggestedName: string;
}) {
  const result = await db
    .insert(stationNameRequestsTable)
    .values({
      stationId: data.stationId,
      userId: data.userId,
      suggestedName: data.suggestedName,
    })
    .returning();
  return result[0];
}

export async function createStationDeleteRequest(data: {
  stationId: string;
  userId: string;
  reason: string;
}) {
  const result = await db
    .insert(stationDeleteRequestsTable)
    .values({
      stationId: data.stationId,
      userId: data.userId,
      reason: data.reason,
    })
    .returning();
  return result[0];
}

export async function getAllStationNameRequests() {
  try {
    const data = await db
      .select({
        id: stationNameRequestsTable.id,
        stationId: stationNameRequestsTable.stationId,
        stationName: stationTable.name,
        stationAddress: stationTable.address,
        stationDistrict: stationTable.district,
        stationLatitude: stationTable.latitude,
        stationLongitude: stationTable.longitude,
        suggestedName: stationNameRequestsTable.suggestedName,
        status: stationNameRequestsTable.status,
        createdAt: stationNameRequestsTable.createdAt,
        userName: usersTable.name,
        userEmail: usersTable.email,
        userAuthId: usersTable.authId,
      })
      .from(stationNameRequestsTable)
      .innerJoin(stationTable, eq(stationNameRequestsTable.stationId, stationTable.id))
      .leftJoin(usersTable, eq(stationNameRequestsTable.userId, usersTable.id))
      .orderBy(desc(stationNameRequestsTable.createdAt));

    return { status: true, data };
  } catch (error) {
    console.error('Fetch station name requests error:', error);
    return { status: false, data: [] };
  }
}

export async function getAllStationDeleteRequests() {
  try {
    const data = await db
      .select({
        id: stationDeleteRequestsTable.id,
        stationId: stationDeleteRequestsTable.stationId,
        stationName: stationTable.name,
        stationAddress: stationTable.address,
        stationDistrict: stationTable.district,
        stationLatitude: stationTable.latitude,
        stationLongitude: stationTable.longitude,
        reason: stationDeleteRequestsTable.reason,
        status: stationDeleteRequestsTable.status,
        createdAt: stationDeleteRequestsTable.createdAt,
        userName: usersTable.name,
        userEmail: usersTable.email,
        userAuthId: usersTable.authId,
      })
      .from(stationDeleteRequestsTable)
      .innerJoin(stationTable, eq(stationDeleteRequestsTable.stationId, stationTable.id))
      .leftJoin(usersTable, eq(stationDeleteRequestsTable.userId, usersTable.id))
      .orderBy(desc(stationDeleteRequestsTable.createdAt));

    return { status: true, data };
  } catch (error) {
    console.error('Fetch station delete requests error:', error);
    return { status: false, data: [] };
  }
}

export async function updateStationNameRequestStatus(
  id: string,
  status: 'pending' | 'approved' | 'suspended',
) {
  return await db
    .update(stationNameRequestsTable)
    .set({ status })
    .where(eq(stationNameRequestsTable.id, id));
}

export async function updateStationDeleteRequestStatus(
  id: string,
  status: 'pending' | 'approved' | 'suspended',
) {
  return await db
    .update(stationDeleteRequestsTable)
    .set({ status })
    .where(eq(stationDeleteRequestsTable.id, id));
}

