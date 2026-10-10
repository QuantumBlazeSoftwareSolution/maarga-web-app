'use server';

import {
  getAllReportsWithDetails as dbGetAllReports,
  getRecentReports as dbGetRecentReports,
  getLatestItemReportsForStation,
} from '../db/report/read';
import { createReport, createReportItems } from '../db/report/write';
import { updateReportStatus } from '../db/report/update';
import { updateStationItemAvailability } from '../db/stations/update';
import { updateUserTrustScore } from '../db/user/update';
import { getUserByAuthId } from '../db/user/read';
import { getAllNewStationReports } from '../db/new-station/read';
import { createNewStationReport } from '../db/new-station/write';
import { db } from '../db';
import { stationTable } from '../db/schema/station';
import { itemsTable } from '../db/schema/items';
import { eq, inArray } from 'drizzle-orm';
import { getGeohashNeighbors } from '../utils/geohash';
import { sendGeohashNotification } from './fcm';

const CONFIRMATION_THRESHOLD = 3;
const CONSENSUS_WINDOW_HOURS = 24;

const QUEUE_MAP: Record<number, string> = {
  1: 'no_queue',
  2: 'short',
  3: 'medium',
  4: 'long',
};

export async function getAllReports() {
  return await dbGetAllReports();
}

export async function getRecentReports() {
  return await dbGetRecentReports(20);
}

function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Controller logic: Submits a report and runs the consensus engine.
 */
export async function submitReportAction(data: {
  stationId: string;
  queue: number;
  message?: string;
  authId: string;
  items: { itemId: string; availability: string }[];
  userLatitude?: number;
  userLongitude?: number;
}) {
  try {
    const { stationId, queue, message, authId, items, userLatitude, userLongitude } = data;

    // 1. Validation & User Lookup
    if (!stationId || !items || items.length === 0 || !authId) {
      return { status: false, message: 'Missing required parameters.' };
    }

    const userRes = await getUserByAuthId(authId);
    if (!userRes.status || !userRes.user) {
      return { status: false, message: 'User not found.' };
    }
    const user = userRes.user;

    // Fetch station coordinates to determine proximity
    let isNearStation = false;
    const stationRecords = await db
      .select({
        latitude: stationTable.latitude,
        longitude: stationTable.longitude,
      })
      .from(stationTable)
      .where(eq(stationTable.id, stationId));

    if (
      stationRecords.length > 0 &&
      userLatitude !== undefined &&
      userLongitude !== undefined &&
      !isNaN(userLatitude) &&
      !isNaN(userLongitude)
    ) {
      const stLat = parseFloat(stationRecords[0].latitude);
      const stLon = parseFloat(stationRecords[0].longitude);
      if (!isNaN(stLat) && !isNaN(stLon)) {
        const distance = calculateDistanceInMeters(
          userLatitude,
          userLongitude,
          stLat,
          stLon,
        );
        // Proximity threshold: within 500 meters is considered at/near the station
        if (distance <= 500) {
          isNearStation = true;
        }
      }
    }

    // 2. Data Preparation
    const queueValue = (QUEUE_MAP[queue] ?? 'no_queue') as
      | 'no_queue'
      | 'short'
      | 'medium'
      | 'long';

    // 3. Create Report (DB Operation)
    const reportRes = await createReport({
      userId: user.id,
      stationId,
      queue: queueValue,
      message: message || null,
      status: 'pending',
    });

    if (!reportRes.status || !reportRes.report) {
      return { status: false, message: 'Failed to create report header.' };
    }
    const report = reportRes.report;

    // 4. Create Report Items (DB Operation)
    const itemsRes = await createReportItems(
      report.id,
      items as { itemId: string; availability: 'available' | 'low' | 'out' }[],
    );
    if (!itemsRes.status) {
      return { status: false, message: 'Failed to create report items.' };
    }

    // 5. Run Consensus Engine (Business Logic)
    const consensusRes = await runConsensusEngine(
      stationId,
      report.id,
      user.id,
      parseFloat(user.trustScore ?? '1.0') || 1.0,
      items as { itemId: string; availability: string }[],
      isNearStation,
    );

    return {
      status: true,
      message: consensusRes.message,
      reportId: report.id,
      confirmedItemsCount: consensusRes.confirmedItemsCount,
      trustScoreIncreased: consensusRes.trustScoreIncreased,
      newTrustScore: consensusRes.newTrustScore,
      isNearStation,
    };
  } catch (error) {
    console.error('submitReportAction error:', error);
    return { status: false, message: 'An internal error occurred.' };
  }
}

/**
 * Helper to calculate points based on trust score
 */
function getPointsFromTrustScore(trustScore: number): number {
  if (trustScore >= 3.0) return 3;
  if (trustScore >= 2.0) return 2;
  return 1;
}

