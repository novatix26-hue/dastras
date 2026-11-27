import React from 'react';
import Link from 'next/link';
import { getLiveWeather } from '@/lib/api/weather';
import { getLiveCurrencyRates } from '@/lib/api/currency';
import { getLivePrayerTimings } from '@/lib/api/prayer';
import { CloudSun, DollarSign, Calendar, Clock, ShieldCheck, PhoneCall } from 'lucide-react';

export default async function TopBar() {
  const [weather, currency, prayer] = await Promise.all([
    getLiveWeather('Islamabad'),
    getLiveCurrencyRates(),
    getLivePrayerTimings('Islamabad'),
  ]);

  const usdRate = currency?.rates.find((r) => r.code === 'USD')?.rateAgainstPKR || 278.5;
  const sarRate = currency?.rates.find((r) => r.code === 'SAR')?.rateAgainstPKR || 74.2;

  // موجودہ عیسوی تاریخ اردو میں
  const now = new Date();
  const urduDays = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
  const urduMonths = [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ];
  const gregorianUrdu = `${urduDays[now.getDay()]}، ${now.getDate()} ${urduMonths[now.getMonth()]} ${now.getFullYear()}ء`;
  const hijriUrdu = prayer?.hijriDate || '۲۷ جمادی الاول ۱۴۴۸ ہجری';

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs sm:text-sm font-urdu-sans py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* تاریخ اور اسلامی کیلنڈر */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{hijriUrdu}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden md:inline">{gregorianUrdu}</span>
        </div>

        {/* لائیو ویجٹس سمری: موسم، ڈالر، نماز */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* موسم */}
          {weather && (
            <Link 
              href="/weather" 
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              title="پاکستان اور آزاد کشمیر کا مکمل موسم دیکھیں"
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {weather.urduCityName}: {weather.temperature}°C ({weather.weatherStatus})
              </span>
            </Link>
          )}

          {/* ڈالر ریٹ */}
          <Link 
            href="/currency-rates" 
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            title="کرنسی ریٹس اور کنورٹر"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>USD: روپے {usdRate}</span>
            <span className="text-slate-500 hidden lg:inline">| SAR: روپے {sarRate}</span>
          </Link>

          {/* فوری روابط */}
          <div className="hidden sm:flex items-center gap-3 border-r border-slate-700 pr-3 mr-1">
            <Link href="/prayer-times" className="hover:text-emerald-400 transition-colors">
              اوقات نماز
            </Link>
            <Link href="/directory" className="hover:text-emerald-400 transition-colors">
              ہیلپ لائنز
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
