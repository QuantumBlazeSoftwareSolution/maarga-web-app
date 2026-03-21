'use server';

import { db } from '..';
import { Admin, adminTable } from '../schema/admin';
import { eq } from 'drizzle-orm';

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    const admin = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.email, email));
    return admin[0];
  } catch (error) {
    console.error('Admin read error:', error);
    return null;
  }
}
