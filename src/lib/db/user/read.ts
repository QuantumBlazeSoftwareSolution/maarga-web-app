'use server';

import { eq, count } from 'drizzle-orm';
import { db } from '..';
import { User, usersTable } from '../schema/users';
import { reportsTable } from '../schema/reports';
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
    console.error('User find error:', error);
    return {
      status: false,
      message: 'User cannot find.',
    };
  }
}

export async function getUserByAuthId(authId: string): Promise<UserById> {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.authId, authId));
    return {
      message: 'User find success.',
      status: true,
      user: user[0],
    };
  } catch (error) {
    console.error('User find error:', error);
    return {
      status: false,
      message: 'User cannot find.',
    };
  }
}

export async function getUserProfileByAuthId(authId: string) {
  try {
    const userRes = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.authId, authId));

    if (!userRes.length) {
      return { status: false, message: 'User not found.' };
    }

    const user = userRes[0];

    const reportsCountResult = await db
      .select({ value: count() })
      .from(reportsTable)
      .where(eq(reportsTable.userId, user.id));

    return {
      status: true,
      message: 'User profile fetched.',
      data: {
        id: user.id,
        trustScore: parseFloat(user.trustScore ?? '1.0'),
        totalReports: reportsCountResult[0].value,
      },
    };
  } catch (error) {
    console.error('getUserProfileByAuthId error:', error);
    return { status: false, message: 'Internal error' };
  }
}
