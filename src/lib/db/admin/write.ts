import { db } from '..';
import { Admin, AdminInsert, adminTable } from '../schema/admin';

export async function createAdmin({
  admin,
}: {
  admin: AdminInsert;
}): Promise<Admin | null> {
  try {
    const [createdAdmin] = await db
      .insert(adminTable)
      .values(admin)
      .returning();
    return createdAdmin;
  } catch (error) {
    console.error('Error creating admin:', error);
    return null;
  }
}
