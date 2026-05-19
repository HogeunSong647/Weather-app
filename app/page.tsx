import { getWeatherForecast } from '@/lib/weather';
import WeatherCard from '@/components/WeatherCard';
import WeatherAlarm from '@/components/WeatherAlarm';

export default async function Home() {
  const forecast = await getWeatherForecast('Seoul');
  
  const today = forecast.daily[0];
  const tomorrow = forecast.daily[1]; // 알림용
  const restOfWeek = forecast.daily.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <header className="mb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🌤 내 날씨 대시보드
          </h1>
          <p className="text-white/80">
            📍 {forecast.city} · 오늘과 이번 주 날씨를 확인하세요
          </p>
        </header>

        {/* 알림 설정 */}
        {tomorrow && <WeatherAlarm tomorrow={tomorrow} />}

        {/* 오늘 날씨 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">
            ✨ 오늘 날씨
          </h2>
          {today && <WeatherCard weather={today} isHighlight />}
        </section>

        {/* 이번 주 예보 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            📅 이번 주 예보
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {restOfWeek.map((day) => (
              <WeatherCard key={day.date} weather={day} />
            ))}
          </div>
        </section>

        <footer className="mt-12 text-center text-white/60 text-sm">
          <p>데이터 제공: OpenWeather</p>
          <p className="mt-1">마지막 업데이트: {new Date().toLocaleString('ko-KR')}</p>
        </footer>
      </div>
    </main>
  );
}