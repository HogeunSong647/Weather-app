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
      <div className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-2xl h-full flex flex-col">
        {/* 상단: 기온 + 날씨 이모지 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-red-500">{weather.tempMax}°</span>
            <span className="text-2xl text-blue-500 mb-0.5">{weather.tempMin}°</span>
          </div>
          <div className="text-5xl">{emoji}</div>
        </div>

        <p className="text-sm text-gray-500 mb-3">{weather.description}</p>

        {/* 체감온도 + 습도 */}
        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <span>🌡 체감 {weather.feelsLike}°</span>
          <span>💧 습도 {weather.humidity}%</span>
        </div>

        {/* 우산 알림 */}
        {weather.willRain && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg mb-3 text-sm font-semibold">
            ☔ 우산 챙기세요! ({popPercent}%)
          </div>
        )}

        {/* 캐릭터 반응 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-xl p-3 mt-auto">
          <div className="flex items-start gap-2">
            <div className="text-3xl leading-none">{character.emoji}</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{character.message}</p>
              <p className="text-xs text-gray-500 mt-0.5">{character.outfit}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg hover:scale-105 transition-transform">
      <p className="text-xs font-semibold text-gray-700">{weather.dayName.replace('요일', '')}</p>
      <p className="text-xs text-gray-400 mb-2">{weather.date.slice(5)}</p>

      <div className="text-3xl mb-1 text-center">{emoji}</div>
      <div className="text-xl mb-2 text-center">{character.emoji}</div>

      <div className="text-center mb-1">
        <span className="text-red-500 font-bold text-sm">{weather.tempMax}°</span>
        <span className="text-gray-400 mx-0.5 text-xs">/</span>
        <span className="text-blue-500 text-sm">{weather.tempMin}°</span>
      </div>

      {weather.willRain && (
        <div className="text-xs text-blue-600 text-center font-semibold">💧 {popPercent}%</div>
      )}
    </div>
  );
}
