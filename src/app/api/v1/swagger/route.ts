import { NextResponse } from 'next/server';
import { getApiDocs } from '@/src/lib/swagger';

export async function GET() {
  try {
    const spec = await getApiDocs();
    return NextResponse.json(spec);
  } catch (error) {
    console.error('Failed to generate API docs:', error);
    return NextResponse.json({ error: 'Failed to generate API docs' }, { status: 500 });
  }
}
