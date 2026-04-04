import { NextResponse } from 'next/server';
import { submitNewStationReportAction } from '@/src/lib/actions/report';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authId, latitude, longitude } = body;

    if (!authId || !latitude || !longitude) {
      return NextResponse.json(
        { status: false, message: 'Missing required parameters.' },
        { status: 400 },
      );
    }

    const result = await submitNewStationReportAction({
      authId,
      latitude,
      longitude,
    });

    if (result.status) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error /v1/reports/new-station/create:', error);
    return NextResponse.json(
      { status: false, message: 'An internal error occurred.' },
      { status: 500 },
    );
  }
}
