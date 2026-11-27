'use client';

import React, { useState } from 'react';
import { LiveCurrencyData, CurrencyRateItem } from '@/lib/api/currency';
import { TrendingUp, ArrowLeftRight, DollarSign, Calendar, Search, ShieldCheck } from 'lucide-react';

interface CurrencyClientViewProps {
  initialData: LiveCurrencyData | null;
}

export default function CurrencyClientView({ initialData }: CurrencyClientViewProps) {
  const [amount, setAmount] = useState<number>(100);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [direction, setDirection] = useState<'foreignToPkr' | 'pkrToForeign'>('foreignToPkr');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!initialData) {
    return (
      <div className="text-center py-20 font-urdu-sans text-slate-500">
        کرنسی ریٹس لوڈ ہو رہے ہیں...
      </div>
    );
  }

  const selectedRateObj = initialData.rates.find((r) => r.code === selectedCurrency);
  const rate = selectedRateObj?.rateAgainstPKR || 278.0;

  const result = direction === 'foreignToPkr'
    ? Math.round(amount * rate * 100) / 100
    : Math.round((amount / rate) * 100) / 100;

  const filteredRates = initialData.rates.filter((r) =>
    r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.nameUrdu.includes(searchTerm)
  );

  return (
    <div className="space-y-8 font-urdu-sans">
      {/* ہیڈر */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          <span>اوپن مارکیٹ و انٹربینک لائیو ایکسچینج ریٹس</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-nastaleeq">
          فارن کرنسی ریٹس بمقابلہ پاکستانی روپیہ
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          امریکی ڈالر، سعودی ریال، یو اے ای درہم، یورو اور برطانوی پاؤنڈ کے تازہ ترین ریٹس اور خودکار کنورٹر
        </p>
      </div>

      {/* کنورٹر کارڈ */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/40 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-lg">
            <ArrowLeftRight className="w-5 h-5" />
            <span>براہِ راست کرنسی کنورٹر (Currency Calculator)</span>
          </div>
          <button
            onClick={() => setDirection(direction === 'foreignToPkr' ? 'pkrToForeign' : 'foreignToPkr')}
            className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-emerald-200 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
          >
            <span>سمت تبدیل کریں ({direction === 'foreignToPkr' ? 'غیر ملکی سے PKR' : 'PKR سے غیر ملکی'})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-semibold">رقم درج کریں:</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-semibold">کرنسی منتخب کریں:</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {initialData.rates.map((r) => (
                <option key={r.code} value={r.code} className="bg-slate-900 text-white">
                  {r.flag} {r.code} - {r.nameUrdu}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
            <div className="text-xs text-emerald-300 font-bold">حتمی نتیجہ:</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              {direction === 'foreignToPkr'
                ? `روپے ${result.toLocaleString('ur-PK')}`
                : `${result.toLocaleString('en-US')} ${selectedCurrency}`}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              1 {selectedCurrency} = {rate} روپے
            </div>
          </div>
        </div>
      </div>

      {/* سرچ اور ریٹس ٹیبل */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-nastaleeq">
              تمام اہم عالمی کرنسیز کے لائیو ریٹس
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              آخری اپڈیٹ: {initialData.lastUpdated}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="کرنسی تلاش کریں..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:px-6">ملک و کرنسی</th>
                <th className="p-3.5 sm:px-6">کوڈ</th>
                <th className="p-3.5 sm:px-6">قیمتِ خرید (PKR)</th>
                <th className="p-3.5 sm:px-6">1 روپے کی قدر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRates.map((c) => (
                <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 sm:px-6 flex items-center gap-2.5">
                    <span className="text-xl">{c.flag}</span>
                    <span className="font-bold text-slate-900">{c.nameUrdu}</span>
                  </td>
                  <td className="p-3.5 sm:px-6 font-bold text-slate-700">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-mono">
                      {c.code}
                    </span>
                  </td>
                  <td className="p-3.5 sm:px-6 font-extrabold text-emerald-700 text-base">
                    روپے {c.rateAgainstPKR}
                  </td>
                  <td className="p-3.5 sm:px-6 text-slate-500 text-xs">
                    {c.inverseRate} {c.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
