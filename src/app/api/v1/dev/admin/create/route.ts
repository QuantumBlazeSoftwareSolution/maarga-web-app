import { NextResponse } from 'next/server';
import { getAdminByEmail } from '@/src/lib/db/admin/read';
import { createAdmin } from '@/src/lib/db/admin/write';
import {
  adminRoleEnumItems,
  userStatusEnumItems,
} from '@/src/lib/db/schema/enum';

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('X-API-KEY');
    if (apiKey !== process.env.DEV_API_KEY) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { email, role, status } = await req.json();

    const isValidRole = adminRoleEnumItems.includes(role);
    const isValidStatus = userStatusEnumItems.includes(status);

    if (!isValidRole || !isValidStatus) {
      return NextResponse.json(
        { message: 'Invalid role or status' },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 },
      );
    }

    const existing = await getAdminByEmail(email);

    if (existing) {
      return NextResponse.json(
        { message: 'Admin already exists' },
        { status: 409 },
      );
    }

    const admin = await createAdmin({
      admin: {
        email,
        role: role || 'admin',
        status: status || 'active',
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: 'Failed to create admin' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: 'Admin created successfully',
        admin: { id: admin.id, email: admin.email, role: admin.role },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create Admin API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
