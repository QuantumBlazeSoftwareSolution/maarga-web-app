import { withAuth } from '@/src/lib/proxy';
import { NextRequest, NextResponse } from 'next/server';

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    return NextResponse.json({ message: 'Report created successfully' });
  } catch (error) {
    console.error('[API v1 Reports] Error:', error);
    return NextResponse.json(
      { message: 'Failed to create report' },
      { status: 500 },
    );
  }
});
