// 하루치 날씨 데이터
export interface DailyWeather {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  pop: number;
  willRain: boolean;
}

// 👇 추가: 3시간 단위 예보
export interface HourlyWeather {
  time: string;        // "09:00"
  hour: number;        // 9
  temp: number;        // 기온
  description: string; // 날씨
  pop: number;         // 강수확률 (0~1)
  willRain: boolean;   // 비 옴 여부
}

// 👇 추가: 비 예상 시간대
export interface RainPeriod {
  startHour: number;   // 시작 시간 (예: 15)
  endHour: number;     // 끝 시간 (예: 21)
  maxPop: number;      // 최대 강수확률
}

// 전체 예보 데이터
export interface WeatherForecast {
  city: string;
  daily: DailyWeather[];
  todayHourly: HourlyWeather[];  // 👈 추가: 오늘 시간대별
  todayRainPeriod: RainPeriod | null; // 👈 추가: 비 예상 시간
}