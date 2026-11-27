'use client';

import React, { useState } from 'react';
import { LiveWeatherData, PAKISTAN_CITIES } from '@/lib/api/weather';
import { CloudSun, Droplets, Wind, Calendar, MapPin, ThermometerSun, Info } from 'lucide-react';

interface WeatherClientViewProps {
  initialCity: string;
  initialData: LiveWeatherData | null;
}

export default function WeatherClientView({ initialCity, initialData }: WeatherClientViewProps) {
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [weather, setWeather] = useState<LiveWeatherData | null>(initialData);
  const [loading, setLoading] = useState(false);

  async function handleCitySelect(cityName: string) {
    if (cityName === selectedCity) return;
    setSelectedCity(cityName);
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (e) {
      console.error('Weather fetch error', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 font-urdu-sans">
      {/* ہیڈر */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-sm">
          <CloudSun className="w-4 h-4 text-cyan-700" />
          <span>اوپن میٹیو کے براہِ راست مصدقہ اعداد و شمار</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-nastaleeq">
          پاکستان اور آزاد کشمیر کا لائیو موسم
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          تمام بڑے شہروں کے لیے موجودہ درجہ حرارت، نمی، ہوا کی رفتار اور آئندہ 7 دنوں کی تفصیلی پیشگوئی
        </p>
      </div>

      {/* شہروں کے بٹنز */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>شہر منتخب کریں:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PAKISTAN_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCitySelect(city.name)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCity.toLowerCase() === city.name.toLowerCase()
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {city.urduName} ({city.region})
            </button>
          ))}
        </div>
      </div>

      {/* مرکزی موسمی کارڈ */}
      {weather && (
        <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'} space-y-8`}>
          <div className="bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-cyan-800/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{weather.region}</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-extrabold text-white font-nastaleeq">
                  {weather.urduCityName}
                </h2>
                <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-2">
                  {weather.weatherStatus}
                </div>
                <div className="text-sm text-cyan-200 mt-1">
                  محسوس ہونے والا درجہ حرارت (Feel): {weather.apparentTemperature}°C
                </div>
              </div>

              {/* درجہ حرارت نمبر */}
              <div className="text-right sm:text-left flex flex-col items-end">
                <div className="text-6xl sm:text-8xl font-black text-white tracking-tight">
                  {weather.temperature}°C
                </div>
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 mt-4 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>نمی: {weather.humidity}%</span>
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-300" />
                    <span>ہوا: {weather.windSpeed} km/h</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 7 روزہ پیشگوئی گرڈ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <h3 className="text-2xl font-bold text-slate-900 font-nastaleeq">
                آئندہ ۷ دنوں کا موسم ({weather.urduCityName})
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {weather.dailyForecast.map((day, idx) => (
                <div
                  key={day.date}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    idx === 0
                      ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-800">
                    {idx === 0 ? 'آج' : day.dayUrdu}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{day.date}</div>
                  <div className="py-3">
                    <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/60 rounded-lg py-1 px-1.5">
                      {day.weatherStatus}
                    </div>
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <div className="font-bold text-slate-900">زیادہ: {day.maxTemp}°C</div>
                    <div className="text-slate-500">کم: {day.minTemp}°C</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
