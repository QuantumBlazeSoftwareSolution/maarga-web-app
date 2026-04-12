'use server';

import { db } from '@/src/lib/db';
import { fcmTokensTable } from '@/src/lib/db/schema/fcm-tokens';
import { usersTable } from '@/src/lib/db/schema/users';
import { eq, inArray } from 'drizzle-orm';

export async function getUsersWithFcmTokens() {
  try {
    // Left join users with tokens to find users who have registered
    const results = await db
      .select({
        authId: usersTable.authId,
        name: usersTable.name,
        email: usersTable.email,
        token: fcmTokensTable.token,
      })
      .from(fcmTokensTable)
      .innerJoin(usersTable, eq(fcmTokensTable.authId, usersTable.authId));

    // Groups tokens by user since a user can have multiple devices
    const userMap = new Map<string, any>();
    
    results.forEach((row) => {
      if (!userMap.has(row.authId)) {
        userMap.set(row.authId, {
          authId: row.authId,
          name: row.name || 'Unknown User',
          email: row.email,
          tokens: 1,
        });
      } else {
        const user = userMap.get(row.authId);
        user.tokens += 1;
      }
    });

    return Array.from(userMap.values());
  } catch (error) {
    console.error('Error fetching FCM users:', error);
    return [];
  }
}

import { getMessaging } from '@/src/lib/firebase-admin';

export async function sendTestNotification(
  userIds: string[],
  title: string,
  body: string,
  imageUrl?: string
) {
  try {
    if (!userIds || userIds.length === 0) throw new Error("Select at least one user.");
    
    const records = await db
      .select({ token: fcmTokensTable.token })
      .from(fcmTokensTable)
      .where(inArray(fcmTokensTable.authId, userIds));

    const tokens = records.map((r) => r.token);
    if (tokens.length === 0) throw new Error("No tokens registered for the selected users.");

    const payload = {
      tokens,
      notification: {
        title,
        body,
        ...(imageUrl && { imageUrl }),
      },
      android: {
        priority: 'high' as const,
        notification: {
          sound: 'default',
          channelId: 'high_importance_channel',
          ...(imageUrl && { imageUrl }),
        },
      },
    };

    const response = await getMessaging().sendEachForMulticast(payload);

    let tokensToRemove: string[] = [];
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error) {
          const errorCode = resp.error.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            tokensToRemove.push(tokens[idx]);
          }
        }
      });
    }

    if (tokensToRemove.length > 0) {
      await db
        .delete(fcmTokensTable)
        .where(inArray(fcmTokensTable.token, tokensToRemove));
    }

    return { 
      success: true, 
      data: { 
        results: { 
          successCount: response.successCount, 
          failureCount: response.failureCount, 
          cleanedUpTokens: tokensToRemove.length 
        } 
      } 
    };
  } catch (error: any) {
    console.error('Send test notification error:', error);
    return { success: false, error: error.message };
  }
}
