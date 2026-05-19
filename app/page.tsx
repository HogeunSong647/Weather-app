import { getWeatherForecast } from '@/lib/weather';
import WeatherDashboard from '@/components/WeatherDashboard';

export default async function Home() {
  const forecast = await getWeatherForecast('Seoul');

  return <WeatherDashboard forecast={forecast} />;
}