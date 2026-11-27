import { NextResponse } from 'next/server';
import { getLivePrayerTimings } from '@/lib/api/prayer';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const city = url.searchParams.get('city') || 'Islamabad';
  const data = await getLivePrayerTimings(city);
  if (!data) {
    return NextResponse.json({ error: 'Prayer timings failed' }, { status: 404 });
  }
  return NextResponse.json(data);
}
