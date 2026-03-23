import { withAuth } from '@/src/lib/proxy';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { reportsTable } from '@/src/lib/db/schema/reports';
import { reportItemsTable } from '@/src/lib/db/schema/reports-items';
import { usersTable } from '@/src/lib/db/schema/users';
import { stationItemsTable } from '@/src/lib/db/schema/station-items';
import { eq, and, gte } from 'drizzle-orm';
import { getUserByAuthId } from '@/src/lib/db/user/read';

const CONFIRMATION_THRESHOLD = 3;
const CONSENSUS_WINDOW_HOURS = 6;

const QUEUE_MAP: Record<number, string> = {
  1: 'no_queue',
  2: 'short',
  3: 'medium',
  4: 'long',
};

/**
 * @swagger
 * /api/v1/reports/create:
 *   post:
 *     summary: Create a fuel status report
 *     description: Submits a new status report for a fuel station. Uses a consensus engine to confirm availability if multiple users report similar statuses.
 *     tags:
 *       - Reports
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stationId
 *               - items
 *               - userId
 *             properties:
 *               stationId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               userId:
 *                 type: string
 *                 description: The Google/Firebase Auth ID of the user (e.g. Zmol56pFGady1rty86tkZmphuuP2)
 *                 example: "firebase_uid_123"
 *               queue:
 *                 type: integer
 *                 description: 1=no_queue, 2=short, 3=medium, 4=long
 *                 enum: [1, 2, 3, 4]
 *                 example: 1
 *               message:
 *                 type: string
 *                 description: Optional user message
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       format: uuid
 *                     availability:
 *                       type: string
 *                       enum: [available, low, out]
 *     responses:
 *       200:
 *         description: Report submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 reportId:
 *                   type: string
 *                   format: uuid
 *                 confirmedItemsCount:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [pending, approved]
 *       400:
 *         description: Missing required fields (stationId, items, or authId)
 *       404:
 *         description: User not found (authId mismatch)
 *       500:
 *         description: Internal server error
 */
export const POST = withAuth(async (req: NextRequest) => {
  console.log('[Reports/Create] ▶ Request received');

  try {
    const body = await req.json();
    console.log('[Reports/Create] Body:', JSON.stringify(body, null, 2));

    const {
      stationId,
      queue,
      message,
      items,
      userId: bodyAuthId,
    } = body as {
      stationId: string;
      queue: number;
      message?: string;
      userId?: string; // mobile sends Google UID as "userId"
      items: { itemId: string; availability: string }[];
    };

    // The mobile app sends the Firebase/Google UID in the "userId" field
    const authId = req.headers.get('x-user-id') ?? bodyAuthId ?? null;
    console.log('[Reports/Create] authId (Google UID):', authId);

    if (!stationId || !items || items.length === 0) {
      console.warn('[Reports/Create] ❌ Missing stationId or items');
      return NextResponse.json(
        { message: 'stationId and items are required' },
        { status: 400 },
      );
    }

    if (!authId) {
      console.warn('[Reports/Create] ❌ No authId provided');
      return NextResponse.json(
        { message: 'authId is required' },
        { status: 400 },
      );
    }

    // 1. Look up user by their Google authId to get the real DB UUID
    console.log('[Reports/Create] Looking up user by authId...');
    const user = await getUserByAuthId(authId);

    if (!user || !user.user) {
      console.warn('[Reports/Create] ❌ No user found for authId:', authId);
      return NextResponse.json(
        { message: 'User not found. Please sign in again.' },
        { status: 404 },
      );
    }

    const userId = user.user.id;
    const userTrustScore = parseFloat(user.user.trustScore ?? '1.0') || 1.0;
    console.log(
      '[Reports/Create] ✅ Found user:',
      userId,
      '| Trust score:',
      userTrustScore,
    );

    const queueValue = (QUEUE_MAP[queue] ?? 'no_queue') as
      | 'no_queue'
      | 'short'
      | 'medium'
      | 'long';

    // 2. Save the report header as 'pending'
    console.log('[Reports/Create] Inserting report...');
    const [newReport] = await db
      .insert(reportsTable)
      .values({
        userId,
        stationId,
        queue: queueValue,
        message: message || null,
        status: 'pending',
      })
      .returning();
    console.log('[Reports/Create] ✅ Report inserted:', newReport.id);

    // 3. Save each reported item
    console.log('[Reports/Create] Inserting', items.length, 'report items...');
    await db.insert(reportItemsTable).values(
      items.map((item) => ({
        reportId: newReport.id,
        itemId: item.itemId,
        availability: item.availability as 'available' | 'low' | 'out',
      })),
    );
    console.log('[Reports/Create] ✅ Report items inserted');

    // 4. Consensus Engine
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - CONSENSUS_WINDOW_HOURS);

    const recentRows = await db
      .select({
        itemId: reportItemsTable.itemId,
        availability: reportItemsTable.availability,
        trustScore: usersTable.trustScore,
      })
      .from(reportsTable)
      .innerJoin(
        reportItemsTable,
        eq(reportsTable.id, reportItemsTable.reportId),
      )
      .innerJoin(usersTable, eq(reportsTable.userId, usersTable.id))
      .where(
        and(
          eq(reportsTable.stationId, stationId),
          gte(reportsTable.createdAt, timeLimit),
        ),
      );

    console.log(
      '[Reports/Create] Recent rows for consensus:',
      recentRows.length,
    );

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
    for (const item of items) {
      const tally = tallies[item.itemId];
      if (!tally) continue;

      const winningStatus = Object.keys(tally).reduce((a, b) =>
        tally[a] > tally[b] ? a : b,
      );
      const winningScore = tally[winningStatus];
      console.log(
        `[Reports/Create] Item ${item.itemId}: top="${winningStatus}" score=${winningScore}`,
      );

      if (winningScore >= CONFIRMATION_THRESHOLD) {
        await db
          .update(stationItemsTable)
          .set({
            availability: winningStatus as 'available' | 'low' | 'out',
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(stationItemsTable.stationId, stationId),
              eq(stationItemsTable.itemId, item.itemId),
            ),
          );
        console.log(
          `[Reports/Create] ✅ Confirmed item ${item.itemId} as "${winningStatus}"`,
        );
        confirmedCount++;
      }
    }

    if (confirmedCount > 0) {
      await db
        .update(reportsTable)
        .set({ status: 'approved' })
        .where(eq(reportsTable.id, newReport.id));

      const newScore = Math.min(10.0, userTrustScore + 0.5);
      await db
        .update(usersTable)
        .set({ trustScore: newScore.toFixed(2) })
        .where(eq(usersTable.id, userId));
      console.log(
        '[Reports/Create] ✅ Approved report & rewarded user. New score:',
        newScore,
      );
    }

    console.log('[Reports/Create] ✅ Done. confirmedCount:', confirmedCount);
    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      reportId: newReport.id,
      confirmedItemsCount: confirmedCount,
      status: confirmedCount > 0 ? 'approved' : 'pending',
    });
  } catch (error) {
    console.error('[Reports/Create] ❌ Error:', error);
    return NextResponse.json(
      { message: 'Failed to create report' },
      { status: 500 },
    );
  }
});
