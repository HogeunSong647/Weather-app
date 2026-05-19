'use client';

import { useEffect, useState } from 'react';
import { DailyWeather } from '@/types/weather';

interface WeatherAlarmProps {
  tomorrow: DailyWeather;
}

export default function WeatherAlarm({ tomorrow }: WeatherAlarmProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [lastNotified, setLastNotified] = useState<string>('');

  // 컴포넌트 시작 시 알림 권한 상태 확인
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    
    // 마지막 알림 날짜 불러오기 (중복 알림 방지)
    const saved = localStorage.getItem('lastWeatherNotification');
    if (saved) setLastNotified(saved);
  }, []);

  // 1분마다 시간 체크
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const today = now.toDateString();

      // 오후 5시 30분이고, 오늘 아직 알림 안 보냈으면
      if (hour === 17 && minute === 30 && lastNotified !== today) {
        sendNotification();
        localStorage.setItem('lastWeatherNotification', today);
        setLastNotified(today);
      }
    };

    // 즉시 한 번 체크 + 1분마다 반복
    checkTime();
    const interval = setInterval(checkTime, 60 * 1000);

    return () => clearInterval(interval);
  }, [lastNotified, tomorrow]);

  const sendNotification = () => {
    if (permission !== 'granted') return;

    const rainText = tomorrow.willRain 
      ? `☔ 비 예보! 우산 챙기세요 (강수확률 ${Math.round(tomorrow.pop * 100)}%)`
      : '☀️ 비 소식 없음';

    new Notification('🌤 내일 날씨 알림', {
      body: `${tomorrow.dayName}: ${tomorrow.description}\n🌡 최고 ${tomorrow.tempMax}° / 최저 ${tomorrow.tempMin}°\n${rainText}`,
      icon: '/favicon.ico',
    });
  };

  // 권한 요청
  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // 권한 받자마자 테스트 알림
        new Notification('✅ 알림 설정 완료!', {
          body: '매일 오후 5시 30분에 내일 날씨를 알려드릴게요.',
        });
      }
    }
  };

  // 테스트용: 지금 바로 알림 보내기
  const testNotification = () => {
    if (permission === 'granted') {
      sendNotification();
    } else {
      alert('먼저 알림 권한을 허용해주세요!');
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-6 border border-white/30">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-white">
          <p className="font-semibold">🔔 매일 오후 5:30 알림</p>
          <p className="text-sm text-white/80">
            {permission === 'granted' && '✅ 알림 활성화됨'}
            {permission === 'denied' && '❌ 알림이 차단되었어요. 브라우저 설정에서 허용해주세요.'}
            {permission === 'default' && '알림을 받으려면 권한을 허용해주세요'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {permission !== 'granted' && permission !== 'denied' && (
            <button
              onClick={requestPermission}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              알림 켜기
            </button>
          )}
          
          {permission === 'granted' && (
            <button
              onClick={testNotification}
              className="bg-white/30 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/40 transition"
            >
              테스트
            </button>
          )}
        </div>
      </div>
    </div>
  );
}