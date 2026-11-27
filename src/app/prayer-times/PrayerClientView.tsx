'use client';

import React, { useState } from 'react';
import { PrayerTimingsData, toUrduNumbers, formatUrdu12hTime } from '@/lib/api/prayer';
import { PAKISTAN_CITIES } from '@/lib/api/weather';
import { Moon, Clock, Calendar, MapPin, CheckCircle2, ShieldCheck, SunMedium } from 'lucide-react';

interface PrayerClientViewProps {
  initialCity: string;
  initialData: PrayerTimingsData | null;
}

export default function PrayerClientView({ initialCity, initialData }: PrayerClientViewProps) {
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [prayerData, setPrayerData] = useState<PrayerTimingsData | null>(initialData);
  const [loading, setLoading] = useState(false);

  async function handleCitySelect(cityName: string) {
    if (cityName === selectedCity) return;
    setSelectedCity(cityName);
    setLoading(true);
    try {
      const res = await fetch(`/api/prayer?city=${encodeURIComponent(cityName)}`);
      if (res.ok) {
        const data = await res.json();
        setPrayerData(data);
      }
    } catch (e) {
      console.error('Prayer fetch error', e);
    } finally {
      setLoading(false);
    }
  }

  const prayersList = prayerData ? [
    { name: 'فجر (Fajr)', urdu: 'نمازِ فجر', time: prayerData.fajr, desc: 'صبح صادق سے طلوع آفتاب سے قبل تک' },
    { name: 'طلوع آفتاب (Sunrise)', urdu: 'طلوعِ آفتاب', time: prayerData.sunrise, desc: 'سورج نکلنے کا وقت (مکروہ وقت)' },
    { name: 'ظہر (Dhuhr)', urdu: 'نمازِ ظہر', time: prayerData.dhuhr, desc: 'زوالِ آفتاب کے بعد' },
    { name: 'عصر (Asr)', urdu: 'نمازِ عصر (حنفی)', time: prayerData.asr, desc: 'مثلین پر (حنفی فقہ کے مطابق)' },
    { name: 'مغرب (Maghrib)', urdu: 'نمازِ مغرب', time: prayerData.maghrib, desc: 'غروبِ آفتاب کے فوراً بعد' },
    { name: 'عشاء (Isha)', urdu: 'نمازِ عشاء', time: prayerData.isha, desc: 'شفق احمر غائب ہونے پر' },
  ] : [];

  return (
    <div className="space-y-8 font-urdu-sans">
      {/* ہیڈر */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
          <Moon className="w-4 h-4 text-emerald-700" />
          <span>جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن کراچی (حنفی فقہ) کے مطابق</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-nastaleeq">
          اوقاتِ نماز برائے پاکستان و آزاد کشمیر
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          ہر نماز کے آغاز و اختتام کے درست اور مصدقہ اوقات بذریعہ براہِ راست ال اذان سروس
        </p>
      </div>

      {/* شہروں کے بٹنز */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>شہر منتخب کریں:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PAKISTAN_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCitySelect(city.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCity === city.name
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {city.urduName}
            </button>
          ))}
        </div>
      </div>

      {prayerData && (
        <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'} space-y-6`}>
          {/* اسلامی و عیسوی تاریخ کارڈ */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-emerald-300 font-semibold">مقام: {prayerData.urduCity} (پاکستان)</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-nastaleeq mt-1">
                {prayerData.hijriDate}
              </div>
              <div className="text-sm text-slate-300 mt-1">{prayerData.gregorianDate}</div>
            </div>

            {/* اگلی نماز */}
            {prayerData.nextPrayer && (
              <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-center sm:text-right">
                <div className="text-xs text-amber-300 font-bold">اگلی نماز:</div>
                <div className="text-xl font-black text-white font-nastaleeq mt-0.5">
                  {prayerData.nextPrayer.nameUrdu}
                </div>
                <div className="text-xs text-emerald-200 mt-1">
                  {prayerData.nextPrayer.remainingTime} وقت باقی ہے
                </div>
              </div>
            )}
          </div>

          {/* ٹائم ٹیبل لسٹ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prayersList.map((p) => {
              const baseName = p.urdu.replace('نمازِ ', '').replace(' (حنفی)', '');
              const isNext = Boolean(prayerData.nextPrayer?.nameUrdu?.includes(baseName));
              return (
                <div
                  key={p.name}
                  className={`p-5 rounded-2xl border transition-all ${
                    isNext
                      ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400 scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {p.name}
                    </span>
                    {isNext && (
                      <span className="text-xs font-extrabold text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full animate-pulse">
                        اگلی نماز
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="text-2xl font-black text-slate-900 font-nastaleeq">
                      {formatUrdu12hTime(p.time)}
                    </div>
                    <div className="text-xs text-slate-400 font-bold font-mono">
                      {p.time}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
