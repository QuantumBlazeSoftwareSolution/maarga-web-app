import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { Authentication, authenticationTable } from '../schema/authentication';

export async function getAuthentication({
  adminId,
  otp,
}: {
  adminId: string;
  otp: string;
}): Promise<Authentication | null> {
  try {
    const authEntry = await db
      .select()
      .from(authenticationTable)
      .where(
        and(
          eq(authenticationTable.adminId, adminId),
          eq(authenticationTable.otp, otp),
        ),
      );
    return authEntry[0];
  } catch (error) {
    console.error('Authentication read error:', error);
    return null;
  }
}
