'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LiveWeatherData, PAKISTAN_CITIES } from '@/lib/api/weather';
import { CloudSun, Droplets, Wind, ArrowLeft, ThermometerSun } from 'lucide-react';

interface WeatherWidgetProps {
  initialWeather: LiveWeatherData | null;
}

export default function WeatherWidget({ initialWeather }: WeatherWidgetProps) {
  const [currentCity, setCurrentCity] = useState(initialWeather?.cityName || 'Islamabad');
  const [weather, setWeather] = useState<LiveWeatherData | null>(initialWeather);
  const [loading, setLoading] = useState(false);

  async function handleCityChange(cityName: string) {
    if (cityName === currentCity) return;
    setCurrentCity(cityName);
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm font-urdu-sans text-center text-slate-500">
        موسم کا ڈیٹا لوڈ ہو رہا ہے...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 text-white rounded-2xl p-5 shadow-md border border-cyan-800/50 font-urdu-sans space-y-4">
      {/* ہیڈر و عنوان */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base sm:text-lg">لائیو موسمی صورتحال</h3>
        </div>
        <Link
          href="/weather"
          className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-semibold"
        >
          <span>7 روزہ پیشگوئی</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* اہم شہروں کے بٹنز */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {PAKISTAN_CITIES.slice(0, 5).map((city) => (
          <button
            key={city.name}
            onClick={() => handleCityChange(city.name)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
              currentCity.toLowerCase() === city.name.toLowerCase()
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            {city.urduName}
          </button>
        ))}
      </div>

      {/* موجودہ ریڈنگ */}
      <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              {weather.temperature}°C
            </div>
            <div className="text-sm font-semibold text-amber-300 mt-1">
              {weather.weatherStatus}
            </div>
            <div className="text-xs text-cyan-200 mt-0.5">
              احساس درجہ حرارت: {weather.apparentTemperature}°C
            </div>
          </div>
          <div className="text-left space-y-1.5 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-1.5 justify-end">
              <span>نمی: {weather.humidity}%</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <span>ہوا: {weather.windSpeed} km/h</span>
              <Wind className="w-3.5 h-3.5 text-teal-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
