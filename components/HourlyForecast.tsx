import { HourlyWeather, RainPeriod } from '@/types/weather';

interface HourlyForecastProps {
  hourly: HourlyWeather[];
  rainPeriod: RainPeriod | null;
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

export default function HourlyForecast({ hourly, rainPeriod }: HourlyForecastProps) {
  if (hourly.length === 0) return null;

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        🕐 오늘 시간대별 예보
      </h3>

      {/* 비 예상 시간 알림 */}
      {rainPeriod && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 mb-4">
          <p className="font-semibold">
            ☔ 비 예상: {rainPeriod.startHour}시 ~ {rainPeriod.endHour}시
          </p>
          <p className="text-sm text-blue-600 mt-1">
            최대 강수확률 {Math.round(rainPeriod.maxPop * 100)}%
          </p>
        </div>
      )}

      {/* 시간대별 카드 가로 스크롤 */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {hourly.map((h) => {
          const popPercent = Math.round(h.pop * 100);
          const isRaining = h.willRain;

          return (
            <div
              key={h.time}
              className={`flex-shrink-0 w-20 rounded-xl p-3 text-center ${
                isRaining 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : 'bg-gray-50'
              }`}
            >
              <p className="text-xs font-semibold text-gray-600 mb-1">
                {h.hour}시
              </p>
              <div className="text-2xl mb-1">{getWeatherEmoji(h.description)}</div>
              <p className="text-sm font-bold text-gray-800">{h.temp}°</p>
              {popPercent > 0 && (
                <p className={`text-xs mt-1 font-semibold ${
                  popPercent >= 50 ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  💧{popPercent}%
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}