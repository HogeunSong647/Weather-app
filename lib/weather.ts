import { 
  WeatherForecast, 
  DailyWeather, 
  HourlyWeather, 
  RainPeriod 
} from '@/types/weather';

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

// 👇 새 함수: 비 예상 시간대 계산
const calculateRainPeriod = (hourly: HourlyWeather[]): RainPeriod | null => {
  const rainHours = hourly.filter((h) => h.willRain);
  if (rainHours.length === 0) return null;

  return {
    startHour: rainHours[0].hour,
    endHour: rainHours[rainHours.length - 1].hour + 3, // 3시간 단위라 +3
    maxPop: Math.max(...rainHours.map((h) => h.pop)),
  };
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

  // 일별 그룹핑
  const dailyMap = new Map<string, any[]>();
  
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  // 일별 데이터 만들기
  const daily: DailyWeather[] = Array.from(dailyMap.entries()).map(([date, items]) => {
    const tempMax = Math.max(...items.map((i) => i.main.temp_max));
    const tempMin = Math.min(...items.map((i) => i.main.temp_min));
    
    const noonItem = items.find((i) => i.dt_txt.includes('12:00:00')) || items[0];
    const maxPop = Math.max(...items.map((i) => i.pop || 0));
    
    const willRain = items.some((i) => 
      ['Rain', 'Drizzle', 'Snow', 'Thunderstorm'].includes(i.weather[0].main)
    );

    const feelsLike = Math.round(noonItem.main.feels_like);
    const humidity = noonItem.main.humidity;

    return {
      date,
      dayName: getDayName(new Date(date)),
      tempMax: Math.round(tempMax),
      tempMin: Math.round(tempMin),
      feelsLike,
      humidity,
      description: translateDescription(noonItem.weather[0].main),
      icon: noonItem.weather[0].icon,
      pop: maxPop,
      willRain,
    };
  });

  // 👇 추가: 오늘 시간대별 예보 만들기
  const todayDate = daily[0]?.date;
  const todayItems = todayDate ? dailyMap.get(todayDate) || [] : [];
  
  const todayHourly: HourlyWeather[] = todayItems.map((item) => {
    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
    return {
      time: item.dt_txt.split(' ')[1].slice(0, 5), // "09:00"
      hour,
      temp: Math.round(item.main.temp),
      description: translateDescription(item.weather[0].main),
      pop: item.pop || 0,
      willRain: ['Rain', 'Drizzle', 'Snow', 'Thunderstorm'].includes(item.weather[0].main),
    };
  });

  const todayRainPeriod = calculateRainPeriod(todayHourly);

  return {
    city: data.city.name,
    daily,
    todayHourly,
    todayRainPeriod,
  };
}