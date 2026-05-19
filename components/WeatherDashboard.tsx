'use client';

import { useEffect, useState } from 'react';
import { WeatherForecast } from '@/types/weather';
import { getBackgroundTheme, BackgroundTheme } from '@/lib/background';
import WeatherCard from './WeatherCard';
import WeatherAlarm from './WeatherAlarm';
import HourlyForecast from './HourlyForecast';

interface WeatherDashboardProps {
  forecast: WeatherForecast;
}

export default function WeatherDashboard({ forecast }: WeatherDashboardProps) {
  const today = forecast.daily[0];
  const tomorrow = forecast.daily[1];
  const restOfWeek = forecast.daily.slice(1);

  const [theme, setTheme] = useState<BackgroundTheme>(() => 
    getBackgroundTheme(today?.description)
  );

  useEffect(() => {
    const updateTheme = () => {
      setTheme(getBackgroundTheme(today?.description));
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60 * 1000);

    return () => clearInterval(interval);
  }, [today?.description]);

  return (
    <main className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-4 md:p-8 transition-all duration-1000`}>
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <header className="mb-6 text-center md:text-left">
          <h1 className={`text-3xl md:text-4xl font-bold ${theme.textColor} mb-2`}>
            {theme.timeEmoji} 내 날씨 대시보드
          </h1>
          <p className={theme.subTextColor}>
            📍 {forecast.city} · {theme.timeLabel}이에요
          </p>
        </header>

        {/* 알림 설정 */}
        {tomorrow && <WeatherAlarm tomorrow={tomorrow} />}

        {/* 오늘 날씨 */}
        <section className="mb-8">
          <h2 className={`text-xl font-semibold ${theme.textColor} mb-3`}>
            ✨ 오늘 날씨
          </h2>
          {today && <WeatherCard weather={today} isHighlight />}
        </section>

        {/* 👇 추가: 시간대별 예보 */}
        <section className="mb-8">
          <HourlyForecast 
            hourly={forecast.todayHourly} 
            rainPeriod={forecast.todayRainPeriod} 
          />
        </section>

        {/* 이번 주 예보 */}
        <section>
          <h2 className={`text-xl font-semibold ${theme.textColor} mb-3`}>
            📅 이번 주 예보
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {restOfWeek.map((day) => (
              <WeatherCard key={day.date} weather={day} />
            ))}
          </div>
        </section>

        <footer className={`mt-12 text-center ${theme.subTextColor} text-sm`}>
          <p>데이터 제공: OpenWeather</p>
          <p className="mt-1">마지막 업데이트: {new Date().toLocaleString('ko-KR')}</p>
        </footer>
      </div>
    </main>
  );
}