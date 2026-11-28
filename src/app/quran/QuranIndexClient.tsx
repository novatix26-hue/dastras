'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SurahMeta } from '@/lib/api/quran';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Compass, 
  Play, 
  Bookmark, 
  Volume2, 
  ArrowLeft,
  CheckCircle2,
  Eye
} from 'lucide-react';

interface QuranIndexClientProps {
  initialSurahs: SurahMeta[];
}

export default function QuranIndexClient({ initialSurahs }: QuranIndexClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [lastRead, setLastRead] = useState<{ surahNumber: number; surahName: string; ayahNumber: number } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dastaras_quran_last_read');
      if (saved) {
        setLastRead(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const filteredSurahs = initialSurahs.filter((surah) => {
    const matchesSearch =
      surah.urduName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString() === searchQuery.trim();

    const matchesType =
      selectedType === 'all' || surah.revelationType === selectedType;

    return matchesSearch && matchesType;
  });

  // پاکستان میں کثرت سے تلاوت کی جانے والی سورتیں
  const popularSurahs = [
    { number: 1, name: 'الفاتحہ' },
    { number: 36, name: 'یٰسین' },
    { number: 55, name: 'الرحمٰن' },
    { number: 67, name: 'الملک' },
    { number: 18, name: 'الکہف' },
    { number: 56, name: 'الواقعہ' },
    { number: 112, name: 'الاخلاص' },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 font-urdu-sans">
      {/* ہیڈر و تلاوتِ قرآن بینر */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-12 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>قرآنِ حکیم | کلامِ الٰہی</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-nastaleeq tracking-wide leading-tight">
            قرآن مجید آن لائن تلاوت و سماعت
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            پڑھنے میں انتہائی آسان اور واضح اعراب والا قرآنی رسم الخط، مولانا فتح محمد جالندھری کا بامحاورہ سلیس اردو ترجمہ، اور مشاری راشد العفاسی و قراء کبار کی خوبصورت آواز میں آیت بہ آیت آڈیو تلاوت۔
          </p>

          {/* آخری پڑھی گئی آیت پر واپس جائیں */}
          {lastRead && (
            <div className="pt-2">
              <Link
                href={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>جہاں تلاوت چھوڑی تھی وہیں سے جاری رکھیں ({lastRead.surahName}، آیت {lastRead.ayahNumber})</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* بیک گراؤنڈ آرائشی عناصر */}
        <div className="absolute top-0 left-0 -mt-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* مقبول سورتوں کے فوری روابط (Quick Pills) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>مقبول و کثیر التلاوت سورتیں:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {popularSurahs.map((ps) => (
            <Link
              key={ps.number}
              href={`/quran/${ps.number}`}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>سورۃ {ps.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* سرچ اور فلٹرز */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* سرچ ان پٹ */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="سورت کا نام (اردو یا انگریزی) یا نمبر تلاش کریں..."
            className="w-full pl-4 pr-11 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 shadow-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>

        {/* مکی / مدنی فلٹر ٹیبز */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl border border-slate-300/50 self-start sm:self-auto">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'all'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تمام ({initialSurahs.length})
          </button>
          <button
            onClick={() => setSelectedType('Meccan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'Meccan'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مکی سورتیں (86)
          </button>
          <button
            onClick={() => setSelectedType('Medinan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'Medinan'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مدنی سورتیں (28)
          </button>
        </div>
      </div>

      {/* ۱۱۴ سورتوں کا کارڈ گرڈ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSurahs.map((surah) => (
          <Link
            key={surah.number}
            href={`/quran/${surah.number}`}
            className="group bg-white rounded-3xl p-5 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* سورت نمبر کا اسلامی بیج */}
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-sm flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  {surah.number}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-nastaleeq group-hover:text-emerald-700 transition-colors">
                    {surah.urduName}
                  </h3>
                  <div className="text-xs text-slate-500 font-sans">
                    {surah.englishName} ({surah.englishNameTranslation})
                  </div>
                </div>
              </div>

              {/* عربی رسم الخط کا نام */}
              <div className="font-quran text-xl text-slate-800 font-bold text-left group-hover:text-emerald-800 transition-colors">
                {surah.name}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                  {surah.revelationTypeUrdu}
                </span>
                <span>{surah.numberOfAyahs} آیات</span>
              </div>

              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold group-hover:translate-x-[-2px] transition-transform">
                <span>تلاوت شروع کریں</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700 font-nastaleeq">کوئی سورت نہیں ملی</h3>
          <p className="text-xs text-slate-400">براہِ کرم سورت کا درست نام یا نمبر درج کریں۔</p>
        </div>
      )}
    </div>
  );
}
