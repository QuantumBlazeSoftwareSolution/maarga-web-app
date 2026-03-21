import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { adminTable } from '@/src/lib/db/schema/admin';
import { eq } from 'drizzle-orm';
import { getAdminByEmail } from '@/src/lib/db/admin/read';
import { createAdmin } from '@/src/lib/db/admin/write';

/**
 * @openapi
 * /api/v1/dev/admin/create:
 *   post:
 *     summary: Create a new admin account
 *     description: External API for developers to seed admin accounts via Postman.
 *     tags:
 *       - Developer Back-door
 *     parameters:
 *       - in: header
 *         name: X-API-KEY
 *         required: true
 *         schema:
 *           type: string
 *         description: Developer API Key for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: dev@maarga.lk
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin]
 *                 default: admin
 *               status:
 *                 type: string
 *                 enum: [pending, active, inactive]
 *                 default: active
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       401:
 *         description: Unauthorized - Invalid API Key
 *       400:
 *         description: Bad Request - Missing email or invalid data
 *       409:
 *         description: Conflict - Email already exists
 */
export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('X-API-KEY');
    if (apiKey !== process.env.DEV_API_KEY) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { email, role, status } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 },
      );
    }

    // Check if exists
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
