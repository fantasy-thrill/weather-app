export interface FetchCity {
  toponymName: string,
  adminName1: string,
  adminCode1: string,
  countryCode: string
}

export interface CoordinatesFormat {
  lat: number,
  long: number
}

export type Parameters = {
  city: string;
  state: string;
  country: string
}

export interface WeatherItem {
  description: string,
  icon: string,
  main: string,
  id: number
}

export interface CloudInfo {
  all: number
}

export interface MainInfo {
  feels_like: number,
  temp: number,
  humidity: number
}

export interface WindInfo {
  speed: number,
  deg: number,
  gust: number
}

export interface Hour3ForecastItem {
  clouds: CloudInfo,
  dt: number,
  weather: WeatherItem[],
  main: MainInfo,
  pop: number,
  wind: WindInfo
}

export interface TemperatureItem {
  day: number,
  night: number,
  eve: number,
  min: number,
  max: number,
  morn: number
}

export interface ForecastObject {
  clouds: number,
  dew_point: number,
  dt: number,
  feels_like: number,
  humidity: number,
  pop: number,
  sunrise: number,
  sunset: number,
  temp: number,
  uvi: number,
  weather: WeatherItem[],
  wind_deg: number,
  wind_gust: number,
  wind_speed: number
}

export interface DailyForecastObject {
  clouds: number,
  dew_point: number,
  dt: number,
  feels_like: TemperatureItem,
  humidity: number,
  pop: number,
  sunrise: number,
  sunset: number,
  temp: TemperatureItem,
  uvi: number,
  weather: WeatherItem[],
  wind_deg: number,
  wind_gust: number,
  wind_speed: number
}

export interface LocationObject {
  "Type": string,
  "EnglishName": string,
  "Country": Country,
  "AdministrativeArea": Province
}

export interface Country {
  "ID": string,
  "EnglishName": string
}

export interface Province {
  "ID": string,
  "EnglishName": string,
  "CountryID": string
}

// export type HourlyArray = {
//   map(arg0: (hour: any) => import("react").JSX.Element): import("react").ReactNode;
//   slice(startIndex: number, endIndex: number | undefined): HourlyArray
//   length: number
//   find(arg0: (hour: ForecastItem) => boolean): unknown
//   hour: ForecastItem
// }