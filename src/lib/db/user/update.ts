import { eq } from 'drizzle-orm';
import { db } from '..';
import { usersTable } from '../schema/users';
import { DBOperationResponse } from '../types';

export async function updateUserTrustScore(
  userId: string,
  newScore: number,
): Promise<DBOperationResponse> {
  try {
    await db
      .update(usersTable)
      .set({
        trustScore: newScore.toFixed(2),
      })
      .where(eq(usersTable.id, userId));

    return {
      status: true,
      message: 'User trust score updated successfully.',
    };
  } catch (error) {
    console.error('Update user trust score DB error:', error);
    return {
      status: false,
      message: 'Failed to update user trust score.',
    };
  }
}
