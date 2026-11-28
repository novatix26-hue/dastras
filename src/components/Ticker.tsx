'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, ChevronLeft } from 'lucide-react';
import { Article } from '@/lib/types';

interface TickerProps {
  initialArticles?: Article[];
}

export default function Ticker({ initialArticles = [] }: TickerProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  // فاسٹ ہائیڈریشن اور کیش مینجمنٹ (0ms فوری لوڈنگ)
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setArticles(initialArticles);
      try {
        localStorage.setItem('dastaras_ticker_cache', JSON.stringify(initialArticles.slice(0, 15)));
      } catch {}
    } else {
      try {
        const cached = localStorage.getItem('dastaras_ticker_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setArticles(parsed);
          }
        }
      } catch {}
    }
  }, [initialArticles]);

  // صرف قومی، بین الاقوامی اور بریکنگ خبریں (کہانیوں کے عنوانات ٹکر میں شامل نہ ہوں)
  const filteredArticles = articles.filter(
    (item) => item.category !== 'kids' && !item.category?.includes('کہانی')
  );

  if (filteredArticles.length === 0) return null;

  // ہموار لامتناہی اسکرولنگ (Seamless Infinite Marquee) کے لیے دوہری لسٹ
  const displayArticles = [...filteredArticles, ...filteredArticles];

  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white font-urdu-sans shadow-md border-b border-red-800/80 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* بریکنگ نیوز بیج */}
        <div className="bg-red-950/90 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 font-bold text-xs sm:text-sm whitespace-nowrap z-20 shadow-md border-l border-red-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
          </span>
          <Flame className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="hidden sm:inline font-nastaleeq text-base leading-none pt-0.5">بریکنگ نیوز:</span>
          <span className="sm:hidden font-bold">تازہ ترین:</span>
        </div>

        {/* بغیر وقفے فوری رواں مارکی (0ms Instant Delay Infinite Marquee) */}
        <div className="flex-1 overflow-hidden py-2 sm:py-2.5 relative">
          <div className="animate-marquee flex items-center gap-8 text-xs sm:text-sm font-medium">
            {displayArticles.map((item, idx) => (
              <Link
                key={`${item.id || 'tick'}-${idx}`}
                href={`/articles/${item.slug}`}
                className="inline-flex items-center gap-2.5 hover:text-yellow-200 transition-colors cursor-pointer shrink-0 group"
              >
                <span className="text-yellow-300 font-black text-sm">●</span>
                <span className="group-hover:underline font-nastaleeq text-sm sm:text-base leading-snug">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* تمام دیکھیں بٹن */}
        <Link
          href="/category/pakistan"
          className="hidden md:flex items-center gap-1 bg-red-900/90 hover:bg-red-950 px-3.5 py-2 text-xs font-bold whitespace-nowrap z-20 transition-colors border-r border-red-800 shadow-sm"
        >
          <span>تمام خبریں</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
