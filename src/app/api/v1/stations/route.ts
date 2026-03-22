import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/src/lib/proxy';
import { getStations } from '@/src/lib/db/stations/read';

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
 *       500:
 *         description: Server-side failure while retrieving stations
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const stations = await getStations();
    return NextResponse.json(stations);
  } catch (error) {
    console.error('[API v1 Stations] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stations' },
      { status: 500 },
    );
  }
});
