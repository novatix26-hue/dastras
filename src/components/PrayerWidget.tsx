'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PrayerTimingsData, toUrduNumbers, formatUrdu12hTime, calculateNextPrayer } from '@/lib/api/prayer';
import { Clock, Moon, ArrowLeft, Sparkles } from 'lucide-react';

interface PrayerWidgetProps {
  prayerData: PrayerTimingsData | null;
}

export default function PrayerWidget({ prayerData }: PrayerWidgetProps) {
  const [liveData, setLiveData] = useState<PrayerTimingsData | null>(prayerData);

  useEffect(() => {
    if (!prayerData) return;

    // ہر ۳۰ سیکنڈ بعد اگلی نماز اور باقی وقت کو لائیو اپڈیٹ کریں
    const updateCountdown = () => {
      const timingsObj = {
        Fajr: prayerData.fajr,
        Dhuhr: prayerData.dhuhr,
        Asr: prayerData.asr,
        Maghrib: prayerData.maghrib,
        Isha: prayerData.isha,
      };
      const next = calculateNextPrayer(timingsObj);
      setLiveData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nextPrayer: {
            nameUrdu: next.nameUrdu,
            time: next.time,
            remainingTime: next.remainingTime,
          },
        };
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 30000);
    return () => clearInterval(interval);
  }, [prayerData]);

  if (!liveData) return null;

  const prayerList = [
    { name: 'فجر', time: liveData.fajr, time12h: formatUrdu12hTime(liveData.fajr) },
    { name: 'طلوع', time: liveData.sunrise, time12h: formatUrdu12hTime(liveData.sunrise) },
    { name: 'ظہر', time: liveData.dhuhr, time12h: formatUrdu12hTime(liveData.dhuhr) },
    { name: 'عصر', time: liveData.asr, time12h: formatUrdu12hTime(liveData.asr) },
    { name: 'مغرب', time: liveData.maghrib, time12h: formatUrdu12hTime(liveData.maghrib) },
    { name: 'عشاء', time: liveData.isha, time12h: formatUrdu12hTime(liveData.isha) },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-5 shadow-md border border-emerald-800/60 font-urdu-sans space-y-4">
      {/* ہیڈر */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-bold text-base sm:text-lg">اوقاتِ نماز (حنفی فقہ)</h3>
            <p className="text-[11px] text-emerald-300 font-medium">{liveData.urduCity} • مصدقہ وقت</p>
          </div>
        </div>
        <Link
          href="/prayer-times"
          className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 font-semibold"
        >
          <span>تمام شہر</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* اگلی نماز کا الرٹ (Live Accurate Countdown) */}
      {liveData.nextPrayer && (
        <div className="bg-emerald-800/60 border border-emerald-500/50 rounded-xl p-2.5 flex items-center justify-between text-xs shadow-inner">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-bold text-white">اگلی نماز: {liveData.nextPrayer.nameUrdu}</span>
          </div>
          <span className="text-amber-300 font-black">{liveData.nextPrayer.remainingTime} باقی</span>
        </div>
      )}

      {/* نمازوں کا شیڈول (12 گھنٹے اردو فارمیٹ) */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {prayerList.map((p) => {
          const isNext = liveData.nextPrayer?.nameUrdu?.includes(p.name);
          return (
            <div
              key={p.name}
              className={`p-2 rounded-xl border transition-all ${
                isNext
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md scale-105'
                  : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="font-bold">{p.name}</div>
              <div className="text-xs font-bold mt-1 tracking-tight">{p.time12h}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
