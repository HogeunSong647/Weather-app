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
    <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl h-full flex flex-col">
      {/* 비 예상 시간 알림 */}
      {rainPeriod && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-3 py-2 mb-3 text-xs">
          <p className="font-semibold">☔ {rainPeriod.startHour}시 ~ {rainPeriod.endHour}시 비 예상</p>
          <p className="text-blue-600 mt-0.5">최대 강수확률 {Math.round(rainPeriod.maxPop * 100)}%</p>
        </div>
      )}

      {/* 시간대별 카드 가로 스크롤 */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
        {hourly.map((h) => {
          const popPercent = Math.round(h.pop * 100);
          return (
            <div
              key={h.time}
              className={`flex-shrink-0 w-14 rounded-xl p-2 text-center ${
                h.willRain
                  ? 'bg-blue-100 border border-blue-300'
                  : 'bg-gray-50'
              }`}
            >
              <p className="text-xs font-semibold text-gray-500 mb-1">{h.hour}시</p>
              <div className="text-lg mb-1">{getWeatherEmoji(h.description)}</div>
              <p className="text-sm font-bold text-gray-800">{h.temp}°</p>
              {popPercent > 0 && (
                <p className={`text-xs mt-0.5 ${popPercent >= 50 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                  {popPercent}%
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
