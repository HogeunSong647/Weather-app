'use client';

import { useEffect, useState } from 'react';
import { DailyWeather } from '@/types/weather';

interface WeatherAlarmProps {
  tomorrow: DailyWeather;
}

const DEFAULT_TIME = '17:30';

export default function WeatherAlarm({ tomorrow }: WeatherAlarmProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [lastNotified, setLastNotified] = useState<string>('');
  const [notifyTime, setNotifyTime] = useState(DEFAULT_TIME);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission);
    const saved = localStorage.getItem('lastWeatherNotification');
    if (saved) setLastNotified(saved);
    const savedTime = localStorage.getItem('weatherNotifyTime');
    if (savedTime) setNotifyTime(savedTime);
  }, []);

  const [notifyHour, notifyMinute] = notifyTime.split(':').map(Number);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const today = now.toDateString();
      if (
        now.getHours() === notifyHour &&
        now.getMinutes() === notifyMinute &&
        lastNotified !== today
      ) {
        sendNotification();
        localStorage.setItem('lastWeatherNotification', today);
        setLastNotified(today);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [lastNotified, notifyHour, notifyMinute, tomorrow]);

  const sendNotification = () => {
    if (permission !== 'granted') return;
    const rainText = tomorrow.willRain
      ? `☔ 비 예보! 우산 챙기세요 (${Math.round(tomorrow.pop * 100)}%)`
      : '☀️ 비 소식 없음';
    new Notification('🌤 내일 날씨 알림', {
      body: `${tomorrow.dayName}: ${tomorrow.description}\n🌡 최고 ${tomorrow.tempMax}° / 최저 ${tomorrow.tempMin}°\n${rainText}`,
      icon: '/favicon.ico',
    });
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification('✅ 알림 설정 완료!', {
        body: `매일 ${notifyTime}에 내일 날씨를 알려드릴게요.`,
      });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifyTime(e.target.value);
    localStorage.setItem('weatherNotifyTime', e.target.value);
  };

  return (
    <div className="bg-white/20 backdrop-blur rounded-xl p-3 mb-4 border border-white/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-white">
          <p className="text-sm font-semibold">
            🔔 날씨 알림{' '}
            {permission === 'granted' && (
              <span className="text-white/80 font-normal">· {notifyTime} 예정</span>
            )}
          </p>
          <p className="text-xs text-white/70 mt-0.5">
            {permission === 'granted' && '✅ 활성화됨'}
            {permission === 'denied' && '❌ 차단됨 — 브라우저 설정에서 허용해주세요'}
            {permission === 'default' && '알림을 허용하면 매일 날씨를 알려드려요'}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {permission === 'granted' && (
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="text-white/70 hover:text-white text-xs px-2 py-1 rounded-lg border border-white/20 hover:border-white/40 transition"
            >
              ⚙️ 시간 설정
            </button>
          )}
          {permission === 'granted' && (
            <button
              onClick={sendNotification}
              className="bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-white/40 transition"
            >
              테스트
            </button>
          )}
          {permission !== 'granted' && permission !== 'denied' && (
            <button
              onClick={requestPermission}
              className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
            >
              알림 켜기
            </button>
          )}
        </div>
      </div>

      {showSettings && permission === 'granted' && (
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-3">
          <label className="text-white text-xs">알림 시간</label>
          <input
            type="time"
            value={notifyTime}
            onChange={handleTimeChange}
            className="bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-sm focus:outline-none focus:bg-white/30"
          />
          <span className="text-white/60 text-xs">에 내일 날씨 알림</span>
        </div>
      )}
    </div>
  );
}
