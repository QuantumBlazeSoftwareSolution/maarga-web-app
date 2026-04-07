import { withAuth } from '@/src/lib/proxy';
import { NextRequest, NextResponse } from 'next/server';
import { getRecentReports } from '@/src/lib/actions/report';

/**
 * @swagger
 * /api/v1/reports/recent:
 *   get:
 *     summary: Retrieve the 20 most recent fuel reports
 *     description: Returns the latest 20 fuel station reports, ordered by newest first.
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: A list of the most recent reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   stationId:
 *                     type: string
 *                   stationName:
 *                     type: string
 *                   userName:
 *                     type: string
 *                   queue:
 *                     type: string
 *                     enum: [no_queue, short, medium, long]
 *                   message:
 *                     type: string
 *                     nullable: true
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, suspended]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         itemName:
 *                           type: string
 *                         availability:
 *                           type: string
 *                           enum: [available, low, out]
 *       500:
 *         description: Server-side failure while retrieving reports
 */
export const GET = withAuth(async (_req: NextRequest) => {
  try {
    const reports = await getRecentReports();
    return NextResponse.json(reports);
  } catch (error: unknown) {
    console.error('[API v1 Reports] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reports' },
      { status: 500 },
    );
  }
});
