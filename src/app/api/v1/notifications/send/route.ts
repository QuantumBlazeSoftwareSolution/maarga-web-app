import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { fcmTokensTable } from '@/src/lib/db/schema/fcm-tokens';
import { withAuth } from '@/src/lib/proxy';
import { messaging } from '@/src/lib/firebase-admin';
import { inArray } from 'drizzle-orm';

/**
 * @swagger
 * /api/v1/notifications/send:
 *   post:
 *     summary: Send a push notification to specific users
 *     description: Uses multicast to send push notifications to all registered devices of the provided users. It also cleans up unregistered and invalid tokens from Neon DB automatically to save costs.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *               - title
 *               - body
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification batch sent
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const { userIds, title, body, imageUrl } = await req.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { message: 'userIds array is required and must not be empty' },
        { status: 400 }
      );
    }
    if (!title || !body) {
      return NextResponse.json(
        { message: 'title and body are required' },
        { status: 400 }
      );
    }

    // 1. Query DB to find all matching FCM tokens matching the user AuthIds
    const records = await db
      .select({ token: fcmTokensTable.token })
      .from(fcmTokensTable)
      .where(inArray(fcmTokensTable.authId, userIds));

    const tokens = records.map((r) => r.token);

    if (tokens.length === 0) {
      return NextResponse.json(
        { message: 'No registered tokens found for these users' },
        { status: 200 }
      );
    }

    // FCM Multicast allows up to 500 tokens per call.
    // If you have more than 500, you need to chunk the array.
    // For this implementation, we assume chunks of up to 500 for a batch.
    const CHUNK_SIZE = 500;
    let successCount = 0;
    let failureCount = 0;
    const tokensToRemove: string[] = [];

    // Chunking array to safely stay within firebase multicast limits
    for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
      const tokenChunk = tokens.slice(i, i + CHUNK_SIZE);
      
      const payload = {
        tokens: tokenChunk,
        notification: {
          title,
          body,
          ...(imageUrl && { imageUrl }),
        },
        android: {
          priority: 'high' as const,
          notification: {
            sound: 'default',
            channelId: 'high_importance_channel', // Maps to the Flutter setup
            ...(imageUrl && { imageUrl }),
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              // mutableContent required for iOS rich media
              mutableContent: true, 
            },
          },
          ...(imageUrl && { fcmOptions: { imageUrl } }),
        },
      };

      // 2. Multicast send
      const response = await messaging.sendEachForMulticast(payload);
      
      successCount += response.successCount;
      failureCount += response.failureCount;

      // 3. Process failures & identify ghost/unregistered tokens
      if (response.failureCount > 0) {
        response.responses.forEach((resp: any, idx: number) => {
          if (!resp.success && resp.error) {
            const errorCode = resp.error.code;
            if (
              errorCode === 'messaging/invalid-registration-token' ||
              errorCode === 'messaging/registration-token-not-registered'
            ) {
              tokensToRemove.push(tokenChunk[idx]);
            }
          }
        });
      }
    }

    // 4. Cleanup dead tokens strictly from Neon DB to save cost + free-tier allowance
    if (tokensToRemove.length > 0) {
      try {
        await db
          .delete(fcmTokensTable)
          .where(inArray(fcmTokensTable.token, tokensToRemove));
        
        console.log(`[FCM CLEANUP] Deleted ${tokensToRemove.length} inactive tokens.`);
      } catch (cleanupError) {
        console.error('[FCM CLEANUP] Failed to delete dead tokens:', cleanupError);
      }
    }

    return NextResponse.json(
      { 
        message: 'Multicast operation complete',
        results: { successCount, failureCount, cleanedUpTokens: tokensToRemove.length }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[FCM MULTICAST] Error:', error);
    return NextResponse.json(
      { message: 'Failed to process notification request' },
      { status: 500 }
    );
  }
});
