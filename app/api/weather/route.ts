import { getWeatherForecast } from '@/lib/weather';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const city = params.get('city');
  const lat = params.get('lat');
  const lon = params.get('lon');

  try {
    const query =
      lat && lon
        ? { lat: parseFloat(lat), lon: parseFloat(lon) }
        : (city ?? 'Seoul');

    const forecast = await getWeatherForecast(query);
    return NextResponse.json(forecast);
  } catch (e) {
    const message = e instanceof Error ? e.message : '날씨 데이터를 불러올 수 없습니다.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
