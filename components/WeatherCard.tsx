import { DailyWeather } from '@/types/weather';

interface WeatherCardProps {
  weather: DailyWeather;
  isHighlight?: boolean; // 내일 날씨 강조용
}

// 날씨 상태별 이모지 매핑
const getWeatherEmoji = (description: string): string => {
  const map: { [key: string]: string } = {
    맑음: '☀️',
    흐림: '☁️',
    비: '🌧️',
    이슬비: '🌦️',
    눈: '❄️',
    천둥번개: '⛈️',
    안개: '🌫️',
  };
  return map[description] || '🌤️';
};

export default function WeatherCard({ weather, isHighlight = false }: WeatherCardProps) {
  const emoji = getWeatherEmoji(weather.description);
  const popPercent = Math.round(weather.pop * 100);

  // 강조 카드 (내일 날씨)
  if (isHighlight) {
    return (
      <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">오늘</p>
            <p className="text-2xl font-bold text-gray-800">{weather.dayName}</p>
          </div>
          <div className="text-7xl">{emoji}</div>
        </div>

        {weather.willRain && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mb-4 font-semibold">
            ☔ 우산 챙기세요! (강수확률 {popPercent}%)
          </div>
        )}

        <div className="flex items-end gap-4 mb-2">
          <span className="text-5xl font-bold text-red-500">{weather.tempMax}°</span>
          <span className="text-3xl text-blue-500 mb-1">{weather.tempMin}°</span>
        </div>
        
        <p className="text-lg text-gray-600">{weather.description}</p>
      </div>
    );
  }

  // 일반 카드 (이번 주 예보)
  return (
    <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg hover:scale-105 transition-transform">
      <p className="text-sm font-semibold text-gray-700 mb-1">
        {weather.dayName.replace('요일', '')}
      </p>
      <p className="text-xs text-gray-500 mb-3">
        {weather.date.slice(5)}
      </p>
      
      <div className="text-4xl mb-3 text-center">{emoji}</div>
      
      <div className="text-center mb-2">
        <span className="text-red-500 font-bold">{weather.tempMax}°</span>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-blue-500">{weather.tempMin}°</span>
      </div>

      {weather.willRain && (
        <div className="text-xs text-blue-600 text-center font-semibold">
          💧 {popPercent}%
        </div>
      )}
    </div>
  );
}