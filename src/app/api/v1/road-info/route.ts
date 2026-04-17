import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/src/lib/proxy';
import { getAllRules } from '@/src/lib/db/rule-handbook/read';
import { getAllTrafficSigns } from '@/src/lib/db/traffic-sign/read';
import { getAllFines } from '@/src/lib/db/fine-guide/read';
import { getAllEmergencyContacts } from '@/src/lib/db/emergency-contacts/read';

/**
 * @swagger
 * /api/v1/road-info:
 *   get:
 *     summary: Retrieve all road rules and information content
 *     description: >
 *       Returns all four categories of road information in a single response:
 *       rule_handbook, traffic_sign, fine_guide, and emergency_contacts.
 *       The mobile app can use this endpoint to populate the Road Rules & Info
 *       section by displaying each category separately.
 *     tags:
 *       - Road Info
 *     responses:
 *       200:
 *         description: All road info content grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rules:
 *                   type: array
 *                   description: Road rules and regulations
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: object
 *                         description: Localized title (en, si)
 *                       description:
 *                         type: object
 *                         description: Localized description (en, si)
 *                       category:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 trafficSigns:
 *                   type: array
 *                   description: Traffic sign definitions
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: object
 *                         description: Localized name (en, si)
 *                       description:
 *                         type: object
 *                         description: Localized description (en, si)
 *                       imageUrl:
 *                         type: string
 *                       category:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 fines:
 *                   type: array
 *                   description: Traffic offense fine guide
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       offense:
 *                         type: object
 *                         description: Localized offense name (en, si)
 *                       description:
 *                         type: object
 *                         description: Localized description (en, si)
 *                       fineAmount:
 *                         type: string
 *                       section:
 *                         type: string
 *                         nullable: true
 *                 emergencyContacts:
 *                   type: array
 *                   description: Emergency contact numbers
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: object
 *                         description: Localized name (en, si)
 *                       description:
 *                         type: object
 *                         description: Localized description (en, si)
 *                       phone:
 *                         type: string
 *                       category:
 *                         type: string
 *       500:
 *         description: Server-side failure while retrieving road info
 */
export const GET = withAuth(async (_req: NextRequest) => {
  try {
    // Fetch all four categories in parallel — single network round-trip
    const [rules, trafficSigns, fines, emergencyContacts] = await Promise.all([
      getAllRules(),
      getAllTrafficSigns(),
      getAllFines(),
      getAllEmergencyContacts(),
    ]);

    return NextResponse.json({
      rules,
      trafficSigns,
      fines,
      emergencyContacts,
    });
  } catch (error: unknown) {
    console.error('[API v1 Road Info] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch road info' },
      { status: 500 },
    );
  }
});
