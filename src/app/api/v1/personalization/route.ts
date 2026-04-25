import { NextResponse } from 'next/server';
import { getPersonalizationByUserId } from '@/src/lib/db/personalization/read';
import { upsertPersonalization } from '@/src/lib/db/personalization/write';
import { getUserByAuthId } from '@/src/lib/db/user/read';
import { withAuth } from '@/src/lib/proxy';

/**
 * @openapi
 * /api/v1/personalization:
 *   get:
 *     summary: Get personalization settings
 *     description: Fetch personalization settings for the authenticated user.
 *     tags:
 *       - Personalization
 *     responses:
 *       200:
 *         description: Successfully fetched settings
 *       404:
 *         description: Settings not found
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Update personalization settings
 *     description: Update preferred fuels and nearby alerts for the user.
 *     tags:
 *       - Personalization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferredFuels:
 *                 type: array
 *                 items:
 *                   type: string
 *               nearbyAlerts:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated settings
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 */

export const GET = withAuth(async (request: Request) => {
  try {
    const authId = request.headers.get('x-user-id');
    if (!authId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolve internal UUID from Firebase authId
    const { user } = await getUserByAuthId(authId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    const settings = await getPersonalizationByUserId(userId);
    if (!settings) {
      // Return a default empty state if not set yet
      return NextResponse.json({
        userId,
        preferredFuels: [],
        nearbyAlerts: true,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('API Personalization GET Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});

export const POST = withAuth(async (request: Request) => {
  try {
    const authId = request.headers.get('x-user-id');
    if (!authId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolve internal UUID from Firebase authId
    const { user } = await getUserByAuthId(authId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    const body = await request.json();
    const { preferredFuels, nearbyAlerts } = body;

    const updatedSettings = await upsertPersonalization({
      userId,
      preferredFuels: preferredFuels ?? [],
      nearbyAlerts: nearbyAlerts ?? true,
    });

    if (!updatedSettings) {
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('API Personalization POST Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
