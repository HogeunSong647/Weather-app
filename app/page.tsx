import { getWeatherForecast } from '@/lib/weather';
import WeatherCard from '@/components/WeatherCard';

export default async function Home() {
  const forecast = await getWeatherForecast('Seoul');
  
  // 첫 번째 데이터는 오늘이므로, 내일은 두 번째 데이터
  const tomorrow = forecast.daily[1];
  // 그 이후 5일치 (모레부터)
  const restOfWeek = forecast.daily.slice(2);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🌤 내 날씨 대시보드
          </h1>
          <p className="text-white/80">
            📍 {forecast.city} · 퇴근 전, 내일 날씨를 확인하세요
          </p>
        </header>

        {/* 내일 날씨 (강조) */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">
            ✨ 내일 날씨
          </h2>
          {tomorrow && <WeatherCard weather={tomorrow} isHighlight />}
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

        {/* 푸터 */}
        <footer className="mt-12 text-center text-white/60 text-sm">
          <p>데이터 제공: OpenWeather</p>
          <p className="mt-1">마지막 업데이트: {new Date().toLocaleString('ko-KR')}</p>
        </footer>
      </div>
    </main>
  );
}