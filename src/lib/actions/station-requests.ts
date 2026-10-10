'use server';

import { revalidatePath } from 'next/cache';
import { getUserByAuthId } from '../db/user/read';
import {
  createStationNameRequest,
  createStationDeleteRequest,
  getAllStationNameRequests,
  getAllStationDeleteRequests,
  updateStationNameRequestStatus,
  updateStationDeleteRequestStatus,
} from '../db/station-requests/queries';
import { db } from '../db';
import { stationTable } from '../db/schema/station';
import { eq } from 'drizzle-orm';
import { District, StationStatus } from '../db/schema/enum';

/**
 * Submit a request to rename a station
 */
export async function submitStationNameRequestAction(data: {
  authId: string;
  stationId: string;
  suggestedName: string;
}) {
  try {
    const { authId, stationId, suggestedName } = data;
    if (!authId || !stationId || !suggestedName?.trim()) {
      return { status: false, message: 'Missing required parameters.' };
    }

    const userRes = await getUserByAuthId(authId);
    if (!userRes.status || !userRes.user) {
      return { status: false, message: 'User not found.' };
    }

    const request = await createStationNameRequest({
      stationId,
      userId: userRes.user.id,
      suggestedName: suggestedName.trim(),
    });

    return {
      status: true,
      message: 'Station name suggestion submitted successfully.',
      requestId: request.id,
    };
  } catch (error) {
    console.error('submitStationNameRequestAction error:', error);
    return { status: false, message: 'Failed to submit name suggestion.' };
  }
}

/**
 * Submit a request to delete a station
 */
export async function submitStationDeleteRequestAction(data: {
  authId: string;
  stationId: string;
  reason: string;
}) {
  try {
    const { authId, stationId, reason } = data;
    if (!authId || !stationId || !reason?.trim()) {
      return { status: false, message: 'Missing required parameters.' };
    }

    const userRes = await getUserByAuthId(authId);
    if (!userRes.status || !userRes.user) {
      return { status: false, message: 'User not found.' };
    }

    const request = await createStationDeleteRequest({
      stationId,
      userId: userRes.user.id,
      reason: reason.trim(),
    });

    return {
      status: true,
      message: 'Station deletion request submitted successfully.',
      requestId: request.id,
    };
  } catch (error) {
    console.error('submitStationDeleteRequestAction error:', error);
    return { status: false, message: 'Failed to submit delete request.' };
  }
}

/**
 * Fetch all station name requests
 */
export async function getStationNameRequestsAction() {
  const result = await getAllStationNameRequests();
  return result.data || [];
}

/**
 * Fetch all station delete requests
 */
export async function getStationDeleteRequestsAction() {
  const result = await getAllStationDeleteRequests();
  return result.data || [];
}

/**
 * Approve a name request: updates the station name and marks request as approved
 */
export async function approveStationNameRequestAction(
  requestId: string,
  stationId: string,
  data: {
    name: string;
    address: string;
    district: District;
    status: StationStatus;
    latitude: string;
    longitude: string;
  },
) {
  try {
    await db
      .update(stationTable)
      .set({
        name: data.name,
        address: data.address,
        district: data.district || null,
        status: data.status,
        latitude: data.latitude,
        longitude: data.longitude,
        level: 'approved',
      })
      .where(eq(stationTable.id, stationId));

    await updateStationNameRequestStatus(requestId, 'approved');
    revalidatePath('/developer-back-door/dashboard/reports');
    revalidatePath('/developer-back-door/dashboard/stations');

    return { success: true, message: 'Station name verified and updated!' };
  } catch (error) {
    console.error('approveStationNameRequestAction error:', error);
    return { success: false, message: 'Failed to approve name request.' };
  }
}

/**
 * Reject a name request
 */
export async function rejectStationNameRequestAction(requestId: string) {
  try {
    await updateStationNameRequestStatus(requestId, 'suspended');
    revalidatePath('/developer-back-door/dashboard/reports');
    return { success: true, message: 'Name request rejected.' };
  } catch (error) {
    console.error('rejectStationNameRequestAction error:', error);
    return { success: false, message: 'Failed to reject request.' };
  }
}

/**
 * Confirm delete station request: deletes the station and marks request approved
 */
export async function confirmDeleteStationRequestAction(
  requestId: string,
  stationId: string,
) {
  try {
    // Delete station (cascades to requests/items/reports)
    await db.delete(stationTable).where(eq(stationTable.id, stationId));
    revalidatePath('/developer-back-door/dashboard/reports');
    revalidatePath('/developer-back-door/dashboard/stations');

    return { success: true, message: 'Station permanently deleted.' };
  } catch (error) {
    console.error('confirmDeleteStationRequestAction error:', error);
    return { success: false, message: 'Failed to delete station.' };
  }
}

/**
 * Reject a delete station request
 */
export async function rejectDeleteStationRequestAction(requestId: string) {
  try {
    await updateStationDeleteRequestStatus(requestId, 'suspended');
    revalidatePath('/developer-back-door/dashboard/reports');
    return { success: true, message: 'Delete request rejected.' };
  } catch (error) {
    console.error('rejectDeleteStationRequestAction error:', error);
    return { success: false, message: 'Failed to reject delete request.' };
  }
}