/**
 * Internal logic for tallying consensus scores.
 */
async function runConsensusEngine(
  stationId: string,
  currentReportId: string,
  currentUserId: string,
  currentUserTrustScore: number,
  reportedItems: { itemId: string; availability: string }[],
  isNearStation: boolean,
) {
  // Fetch recent item reports for this station
  const recentRows = await getLatestItemReportsForStation(stationId, 30);

  let confirmedCount = 0;
  const confirmedItems: { itemId: string; availability: string }[] = [];

  for (const item of reportedItems) {
    // 1. If user is physically at/near the station (<= 500m), confirm on 1st attempt!
    if (isNearStation) {
      await updateStationItemAvailability(
        stationId,
        item.itemId,
        item.availability as 'available' | 'low' | 'out',
      );
      confirmedCount++;
      confirmedItems.push(item);
      continue;
    }

    // 2. If user is reporting from a distance:
    // Need at least 2 reports agreeing on this status (current + previous matching report)
    const itemHistory = recentRows.filter((r) => r.itemId === item.itemId);

    // Filter recent reports that have the exact same reported availability
    const matchingReports = itemHistory.filter(
      (r) => r.availability === item.availability,
    );

    // If there are at least 2 matching reports (including current one), confirm!
    if (matchingReports.length >= 2) {
      await updateStationItemAvailability(
        stationId,
        item.itemId,
        item.availability as 'available' | 'low' | 'out',
      );
      confirmedCount++;
      confirmedItems.push(item);
    }
  }

  // Business Logic: Approval and Trust Score Reward
  let newTrustScore = currentUserTrustScore;
  let trustScoreIncreased = false;

  if (confirmedCount > 0) {
    await updateReportStatus(currentReportId, 'approved');
    newTrustScore = Math.min(10.0, currentUserTrustScore + 0.5);
    if (newTrustScore > currentUserTrustScore) {
      trustScoreIncreased = true;
    }
    await updateUserTrustScore(currentUserId, newTrustScore);

    // Trigger Geohash Grid Notifications
    try {
      const stationRecords = await db
        .select({
          latitude: stationTable.latitude,
          longitude: stationTable.longitude,
          name: stationTable.name,
        })
        .from(stationTable)
        .where(eq(stationTable.id, stationId));

      if (stationRecords.length > 0) {
        const st = stationRecords[0];
        const lat = parseFloat(st.latitude);
        const lon = parseFloat(st.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          // Fetch item names for the detailed message
          const itemIds = confirmedItems.map(i => i.itemId);
          const itemsData = await db
            .select({ id: itemsTable.id, name: itemsTable.name })
            .from(itemsTable)
            .where(inArray(itemsTable.id, itemIds));

          const itemMap = new Map();
          itemsData.forEach(i => itemMap.set(i.id, i.name));

          const details = confirmedItems.map((i) => {
            const name = itemMap.get(i.itemId) || 'Fuel';
            return `${name}: ${i.availability.toUpperCase()}`;
          }).join(' | ');

          const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          const messageBody = `${details}\nUpdated: ${timeStr} (Just now)`;

          const geohashes = getGeohashNeighbors(lat, lon, 5);
          await sendGeohashNotification(
            geohashes,
            `${st.name} Status Validated ✅`,
            messageBody,
            { stationId }
          );
        }
      }
    } catch (e) {
      console.error('Error sending geohash notification:', e);
    }
  }

  return {
    confirmedItemsCount: confirmedCount,
    trustScoreIncreased,
    newTrustScore,
    message:
      confirmedCount > 0
        ? 'Consensus reached and records updated.'
        : 'Report saved. Awaiting more confirmations.',
  };
}
export async function getNewStationReports() {
  const result = await getAllNewStationReports();
  return result.data || [];
}

/**
 * Controller logic: Submits a report for a new station.
 */
export async function submitNewStationReportAction(data: {
  authId: string;
  latitude: string;
  longitude: string;
}) {
  try {
    const { authId, latitude, longitude } = data;

    // 1. Validation & User Lookup
    if (!authId || !latitude || !longitude) {
      return { status: false, message: 'Missing required parameters.' };
    }

    const userRes = await getUserByAuthId(authId);
    if (!userRes.status || !userRes.user) {
      return { status: false, message: 'User not found.' };
    }
    const user = userRes.user;

    // 2. Create New Station Report (DB Operation)
    const report = await createNewStationReport({
      userId: user.id,
      latitude,
      longitude,
    });

    return {
      status: true,
      message: 'New station location submitted successfully.',
      reportId: report.id,
    };
  } catch (error) {
    console.error('submitNewStationReportAction error:', error);
    return { status: false, message: 'An internal error occurred.' };
  }
}
