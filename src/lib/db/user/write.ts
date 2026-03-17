import { db } from '..';
import { User, UserInsert, usersTable } from '../schema/users';

export async function createUser(user: UserInsert): Promise<User | null> {
  try {
    const newUser = await db.insert(usersTable).values(user).returning();
    return newUser[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}
