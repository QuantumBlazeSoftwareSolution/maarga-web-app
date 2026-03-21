import { db } from '..';
import { Authentication, authenticationTable } from '../schema/authentication';

export async function createAuthentication(
  adminId: string,
  otp: string,
  expiresAt: Date,
): Promise<Authentication | null> {
  try {
    const auth = await db
      .insert(authenticationTable)
      .values({
        adminId,
        otp,
        expiresAt,
      })
      .returning();

    return auth[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}
