import { getWeatherForecast } from '@/lib/weather';
import WeatherDashboard from '@/components/WeatherDashboard';
import { WeatherForecast } from '@/types/weather';

export default async function Home() {
  let forecast: WeatherForecast | null = null;
  let error: string | null = null;

  try {
    forecast = await getWeatherForecast('Seoul');
  } catch (e) {
    error = e instanceof Error ? e.message : '날씨 데이터를 불러올 수 없습니다.';
  }

  return <WeatherDashboard initialForecast={forecast} initialError={error} />;
}
