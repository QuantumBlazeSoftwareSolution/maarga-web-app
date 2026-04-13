import { withAuth } from '@/src/lib/proxy';
import { NextRequest, NextResponse } from 'next/server';
import { updateUserQRCodes } from '@/src/lib/db/user/update';

/**
 * @swagger
 * /api/v1/users/qr-codes:
 *   put:
 *     summary: Update user's saved QR codes
 *     description: Overwrites the user's saved QR codes with the provided array.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrCodes
 *             properties:
 *               qrCodes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       200:
 *         description: QR codes updated successfully
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const authId = req.headers.get('x-user-id');
    
    if (!authId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { qrCodes } = body;

    if (!Array.isArray(qrCodes)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: qrCodes must be an array' },
        { status: 400 }
      );
    }

    const result = await updateUserQRCodes(authId, qrCodes);

    if (!result.status) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'QR codes updated successfully',
    });
  } catch (error) {
    console.error('[Users/QR-Codes] Error updating QR codes:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
