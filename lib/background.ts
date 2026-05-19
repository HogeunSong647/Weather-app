export interface BackgroundTheme {
  gradient: string;        // Tailwind 배경 클래스
  textColor: string;       // 메인 텍스트 색상
  subTextColor: string;    // 부제 텍스트 색상
  timeLabel: string;       // 현재 시간대 이름
  timeEmoji: string;       // 시간대 이모지
}

export function getBackgroundTheme(weatherDescription?: string): BackgroundTheme {
  const hour = new Date().getHours();

  // 비/눈 오는 날은 차분한 톤
  if (weatherDescription === '비' || weatherDescription === '이슬비' || weatherDescription === '천둥번개') {
    return {
      gradient: 'from-slate-600 via-slate-700 to-gray-800',
      textColor: 'text-white',
      subTextColor: 'text-white/70',
      timeLabel: '비 오는 날',
      timeEmoji: '🌧️',
    };
  }

  if (weatherDescription === '눈') {
    return {
      gradient: 'from-blue-200 via-slate-300 to-slate-400',
      textColor: 'text-slate-800',
      subTextColor: 'text-slate-700/80',
      timeLabel: '눈 오는 날',
      timeEmoji: '❄️',
    };
  }

  // 시간대별 (날씨 좋을 때)
  if (hour >= 5 && hour < 7) {
    return {
      gradient: 'from-pink-300 via-orange-300 to-yellow-300',
      textColor: 'text-orange-900',
      subTextColor: 'text-orange-800/80',
      timeLabel: '새벽',
      timeEmoji: '🌅',
    };
  }

  if (hour >= 7 && hour < 11) {
    return {
      gradient: 'from-sky-300 via-blue-400 to-blue-500',
      textColor: 'text-white',
      subTextColor: 'text-white/80',
      timeLabel: '아침',
      timeEmoji: '☀️',
    };
  }

  if (hour >= 11 && hour < 16) {
    return {
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      textColor: 'text-white',
      subTextColor: 'text-white/80',
      timeLabel: '낮',
      timeEmoji: '🌞',
    };
  }

  if (hour >= 16 && hour < 19) {
    return {
      gradient: 'from-orange-400 via-pink-500 to-purple-600',
      textColor: 'text-white',
      subTextColor: 'text-white/80',
      timeLabel: '저녁',
      timeEmoji: '🌆',
    };
  }

  if (hour >= 19 && hour < 23) {
    return {
      gradient: 'from-indigo-700 via-purple-800 to-slate-900',
      textColor: 'text-white',
      subTextColor: 'text-white/70',
      timeLabel: '밤',
      timeEmoji: '🌃',
    };
  }

  // 23시 ~ 5시
  return {
    gradient: 'from-slate-900 via-purple-950 to-black',
    textColor: 'text-white',
    subTextColor: 'text-white/60',
    timeLabel: '깊은 밤',
    timeEmoji: '🌙',
  };
}