import React from 'react';
import Link from 'next/link';
import { getLivePetrolPrices } from '@/lib/api/petrol';
import { Fuel, ArrowLeft, Flame } from 'lucide-react';

export default async function PetrolWidget() {
  const data = await getLivePetrolPrices();
  // پٹرول، ڈیزل، اور ایل پی جی
  const topFuels = data.items.filter((f) => ['petrol', 'diesel', 'lpg', 'lpg_cylinder'].includes(f.id));

  return (
    <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white rounded-2xl p-5 shadow-md border border-amber-700/50 font-urdu-sans space-y-4">
      {/* ہیڈر */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base sm:text-lg">پٹرول، ڈیزل و ایل پی جی ریٹس</h3>
        </div>
        <Link
          href="/petrol-prices"
          className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-semibold"
        >
          <span>تفصیلی ریٹس</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* قیمتوں کی فہرست */}
      <div className="space-y-2">
        {topFuels.map((fuel) => (
          <div
            key={fuel.id}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
              fuel.category === 'gas'
                ? 'bg-amber-500/15 border-amber-500/40 hover:bg-amber-500/25 ring-1 ring-amber-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div>
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                {fuel.category === 'gas' ? (
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{fuel.nameUrdu}</span>
              </div>
              <div className="text-[10px] text-slate-400">{fuel.nameEn}</div>
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold text-amber-300">
                روپے {fuel.pricePerLiter.toLocaleString('ur-PK')}
              </div>
              <div className="text-[10px] text-slate-300">{fuel.unit}</div>
            </div>
          </div>
        ))}
      </div>

      {/* الرٹ نوٹیفکیشن مع لائیو ٹائم اسٹیمپ */}
      <div className="text-[11px] text-amber-200/90 bg-amber-900/40 p-2 rounded-xl border border-amber-600/30 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>اوگرا و پی ایس او مصدقہ نرخ</span>
        </span>
        <span className="text-[10px] text-amber-300">
          {data.lastUpdatedPkt || data.lastUpdated}
        </span>
      </div>
    </div>
  );
}
