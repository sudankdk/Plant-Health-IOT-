export interface Environment {
  temperature: number;
  humidity: number;
  timestamp: Date;
}

interface Condition {
  text: string;
  icon: string;
  code: number;
}
interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  humidity: number;
}

export interface weatherData {
  current: CurrentWeather;
}
