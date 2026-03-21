import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/src/lib/proxy';
import { getStations } from '@/src/lib/db/stations/read';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const stations = await getStations();
    return NextResponse.json(stations);
  } catch (error) {
    console.error('[API v1 Stations] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
});
