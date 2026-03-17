import { eq } from 'drizzle-orm';
import { db } from '..';
import { User, usersTable } from '../schema/users';
import { DBOperationResponse } from '../types';

interface UserById extends DBOperationResponse {
  user?: User | null;
}

export async function getUserById(id: string): Promise<UserById> {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return {
      message: 'User find success.',
      status: true,
      user: user[0],
    };
  } catch (error) {
    return {
      status: false,
      message: 'User cannot find.',
    };
  }
}
