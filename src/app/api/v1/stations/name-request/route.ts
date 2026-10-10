import { NextResponse } from 'next/server';
import { submitStationNameRequestAction } from '@/src/lib/actions/station-requests';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authId, stationId, suggestedName } = body;

    if (!authId || !stationId || !suggestedName) {
      return NextResponse.json(
        { status: false, message: 'Missing required parameters.' },
        { status: 400 },
      );
    }

    const result = await submitStationNameRequestAction({
      authId,
      stationId,
      suggestedName,
    });

    if (result.status) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error /v1/stations/name-request:', error);
    return NextResponse.json(
      { status: false, message: 'An internal error occurred.' },
      { status: 500 },
    );
  }
}

