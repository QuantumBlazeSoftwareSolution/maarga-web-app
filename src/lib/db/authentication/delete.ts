import { db } from '..';
import { authenticationTable } from '../schema/authentication';
import { eq } from 'drizzle-orm';

export async function deleteAuthentication(adminId: string): Promise<boolean> {
  try {
    await db
      .delete(authenticationTable)
      .where(eq(authenticationTable.adminId, adminId));

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
