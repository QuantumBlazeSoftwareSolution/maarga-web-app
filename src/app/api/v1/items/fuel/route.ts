import { NextResponse } from 'next/server';
import { getFuelItems } from '@/src/lib/db/items/read';
import { withAuth } from '@/src/lib/proxy';

/**
 * @openapi
 * /api/v1/items/fuel:
 *   get:
 *     summary: Get all fuel items
 *     description: Fetch a list of all items categorized as fuel.
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Successfully fetched fuel items
 *       500:
 *         description: Internal server error
 */
export const GET = withAuth(async (request: Request) => {
  try {
    console.log('[API] Fetching fuel items...');
    const fuels = await getFuelItems();
    console.log(`[API] Found ${fuels.length} fuel items.`);
    return NextResponse.json({ success: true, data: fuels });
  } catch (error) {
    console.error('API Fuel Items GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
