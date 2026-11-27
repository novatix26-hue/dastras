import React from 'react';
import Link from 'next/link';
import { PrayerTimingsData, toUrduNumbers } from '@/lib/api/prayer';
import { Clock, Moon, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PrayerWidgetProps {
  prayerData: PrayerTimingsData | null;
}

export default function PrayerWidget({ prayerData }: PrayerWidgetProps) {
  if (!prayerData) return null;

  const prayerList = [
    { name: 'فجر', time: prayerData.fajr },
    { name: 'طلوع آفتاب', time: prayerData.sunrise },
    { name: 'ظہر', time: prayerData.dhuhr },
    { name: 'عصر', time: prayerData.asr },
    { name: 'مغرب', time: prayerData.maghrib },
    { name: 'عشاء', time: prayerData.isha },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-5 shadow-md border border-emerald-800/60 font-urdu-sans space-y-4">
      {/* ہیڈر */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-bold text-base sm:text-lg">اوقاتِ نماز (حنفی فقہ)</h3>
            <p className="text-[11px] text-emerald-300 font-medium">{prayerData.urduCity}</p>
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

      {/* اگلی نماز کا الرٹ */}
      {prayerData.nextPrayer && (
        <div className="bg-emerald-800/50 border border-emerald-600/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-white">اگلی نماز: {prayerData.nextPrayer.nameUrdu}</span>
          </div>
          <span className="text-amber-300 font-extrabold">{prayerData.nextPrayer.remainingTime} باقی</span>
        </div>
      )}

      {/* نمازوں کا شیڈول */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {prayerList.map((p) => {
          const isNext = prayerData.nextPrayer?.nameUrdu === p.name;
          return (
            <div
              key={p.name}
              className={`p-2 rounded-xl border transition-all ${
                isNext
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-200'
              }`}
            >
              <div className="font-bold">{p.name}</div>
              <div className="text-sm font-bold mt-0.5">{toUrduNumbers(p.time)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
