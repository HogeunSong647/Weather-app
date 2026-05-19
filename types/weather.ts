// 하루치 날씨 데이터
export interface DailyWeather {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  description: string;
  icon: string;
  pop: number;
  willRain: boolean;
}

// 전체 예보 데이터
export interface WeatherForecast {
  city: string;
  daily: DailyWeather[];
}