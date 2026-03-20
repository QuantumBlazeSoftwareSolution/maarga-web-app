'use server';

import { db } from '..';
import { User, UserInsert, usersTable } from '../schema/users';

export async function upsertUser(user: UserInsert): Promise<User | null> {
  try {
    const result = await db
      .insert(usersTable)
      .values(user)
      .onConflictDoUpdate({
        target: usersTable.authId,
        set: {
          name: user.name,
          email: user.email,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error upserting user:', error);
    return null;
  }
}

export async function createUser(user: UserInsert): Promise<User | null> {
  try {
    const newUser = await db.insert(usersTable).values(user).returning();
    return newUser[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}
