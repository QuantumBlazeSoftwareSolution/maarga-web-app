import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/src/lib/proxy';
import { districtEnumItems } from '@/src/lib/db/schema/enum';

/**
 * @swagger
 * /api/v1/districts:
 *   get:
 *     summary: Retrieve all districts
 *     description: Returns a list of all districts available in the Maarga system.
 *     tags:
 *       - Districts
 *     responses:
 *       200:
 *         description: A collection of districts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Server-side failure while retrieving districts
 */
export const GET = withAuth(async (_req: NextRequest) => {
  try {
    return NextResponse.json(districtEnumItems);
  } catch (error: unknown) {
    console.error('[API v1 Districts] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch districts' },
      { status: 500 },
    );
  }
});
