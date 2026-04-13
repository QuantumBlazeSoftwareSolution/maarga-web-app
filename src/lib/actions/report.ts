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

/**
 * Controller logic: Submits a report and runs the consensus engine.
 */
export async function submitReportAction(data: {
  stationId: string;
  queue: number;
  message?: string;
  authId: string;
  items: { itemId: string; availability: string }[];
}) {
  try {
    const { stationId, queue, message, authId, items } = data;

    // 1. Validation & User Lookup
    if (!stationId || !items || items.length === 0 || !authId) {
      return { status: false, message: 'Missing required parameters.' };
    }

    const userRes = await getUserByAuthId(authId);
    if (!userRes.status || !userRes.user) {
      return { status: false, message: 'User not found.' };
    }
    const user = userRes.user;

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
    );

    return {
      status: true,
      message: consensusRes.message,
      reportId: report.id,
      confirmedItemsCount: consensusRes.confirmedItemsCount,
      trustScoreIncreased: consensusRes.trustScoreIncreased,
      newTrustScore: consensusRes.newTrustScore,
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
) {
  // Fetch the absolute latest raw records from DB (regardless of time)
  // This helps us evaluate the strict "last 3 reports" rule.
  const recentRows = await getLatestItemReportsForStation(stationId, 30);

  let confirmedCount = 0;

  for (const item of reportedItems) {
    // Filter the rows specifically for this item and sort by latest (they are already sorted by DESC via query)
    const itemHistory = recentRows.filter((r) => r.itemId === item.itemId);

    // Edge Case: The station has EXACTLY 0 previous reports for this item.
    // Note: itemHistory includes the currently inserted report row, so length <= 1 means NO prior history.
    if (itemHistory.length <= 1) {
      // Instantly confirm to provide initial data to the station
      await updateStationItemAvailability(
        stationId,
        item.itemId,
        item.availability as 'available' | 'low' | 'out',
      );
      confirmedCount++;
      continue;
    }

    // Normal path: Get the latest 3 records for this item strictly
    const latest3 = itemHistory.slice(0, 3);

    // Sum points for the status the user just reported within the latest 3
    let totalPointsForReportedStatus = 0;

    for (const row of latest3) {
      if (row.availability === item.availability) {
        const rowTrust = parseFloat(row.trustScore ?? '1.0') || 1.0;
        totalPointsForReportedStatus += getPointsFromTrustScore(rowTrust);
      }
    }

    // Business Logic: Threshold check
    if (totalPointsForReportedStatus >= CONFIRMATION_THRESHOLD) {
      await updateStationItemAvailability(
        stationId,
        item.itemId,
        item.availability as 'available' | 'low' | 'out',
      );
      confirmedCount++;
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
