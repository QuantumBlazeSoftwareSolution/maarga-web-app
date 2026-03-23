'use server';

import {
  getAllReportsWithDetails as dbGetAllReports,
  getRecentReportsForConsensus,
} from '../db/report/read';
import { createReport, createReportItems } from '../db/report/write';
import { updateReportStatus } from '../db/report/update';
import { updateStationItemAvailability } from '../db/stations/update';
import { updateUserTrustScore } from '../db/user/update';
import { getUserByAuthId } from '../db/user/read';

const CONFIRMATION_THRESHOLD = 3;
const CONSENSUS_WINDOW_HOURS = 6;

const QUEUE_MAP: Record<number, string> = {
  1: 'no_queue',
  2: 'short',
  3: 'medium',
  4: 'long',
};

export async function getAllReports() {
  return await dbGetAllReports();
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
    };
  } catch (error) {
    console.error('submitReportAction error:', error);
    return { status: false, message: 'An internal error occurred.' };
  }
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
  // Fetch raw records from DB
  const recentRows = await getRecentReportsForConsensus(
    stationId,
    CONSENSUS_WINDOW_HOURS,
  );

  // Business Logic: Tallying
  const tallies: Record<string, Record<string, number>> = {};
  for (const row of recentRows) {
    if (!tallies[row.itemId]) {
      tallies[row.itemId] = { available: 0, low: 0, out: 0 };
    }
    tallies[row.itemId][row.availability] =
      (tallies[row.itemId][row.availability] ?? 0) +
      (parseFloat(row.trustScore ?? '1') || 1);
  }

  let confirmedCount = 0;
  for (const item of reportedItems) {
    const tally = tallies[item.itemId];
    if (!tally) continue;

    const winningStatus = Object.keys(tally).reduce((a, b) =>
      tally[a] > tally[b] ? a : b,
    ) as 'available' | 'low' | 'out';

    const winningScore = tally[winningStatus];

    // Business Logic: Threshold check
    if (winningScore >= CONFIRMATION_THRESHOLD) {
      await updateStationItemAvailability(
        stationId,
        item.itemId,
        winningStatus,
      );
      confirmedCount++;
    }
  }

  // Business Logic: Approval and Trust Score Reward
  let newTrustScore = currentUserTrustScore;
  if (confirmedCount > 0) {
    await updateReportStatus(currentReportId, 'approved');
    newTrustScore = Math.min(10.0, currentUserTrustScore + 0.5);
    await updateUserTrustScore(currentUserId, newTrustScore);
  }

  return {
    confirmedItemsCount: confirmedCount,
    message:
      confirmedCount > 0
        ? 'Consensus reached and records updated.'
        : 'Report saved. Awaiting more confirmations.',
  };
}
