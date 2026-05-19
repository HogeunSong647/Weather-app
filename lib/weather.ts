import { WeatherForecast, DailyWeather } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

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

export async function getWeatherForecast(
  city: string = 'Seoul'
): Promise<WeatherForecast> {
  if (!API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다.');
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`날씨 데이터 가져오기 실패: ${response.status}`);
  }

  const data = await response.json();

  const dailyMap = new Map<string, any[]>();
  
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  const daily: DailyWeather[] = Array.from(dailyMap.entries()).map(([date, items]) => {
    const tempMax = Math.max(...items.map((i) => i.main.temp_max));
    const tempMin = Math.min(...items.map((i) => i.main.temp_min));
    
    const noonItem = items.find((i) => i.dt_txt.includes('12:00:00')) || items[0];
    const maxPop = Math.max(...items.map((i) => i.pop || 0));
    
    const willRain = items.some((i) => 
      ['Rain', 'Drizzle', 'Snow', 'Thunderstorm'].includes(i.weather[0].main)
    );

    return {
      date,
      dayName: getDayName(new Date(date)),
      tempMax: Math.round(tempMax),
      tempMin: Math.round(tempMin),
      description: translateDescription(noonItem.weather[0].main),
      icon: noonItem.weather[0].icon,
      pop: maxPop,
      willRain,
    };
  });

  return {
    city: data.city.name,
    daily,
  };
}