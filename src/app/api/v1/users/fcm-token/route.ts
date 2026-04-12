import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { fcmTokensTable } from '@/src/lib/db/schema/fcm-tokens';
import { withAuth } from '@/src/lib/proxy';

/**
 * @swagger
 * /api/v1/users/fcm-token:
 *   post:
 *     summary: Register or update a device FCM token
 *     description: Saves a Firebase Cloud Messaging token to Neon DB to enable push notifications for the user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authId
 *               - fcmToken
 *             properties:
 *               authId:
 *                 type: string
 *               fcmToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token registered successfully
 *       500:
 *         description: Server error
 */
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { authId, fcmToken } = body;

    if (!authId || !fcmToken) {
      return NextResponse.json(
        { message: 'authId and fcmToken are required' },
        { status: 400 }
      );
    }

    // Upsert the FCM token. If this exact token exists, we just update its updated_at timestamp.
    // If we wanted to ensure a user's single device updates its token, we might match on device ID.
    // But matching on the token itself and updating its record works fine for preventing duplicates.
    await db
      .insert(fcmTokensTable)
      .values({
        authId,
        token: fcmToken,
      })
      .onConflictDoUpdate({
        target: fcmTokensTable.token,
        set: {
          authId, // in case it was somehow assigned to someone else
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ message: 'Token registered successfully' }, { status: 200 });
  } catch (error) {
    console.error('[FCM TOKEN REGISTER] Error:', error);
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 500 }
    );
  }
});
