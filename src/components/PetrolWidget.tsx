import React from 'react';
import Link from 'next/link';
import { getLivePetrolPrices } from '@/lib/api/petrol';
import { Fuel, TrendingUp, TrendingDown, ArrowLeft, ShieldCheck } from 'lucide-react';

export default async function PetrolWidget() {
  const data = await getLivePetrolPrices();
  const topFuels = data.items.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white rounded-2xl p-5 shadow-md border border-amber-700/50 font-urdu-sans space-y-4">
      {/* ہیڈر */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base sm:text-lg">پٹرول و ڈیزل ریٹس (پاکستان)</h3>
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
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs"
          >
            <div>
              <div className="font-bold text-slate-100">{fuel.nameUrdu}</div>
              <div className="text-[10px] text-slate-400">{fuel.nameEn}</div>
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold text-amber-300">
                روپے {fuel.pricePerLiter}
              </div>
              <div className="text-[10px] text-slate-300">فی لیٹر</div>
            </div>
          </div>
        ))}
      </div>

      {/* الرٹ نوٹیفکیشن */}
      <div className="text-[11px] text-amber-200/90 bg-amber-900/40 p-2 rounded-xl border border-amber-600/30 text-center">
        اوگرا اور حکومت پاکستان کے تازہ ترین مصدقہ ریٹس
      </div>
    </div>
  );
}
