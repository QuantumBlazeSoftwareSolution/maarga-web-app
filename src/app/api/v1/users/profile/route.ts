import { withAuth } from '@/src/lib/proxy';
import { NextRequest, NextResponse } from 'next/server';
import { getUserProfileByAuthId } from '@/src/lib/db/user/read';

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get user profile details
 *     description: Returns the user's trust score, total reports, and other profile details.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     trustScore:
 *                       type: number
 *                     totalReports:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const authId = req.headers.get('x-user-id');
    
    if (!authId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await getUserProfileByAuthId(authId);

    if (!result.status) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('[Users/Profile] Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
