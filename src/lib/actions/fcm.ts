'use server';

import { db } from '@/src/lib/db';
import { fcmTokensTable } from '@/src/lib/db/schema/fcm-tokens';
import { usersTable } from '@/src/lib/db/schema/users';
import { eq } from 'drizzle-orm';

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

export async function sendTestNotification(
  userIds: string[],
  title: string,
  body: string,
  imageUrl?: string
) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/v1/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.DEV_API_KEY || '',
      },
      body: JSON.stringify({ userIds, title, body, imageUrl }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to send notification');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Send test notification error:', error);
    return { success: false, error: error.message };
  }
}
