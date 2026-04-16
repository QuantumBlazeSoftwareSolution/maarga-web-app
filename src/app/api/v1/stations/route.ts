import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/src/lib/proxy';
import { getStationsEnriched } from '@/src/lib/db/stations/read';

/**
 * @swagger
 * /api/v1/stations:
 *   get:
 *     summary: Retrieve all fuel stations
 *     description: Returns a full list of all fuel stations currently registered in the Maarga system.
 *     tags:
 *       - Stations
 *     responses:
 *       200:
 *         description: A collection of fuel stations
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
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   latitude:
 *                     type: string
 *                   longitude:
 *                     type: string
 *                   type:
 *                     type: string
 *                   district:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   items:
 *                     type: array
 *                     description: Fuel/product availability items for this station
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         itemId:
 *                           type: string
 *                         itemName:
 *                           type: string
 *                         itemType:
 *                           type: string
 *                         availability:
 *                           type: string
 *                           enum: [available, low, out]
 *                   lastReport:
 *                     type: object
 *                     nullable: true
 *                     description: Latest approved report for this station
 *                     properties:
 *                       id:
 *                         type: string
 *                       queue:
 *                         type: string
 *                         enum: [no_queue, short, medium, long]
 *                       message:
 *                         type: string
 *                         nullable: true
 *                       status:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server-side failure while retrieving stations
 */
export const GET = withAuth(async (_req: NextRequest) => {
  try {
    const stations = await getStationsEnriched();
    const filteredStations = stations.filter(
      (station) => station.status === 'approved',
    );
    return NextResponse.json(filteredStations);
  } catch (error: unknown) {
    console.error('[API v1 Stations] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stations' },
      { status: 500 },
    );
  }
});