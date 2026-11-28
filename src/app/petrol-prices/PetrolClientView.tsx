'use client';

import React, { useState } from 'react';
import { PetrolPricesData, PetrolProduct } from '@/lib/api/petrol';
import { Fuel, Flame, Calculator, TrendingUp, TrendingDown, ShieldCheck, ArrowLeftRight, CheckCircle2, Clock } from 'lucide-react';

interface PetrolClientViewProps {
  initialData: PetrolPricesData;
}

export default function PetrolClientView({ initialData }: PetrolClientViewProps) {
  // فیول کیلکولیٹر اسٹیٹس
  const [distanceKm, setDistanceKm] = useState<number>(50);
  const [vehicleMileage, setVehicleMileage] = useState<number>(14); // 14 km per liter
  const [selectedFuelPrice, setSelectedFuelPrice] = useState<number>(initialData.items[0].pricePerLiter);

  const litersNeeded = Math.round((distanceKm / (vehicleMileage || 1)) * 100) / 100;
  const estimatedCost = Math.round(litersNeeded * selectedFuelPrice);

  return (
    <div className="space-y-8 font-urdu-sans">
      {/* ہیڈر مع لائیو PKT ٹائم اسٹیمپ */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-300 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>آخری تصدیق شدہ اپڈیٹ: {initialData.lastUpdatedPkt || initialData.lastUpdated}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 font-bold text-xs sm:text-sm border border-amber-200">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>اوگرا (OGRA) و پی ایس او مصدقہ</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-nastaleeq leading-tight">
          پاکستان میں پٹرول، ڈیزل اور ایل پی جی کی تازہ ترین قیمتیں
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          پٹرول، ہائی اسپیڈ ڈیزل، ایل پی جی (فی کلو و گھریلو سلنڈر)، ہائی اوکٹین، مٹی کے تیل کے سرکاری نرخ مع خودکار فیول خرچ کیلکولیٹر
        </p>
      </div>

      {/* اہم مصنوعات کے کارڈز */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.items.map((fuel) => (
          <div
            key={fuel.id}
            className={`rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all space-y-4 ${
              fuel.id === 'lpg' || fuel.id === 'lpg_cylinder'
                ? 'bg-gradient-to-br from-amber-50/60 to-white border-amber-300 ring-1 ring-amber-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-2xl ${fuel.category === 'gas' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-emerald-800'}`}>
                {fuel.category === 'gas' ? <Flame className="w-6 h-6 text-amber-600" /> : <Fuel className="w-6 h-6 text-emerald-600" />}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${fuel.category === 'gas' ? 'bg-amber-100 text-amber-800 font-nastaleeq' : 'bg-slate-100 text-slate-600'}`}>
                {fuel.category === 'gas' ? 'گیس (ایل پی جی)' : 'پیٹرولیم فیول'}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-xl text-slate-900 font-nastaleeq">{fuel.nameUrdu}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{fuel.nameEn}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
              <div>
                <div className="text-3xl font-black text-amber-600">
                  روپے {fuel.pricePerLiter.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">{fuel.unit}</div>
              </div>

              {fuel.change !== 0 && (
                <div className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                  fuel.change > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {fuel.change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{fuel.change > 0 ? `+${fuel.change}` : fuel.change}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* فیول کھپت و اخراجات کا کیلکولیٹر */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-700/50 space-y-6">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-lg border-b border-white/10 pb-4">
          <Calculator className="w-5 h-5" />
          <span>گاڑی کے سفر اور فیول خرچ کا سمارٹ کیلکولیٹر (Fuel Mileage Cost Calculator)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-semibold">سفر کا فاصلہ (کلومیٹر):</label>
            <input
              type="number"
              min="1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-semibold">گاڑی کی مائلیج (کلومیٹر فی لیٹر):</label>
            <input
              type="number"
              min="1"
              value={vehicleMileage}
              onChange={(e) => setVehicleMileage(Number(e.target.value) || 1)}
              placeholder="مثلاً 14"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-semibold">فیول کی قسم منتخب کریں:</label>
            <select
              value={selectedFuelPrice}
              onChange={(e) => setSelectedFuelPrice(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {initialData.items.map((fuel) => (
                <option key={fuel.id} value={fuel.pricePerLiter}>
                  {fuel.nameUrdu} - {fuel.pricePerLiter} روپے
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* حتمی تخمینہ */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-right">
          <div>
            <div className="text-xs text-amber-300 font-bold">مطلوبہ فیول کی مقدار:</div>
            <div className="text-2xl font-black text-white mt-1">
              {litersNeeded} لیٹر
            </div>
          </div>
          <div>
            <div className="text-xs text-amber-300 font-bold">کل متوقع اخراجات:</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 mt-1">
              روپے {estimatedCost.toLocaleString('ur-PK')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
