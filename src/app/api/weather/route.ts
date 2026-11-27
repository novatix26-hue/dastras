import { NextResponse } from 'next/server';
import { getLiveWeather } from '@/lib/api/weather';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const city = url.searchParams.get('city') || 'Islamabad';
  const data = await getLiveWeather(city);
  if (!data) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}
