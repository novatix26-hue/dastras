'use client';

import React, { useState } from 'react';
import { MobileModel, MobileBrand } from '@/lib/types';
import MobileCard from '@/components/MobileCard';
import { Smartphone, Search, Filter, SlidersHorizontal, PackageX } from 'lucide-react';

interface MobilesClientViewProps {
  initialMobiles: MobileModel[];
  initialBrand: string;
}

const BRANDS: { label: string; value: string }[] = [
  { label: 'تمام برانڈز', value: 'تمام' },
  { label: 'Samsung', value: 'Samsung' },
  { label: 'Apple', value: 'Apple' },
  { label: 'Xiaomi', value: 'Xiaomi' },
  { label: 'Vivo', value: 'Vivo' },
  { label: 'Oppo', value: 'Oppo' },
  { label: 'Infinix', value: 'Infinix' },
  { label: 'Tecno', value: 'Tecno' },
  { label: 'Realme', value: 'Realme' },
];

const PRICE_RANGES = [
  { label: 'تمام قیمتیں', min: 0, max: Infinity },
  { label: '30,000 سے کم', min: 0, max: 30000 },
  { label: '30,000 تا 60,000', min: 30000, max: 60000 },
  { label: '60,000 تا 100,000', min: 60000, max: 100000 },
  { label: 'فلیگ شپ (100,000+)', min: 100000, max: Infinity },
];

export default function MobilesClientView({ initialMobiles, initialBrand }: MobilesClientViewProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedRangeIdx, setSelectedRangeIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const range = PRICE_RANGES[selectedRangeIdx];

  const filteredMobiles = initialMobiles.filter((m) => {
    // برانڈ فلٹر
    if (selectedBrand !== 'تمام' && m.brand !== selectedBrand) return false;
    // پرائس فلٹر
    if (m.price_pkr < range.min || m.price_pkr > range.max) return false;
    // سرچ فلٹر
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.model_name.toLowerCase().includes(q);
      const matchBrand = m.brand.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 font-urdu-sans">
      {/* ہیڈر */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
          <Smartphone className="w-4 h-4 text-emerald-700" />
          <span>موبائل مارکیٹ پاکستان کے مصدقہ اور تازہ ترین نرخ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-nastaleeq">
          موبائل فونز کی قیمتیں اور خصوصیات
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          تمام معروف برانڈز کے آفیشل اور پی ٹی اے اپرووڈ موبائل فونز کے ریٹس اور مکمل تکنیکی موازنہ
        </p>
      </div>

      {/* کنٹرول بار: برانڈ، پرائس اور لائیو سرچ */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* سرچ ان پٹ */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ماڈل یا برانڈ تلاش کریں (مثلاً Galaxy S24، iPhone 16، Redmi Note)..."
            className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* برانڈ بٹنز */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>برانڈ کے لحاظ سے فلٹر کریں:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BRANDS.map((b) => (
              <button
                key={b.value}
                onClick={() => setSelectedBrand(b.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedBrand === b.value
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* پرائس رینج بٹنز */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>قیمت کا زمرہ (PKR):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRICE_RANGES.map((p, idx) => (
              <button
                key={p.label}
                onClick={() => setSelectedRangeIdx(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRangeIdx === idx
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* موبائل فونز کارڈز گرڈ */}
      {filteredMobiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMobiles.map((mob) => (
            <MobileCard key={mob.id} mobile={mob} />
          ))}
        </div>
      ) : (
        /* خالی حالت (Empty State) بغیر کسی فرضی ڈیٹا کے */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 font-nastaleeq">
            کوئی موبائل ماڈل نہیں ملا
          </h3>
          <p className="text-sm text-slate-500">
            آپ کے منتخب کردہ فلٹرز یا سرچ کے مطابق فی الحال کوئی موبائل فون دستیاب نہیں ہے۔ براہِ کرم فلٹرز تبدیل کر کے دوبارہ کوشش کریں۔
          </p>
          <button
            onClick={() => {
              setSelectedBrand('تمام');
              setSelectedRangeIdx(0);
              setSearchQuery('');
            }}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-sm hover:bg-emerald-800 transition-colors"
          >
            تمام فلٹرز صاف کریں
          </button>
        </div>
      )}
    </div>
  );
}
