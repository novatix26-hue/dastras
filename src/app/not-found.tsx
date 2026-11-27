'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    // 4 سیکنڈ بعد خودکار طور پر صفحہ اول (ہوم پیج) پر واپس لے جائے
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-urdu-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto text-4xl font-black font-nastaleeq shadow-inner">
          ۴۰۴
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 font-nastaleeq">
            صفحہ دستیاب نہیں ہے
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            مطلوبہ صفحہ تبدیل یا حذف ہو چکا ہے۔ آپ کو {secondsLeft} سیکنڈ میں خودکار طور پر صفحہ اول (مرکزی صفحہ) پر منتقل کیا جا رہا ہے۔
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-lg transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>ابھی صفحہ اول پر جائیں</span>
          </Link>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>صفحہ ریفریش کریں</span>
          </button>
        </div>
      </div>
    </div>
  );
}
