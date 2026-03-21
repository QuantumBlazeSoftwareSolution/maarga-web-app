import { NextResponse } from 'next/server';
import { getApiDocs } from '@/src/lib/swagger';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ version: string }> },
) {
  try {
    const { version } = await params;
    const spec = await getApiDocs(version);
    return NextResponse.json(spec);
  } catch (error) {
    console.error('Swagger Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate API docs' },
      { status: 500 },
    );
  }
}
