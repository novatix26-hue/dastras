'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Bell, ChevronLeft, Radio } from 'lucide-react';
import { Article } from '@/lib/types';

interface TickerProps {
  articles: Article[];
}

export default function Ticker({ articles }: TickerProps) {
  // صرف خاص اور اہم خبریں، کہانیوں کے عنوانات ٹکر میں شامل نہ ہوں
  const filteredArticles = (articles || []).filter(
    (item) => item.category !== 'kids' && !item.category?.includes('کہانی')
  );

  if (filteredArticles.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white font-urdu-sans shadow-md border-b border-red-800">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* بیج */}
        <div className="bg-red-950/80 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1.5 font-bold text-xs sm:text-sm whitespace-nowrap z-10 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
          <Flame className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="hidden sm:inline">بریکنگ نیوز:</span>
          <span className="sm:hidden">خبر:</span>
        </div>

        {/* اسکرولنگ ہیڈلائنز مارکی */}
        <div className="flex-1 overflow-hidden py-2 sm:py-2.5 relative">
          <div className="animate-marquee flex items-center gap-8 text-xs sm:text-sm font-medium">
            {filteredArticles.map((item, idx) => (
              <Link
                key={item.id || idx}
                href={`/articles/${item.slug}`}
                className="inline-flex items-center gap-2 hover:text-yellow-200 transition-colors cursor-pointer group"
              >
                <span className="text-yellow-300 font-bold">●</span>
                <span className="group-hover:underline">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* تمام دیکھیں لنک */}
        <Link
          href="/category/pakistan"
          className="hidden md:flex items-center gap-1 bg-red-800/80 hover:bg-red-800 px-3 py-2 text-xs font-semibold whitespace-nowrap z-10 transition-colors"
        >
          <span>تمام خبریں</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
