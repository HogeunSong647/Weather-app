import {
  WeatherForecast,
  DailyWeather,
  HourlyWeather,
  RainPeriod
} from '@/types/weather';

const API_KEY = process.env.WEATHER_API_KEY;

const getDayName = (date: Date): string => {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
};

const translateDescription = (main: string): string => {
  const map: { [key: string]: string } = {
    Clear: '맑음',
    Clouds: '흐림',
    Rain: '비',
    Drizzle: '이슬비',
    Snow: '눈',
    Thunderstorm: '천둥번개',
    Mist: '안개',
    Fog: '안개',
  };
  return map[main] || main;
};

const calculateRainPeriod = (hourly: HourlyWeather[]): RainPeriod | null => {
  const rainHours = hourly.filter((h) => h.willRain);
  if (rainHours.length === 0) return null;

  return {
    startHour: rainHours[0].hour,
    endHour: rainHours[rainHours.length - 1].hour + 3,
    maxPop: Math.max(...rainHours.map((h) => h.pop)),
  };
};

function parseApiResponse(data: Record<string, unknown>): WeatherForecast {
  const cityData = data.city as { name: string };
  const list = data.list as Array<{
    dt_txt: string;
    main: { temp_max: number; temp_min: number; feels_like: number; humidity: number; temp: number };
    weather: Array<{ main: string; icon: string }>;
    pop?: number;
  }>;

  const dailyMap = new Map<string, typeof list>();

  list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(date)) dailyMap.set(date, []);
    dailyMap.get(date)!.push(item);
  });

  const daily: DailyWeather[] = Array.from(dailyMap.entries()).map(([date, items]) => {
    const tempMax = Math.max(...items.map((i) => i.main.temp_max));
    const tempMin = Math.min(...items.map((i) => i.main.temp_min));
    const noonItem = items.find((i) => i.dt_txt.includes('12:00:00')) ?? items[0];
    const maxPop = Math.max(...items.map((i) => i.pop ?? 0));
    const willRain = items.some((i) =>
      ['Rain', 'Drizzle', 'Snow', 'Thunderstorm'].includes(i.weather[0].main)
    );

    return {
      date,
      dayName: getDayName(new Date(date)),
      tempMax: Math.round(tempMax),
      tempMin: Math.round(tempMin),
      feelsLike: Math.round(noonItem.main.feels_like),
      humidity: noonItem.main.humidity,
      description: translateDescription(noonItem.weather[0].main),
      icon: noonItem.weather[0].icon,
      pop: maxPop,
      willRain,
    };
  });

  const todayDate = daily[0]?.date;
  const todayItems = todayDate ? (dailyMap.get(todayDate) ?? []) : [];

  const todayHourly: HourlyWeather[] = todayItems.map((item) => {
    const timeParts = item.dt_txt.split(' ');
    const hour = parseInt(timeParts[1].split(':')[0]);
    return {
      time: timeParts[1].slice(0, 5),
      hour,
      temp: Math.round(item.main.temp),
      description: translateDescription(item.weather[0].main),
      pop: item.pop ?? 0,
      willRain: ['Rain', 'Drizzle', 'Snow', 'Thunderstorm'].includes(item.weather[0].main),
    };
  });

  return {
    city: cityData.name,
    daily,
    todayHourly,
    todayRainPeriod: calculateRainPeriod(todayHourly),
  };
}

export async function getWeatherForecast(
  query: string | { lat: number; lon: number } = 'Seoul'
): Promise<WeatherForecast> {
  if (!API_KEY) throw new Error('API 키가 설정되지 않았습니다.');

  const base = 'https://api.openweathermap.org/data/2.5/forecast';
  const params = typeof query === 'string'
    ? `q=${encodeURIComponent(query)}`
    : `lat=${query.lat}&lon=${query.lon}`;

  const url = `${base}?${params}&appid=${API_KEY}&units=metric&lang=kr`;

  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? '도시를 찾을 수 없습니다.'
        : `날씨 데이터 가져오기 실패: ${response.status}`
    );
  }

  return parseApiResponse(await response.json());
}
