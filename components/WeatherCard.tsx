import { DailyWeather } from '@/types/weather';
import { getCharacterReaction } from '@/lib/character';

interface WeatherCardProps {
  weather: DailyWeather;
  isHighlight?: boolean;
}

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
  const character = getCharacterReaction(weather);

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

        {/* 캐릭터 반응 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-5xl">{character.emoji}</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 mb-1">{character.message}</p>
              <p className="text-sm text-gray-600">{character.outfit}</p>
            </div>
          </div>
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
        
        <p className="text-lg text-gray-600 mb-3">{weather.description}</p>

        {/* 체감온도 + 습도 */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">체감온도</p>
            <p className="text-lg font-semibold text-gray-700">🌡 {weather.feelsLike}°</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">습도</p>
            <p className="text-lg font-semibold text-gray-700">💧 {weather.humidity}%</p>
          </div>
        </div>
      </div>
    );
  }

  // 일반 카드 (작은 카드는 캐릭터 이모지만 추가)
  return (
    <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg hover:scale-105 transition-transform">
      <p className="text-sm font-semibold text-gray-700 mb-1">
        {weather.dayName.replace('요일', '')}
      </p>
      <p className="text-xs text-gray-500 mb-3">
        {weather.date.slice(5)}
      </p>
      
      <div className="text-4xl mb-2 text-center">{emoji}</div>
      <div className="text-2xl mb-2 text-center">{character.emoji}</div>
      
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