import { NextResponse } from 'next/server';
import { upsertUser } from '@/src/lib/db/user/write';

/**
 * @openapi
 * /api/v1/auth/sync:
 *   post:
 *     summary: Sync user from mobile app
 *     description: Upserts a user in the database after successful mobile authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authId
 *               - email
 *             properties:
 *               authId:
 *                 type: string
 *                 example: "firebase_uid_123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: User synced successfully
 *       400:
 *         description: Missing authId or email
 *       500:
 *         description: Failed to sync user or internal server error
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authId, email, name } = body;

    if (!authId || !email) {
      return NextResponse.json({ error: 'Missing authId or email' }, { status: 400 });
    }

    const user = await upsertUser({
      authId,
      email,
      name,
    });

    if (!user) {
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('API Sync Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
