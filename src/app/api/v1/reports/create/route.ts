import { withAuth } from '@/src/lib/proxy';
import { NextRequest, NextResponse } from 'next/server';
import { submitReportAction } from '@/src/lib/actions/report';

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
 *       500:
 *         description: Internal server error
 */
export const POST = withAuth(async (req: NextRequest) => {
  console.log('[Reports/Create] ▶ Request received');

  try {
    const body = await req.json();
    const { stationId, queue, message, items, userId: bodyAuthId } = body;
    const authId = req.headers.get('x-user-id') ?? bodyAuthId ?? null;

    // Delegate the entire process to the Action (Controller)
    const result = await submitReportAction({
      stationId,
      queue,
      message,
      authId,
      items,
    });

    if (!result.status) {
      return NextResponse.json(
        { message: result.message },
        { status: result.message === 'User not found.' ? 404 : 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      reportId: result.reportId,
      confirmedItemsCount: result.confirmedItemsCount || 0,
      status: (result.confirmedItemsCount || 0) > 0 ? 'approved' : 'pending',
    });
  } catch (error) {
    console.error('[Reports/Create] ❌ Error:', error);
    return NextResponse.json(
      { message: 'Failed to create report' },
      { status: 500 },
    );
  }
});
