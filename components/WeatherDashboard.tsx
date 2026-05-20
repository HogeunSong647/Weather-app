'use client';

import { useEffect, useState, useCallback } from 'react';
import { WeatherForecast } from '@/types/weather';
import { getBackgroundTheme, BackgroundTheme } from '@/lib/background';
import WeatherCard from './WeatherCard';
import WeatherAlarm from './WeatherAlarm';
import HourlyForecast from './HourlyForecast';

interface WeatherDashboardProps {
  initialForecast: WeatherForecast | null;
  initialError: string | null;
}

export default function WeatherDashboard({ initialForecast, initialError }: WeatherDashboardProps) {
  const [forecast, setForecast] = useState<WeatherForecast | null>(initialForecast);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState('');

  const today = forecast?.daily[0];
  const tomorrow = forecast?.daily[1];
  const restOfWeek = forecast?.daily.slice(1) ?? [];

  const [theme, setTheme] = useState<BackgroundTheme>(() =>
    getBackgroundTheme(today?.description)
  );

  useEffect(() => {
    const updateTheme = () => setTheme(getBackgroundTheme(today?.description));
    updateTheme();
    const interval = setInterval(updateTheme, 60 * 1000);
    return () => clearInterval(interval);
  }, [today?.description]);

  const fetchWeather = useCallback(async (query: string | { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    try {
      const params =
        typeof query === 'string'
          ? `city=${encodeURIComponent(query)}`
          : `lat=${query.lat}&lon=${query.lon}`;
      const res = await fetch(`/api/weather?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '날씨 데이터를 불러올 수 없습니다.');
      setForecast(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (cityInput.trim()) fetchWeather(cityInput.trim());
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        setError('위치 정보를 가져올 수 없습니다.');
        setLoading(false);
      }
    );
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-4 md:p-6 transition-all duration-1000`}>
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <header className="mb-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.textColor} mb-1`}>
            {theme.timeEmoji} 내 날씨 대시보드
          </h1>
          {forecast && (
            <p className={`text-sm ${theme.subTextColor}`}>
              📍 {forecast.city} · {theme.timeLabel}이에요
            </p>
          )}
        </header>

        {/* 도시 검색 */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="도시 검색 (예: Busan, Tokyo, New York)"
            className="flex-1 px-4 py-2 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-white/90 text-gray-700 rounded-xl font-semibold hover:bg-white transition disabled:opacity-50 text-sm"
          >
            🔍
          </button>
          <button
            type="button"
            onClick={handleGPS}
            disabled={loading}
            title="현재 위치 날씨"
            className="px-4 py-2 bg-white/20 text-white rounded-xl border border-white/30 hover:bg-white/30 transition disabled:opacity-50 text-sm"
          >
            📍
          </button>
        </form>

        {/* 에러 */}
        {error && (
          <div className="bg-red-100 text-red-700 rounded-xl px-4 py-3 mb-4 flex items-center justify-between text-sm">
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-400 hover:text-red-600 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className={`text-center py-6 ${theme.textColor} font-semibold animate-pulse text-sm`}>
            🔄 날씨 정보를 불러오는 중...
          </div>
        )}

        {forecast && !loading && (
          <>
            {/* 알림 설정 */}
            {tomorrow && <WeatherAlarm tomorrow={tomorrow} />}

            {/* 오늘 날씨 + 시간대별 (2열) */}
            <section className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className={`text-sm font-semibold ${theme.textColor} mb-2`}>✨ 오늘 날씨</h2>
                {today && <WeatherCard weather={today} isHighlight />}
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${theme.textColor} mb-2`}>🕐 시간대별 예보</h2>
                <HourlyForecast
                  hourly={forecast.todayHourly}
                  rainPeriod={forecast.todayRainPeriod}
                />
              </div>
            </section>

            {/* 이번 주 예보 */}
            <section>
              <h2 className={`text-sm font-semibold ${theme.textColor} mb-2`}>📅 이번 주 예보</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {restOfWeek.map((day) => (
                  <WeatherCard key={day.date} weather={day} />
                ))}
              </div>
            </section>

            <footer className={`mt-8 text-center ${theme.subTextColor} text-xs`}>
              <p>데이터 제공: OpenWeather · 마지막 업데이트: {new Date().toLocaleString('ko-KR')}</p>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
