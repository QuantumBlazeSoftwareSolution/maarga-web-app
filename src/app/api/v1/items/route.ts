import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/src/lib/proxy';
import { getAllItems } from '@/src/lib/db/items/read';

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Retrieve all item types
 *     description: Returns a list of all fuel and service item types available in the Maarga system.
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: A collection of items
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
 *                   sinhalaName:
 *                     type: string
 *                     nullable: true
 *                   description:
 *                     type: string
 *                     nullable: true
 *                   itemType:
 *                     type: string
 *                     enum: [fuel, extra]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server-side failure while retrieving items
 */
export const GET = withAuth(async (_req: NextRequest) => {
  try {
    const items = await getAllItems();
    const fuelTypeItems = items.filter((item) => item.itemType === 'fuel');
    return NextResponse.json(fuelTypeItems);
  } catch (error: unknown) {
    console.error('[API v1 Items] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch items' },
      { status: 500 },
    );
  }
});
