import { getItemsByStationId } from '@/src/lib/db/items/read';
import { getStationLastConfirmedReport } from '@/src/lib/db/report/read';
import { withAuth } from '@/src/lib/proxy';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v1/stations/items:
 *   get:
 *     summary: Get items and last confirmed report for a station
 *     description: Returns the list of fuel/product items for a specific station, alongside the most recently approved fuel report for that station.
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: query
 *         name: stationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the fuel station
 *     responses:
 *       200:
 *         description: Station items and last confirmed report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stationItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       itemId:
 *                         type: string
 *                         format: uuid
 *                       stationId:
 *                         type: string
 *                         format: uuid
 *                       availability:
 *                         type: string
 *                         enum: [available, low, out]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 lastConfirmedReport:
 *                   type: object
 *                   description: The most recent approved report for this station
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     stationId:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     queue:
 *                       type: string
 *                       enum: [no_queue, short, medium, long]
 *                     message:
 *                       type: string
 *                       nullable: true
 *                     status:
 *                       type: string
 *                       enum: [pending, approved, suspended]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing required query parameter `stationId`
 *       500:
 *         description: Server-side failure while retrieving station items
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const stationId = searchParams.get('stationId');
    console.log('[Stations/Items] ▶ stationId:', stationId);

    if (!stationId) {
      return NextResponse.json(
        { message: 'stationId is required' },
        { status: 400 },
      );
    }

    const [stationItems, lastConfirmedReport] = await Promise.all([
      getItemsByStationId(stationId),
      getStationLastConfirmedReport(stationId),
    ]);

    console.log('[Stations/Items] ✅ items found:', stationItems.length);
    console.log(
      '[Stations/Items] lastReport:',
      lastConfirmedReport?.id ?? 'none',
    );

    return NextResponse.json({
      stationItems,
      lastConfirmedReport,
    });
  } catch (error) {
    console.error('[Stations/Items] ❌ Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stations items' },
      { status: 500 },
    );
  }
});
