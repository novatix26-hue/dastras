'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LiveCurrencyData, CurrencyRateItem } from '@/lib/api/currency';
import { TrendingUp, ArrowLeftRight, ArrowLeft, RefreshCw } from 'lucide-react';

interface CurrencyWidgetProps {
  initialData: LiveCurrencyData | null;
}

export default function CurrencyWidget({ initialData }: CurrencyWidgetProps) {
  const [data, setData] = useState<LiveCurrencyData | null>(initialData);
  const [amount, setAmount] = useState<number>(100);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshRates = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (res.ok) {
        const json = await res.json();
        const usdToPkr = json.rates['PKR'] || 276.18;
        if (data) {
          const updatedRates = data.rates.map((r) => {
            const usdToForeign = json.rates[r.code] || 1.0;
            const rateAgainstPKR = Math.round((usdToPkr / usdToForeign) * 100) / 100;
            const inverseRate = Math.round((1 / rateAgainstPKR) * 10000) / 10000;
            return {
              ...r,
              rateAgainstPKR,
              inverseRate,
            };
          });
          setData({
            ...data,
            rates: updatedRates,
            lastUpdated: new Date().toLocaleTimeString('ur-PK'),
          });
        }
      }
    } catch (e) {
      console.warn('Refresh error:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!data) return null;

  const currentRateObj = data.rates.find((r) => r.code === selectedCurrency);
  const convertedPkr = currentRateObj
    ? Math.round(amount * currentRateObj.rateAgainstPKR)
    : 0;

  const topRates = data.rates.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 font-urdu-sans space-y-4">
      {/* ہیڈر */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">لائیو فارن کرنسی ریٹس</h3>
            <p className="text-[10px] text-slate-400 font-mono">انٹر بینک و اوپن مارکیٹ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshRates}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
            title="تازہ ترین ریٹس حاصل کریں"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          <Link
            href="/currency-rates"
            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-bold"
          >
            <span>تمام کرنسیز</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ٹاپ کرنسی ٹیبل */}
      <div className="space-y-2">
        {topRates.map((c) => (
          <div
            key={c.code}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{c.flag}</span>
              <span className="font-bold text-slate-800">{c.nameUrdu} ({c.code})</span>
            </div>
            <div className="font-extrabold text-emerald-700 text-sm font-mono">
              روپے {c.rateAgainstPKR}
            </div>
          </div>
        ))}
      </div>

      {/* منی کنورٹر */}
      <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 space-y-2.5">
        <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
          <span>فوری کرنسی کنورٹر (روپے میں)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="رقم درج کریں"
          />
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {data.rates.map((r) => (
              <option key={r.code} value={r.code}>
                {r.code} - {r.nameUrdu}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center font-extrabold text-slate-900 text-sm pt-1">
          {amount} {selectedCurrency} = <span className="text-emerald-700 text-base font-mono">روپے {convertedPkr.toLocaleString('ur-PK')}</span>
        </div>
      </div>
    </div>
  );
}
