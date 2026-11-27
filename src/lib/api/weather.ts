export interface CityCoordinates {
  name: string;
  urduName: string;
  region: string;
  latitude: number;
  longitude: number;
}

export const PAKISTAN_CITIES: CityCoordinates[] = [
  { name: 'Islamabad', urduName: 'اسلام آباد', region: 'وفاقی دارالحکومت', latitude: 33.6844, longitude: 73.0479 },
  { name: 'Lahore', urduName: 'لاہور', region: 'پنجاب', latitude: 31.5497, longitude: 74.3436 },
  { name: 'Karachi', urduName: 'کراچی', region: 'سندھ', latitude: 24.8607, longitude: 67.0011 },
  { name: 'Muzaffarabad', urduName: 'مظفرآباد', region: 'آزاد کشمیر', latitude: 34.3700, longitude: 73.4711 },
  { name: 'Mirpur', urduName: 'میرپور', region: 'آزاد کشمیر', latitude: 33.1484, longitude: 73.7519 },
  { name: 'Rawalakot', urduName: 'راولاکوٹ', region: 'آزاد کشمیر', latitude: 33.8584, longitude: 73.7604 },
  { name: 'Peshawar', urduName: 'پشاور', region: 'خیبر پختونخوا', latitude: 34.0151, longitude: 71.5249 },
  { name: 'Quetta', urduName: 'کوئٹہ', region: 'بلوچستان', latitude: 30.1798, longitude: 66.9750 },
  { name: 'Multan', urduName: 'ملتان', region: 'پنجاب', latitude: 30.1575, longitude: 71.5249 },
  { name: 'Faisalabad', urduName: 'فیصل آباد', region: 'پنجاب', latitude: 31.4504, longitude: 73.1350 },
];

export interface LiveWeatherData {
  cityName: string;
  urduCityName: string;
  region: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherStatus: string;
  iconName: string;
  dailyForecast: {
    date: string;
    dayUrdu: string;
    maxTemp: number;
    minTemp: number;
    weatherStatus: string;
  }[];
  updatedAt: string;
}

// اوپن میٹیو ڈبلیو ایم او کوڈز کی اردو تشریح
export function getWeatherStatusUrdu(code: number): { text: string; icon: string } {
  switch (code) {
    case 0:
      return { text: 'مطلع بالکل صاف', icon: 'Sun' };
    case 1:
      return { text: 'زیادہ تر صاف', icon: 'SunMedium' };
    case 2:
      return { text: 'جزوی ابر آلود', icon: 'CloudSun' };
    case 3:
      return { text: 'مکمل ابر آلود', icon: 'Cloud' };
    case 45:
    case 48:
      return { text: 'دھند و کہر', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { text: 'ہلکی بونداباندی', icon: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65:
      return { text: 'بارش', icon: 'CloudRain' };
    case 71:
    case 73:
    case 75:
      return { text: 'برفباری', icon: 'Snowflake' };
    case 80:
    case 81:
    case 82:
      return { text: 'تیز بارش کی پھواریں', icon: 'CloudRainWind' };
    case 95:
    case 96:
    case 99:
      return { text: 'گرج چمک کے ساتھ طوفان', icon: 'CloudLightning' };
    default:
      return { text: 'معتدل موسم', icon: 'CloudSun' };
  }
}

const URDU_DAYS = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

export async function getLiveWeather(cityName: string = 'Islamabad'): Promise<LiveWeatherData | null> {
  const city = PAKISTAN_CITIES.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase() || c.urduName === cityName
  ) || PAKISTAN_CITIES[0];

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url, { next: { revalidate: 600 } }); // 10 منٹ کیشنگ
    if (!res.ok) return null;

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const statusObj = getWeatherStatusUrdu(current.weather_code);

    const dailyForecast = (daily.time || []).slice(0, 7).map((t: string, idx: number) => {
      const d = new Date(t);
      const dayUrdu = URDU_DAYS[d.getDay()];
      return {
        date: t,
        dayUrdu,
        maxTemp: Math.round(daily.temperature_2m_max[idx]),
        minTemp: Math.round(daily.temperature_2m_min[idx]),
        weatherStatus: getWeatherStatusUrdu(daily.weather_code[idx]).text,
      };
    });

    return {
      cityName: city.name,
      urduCityName: city.urduName,
      region: city.region,
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      weatherCode: current.weather_code,
      weatherStatus: statusObj.text,
      iconName: statusObj.icon,
      dailyForecast,
      updatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Weather fetch error:', err);
    return null;
  }
}
