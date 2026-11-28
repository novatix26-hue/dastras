import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Sparkles, Volume2 } from 'lucide-react';

export default function QuranWidget() {
  const quickSurahs = [
    { number: 1, name: 'الفاتحہ', desc: 'دیباچہ قرآن' },
    { number: 36, name: 'یٰس', desc: 'قلبِ قرآن' },
    { number: 55, name: 'الرحمٰن', desc: 'عروس القرآن' },
    { number: 67, name: 'الملک', desc: 'نجات دلانے والی' },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-700/50 font-urdu-sans space-y-4">
      {/* ہیڈر */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-base sm:text-lg font-nastaleeq">قرآنِ کریم آن لائن</h3>
            <p className="text-[11px] text-slate-400">تلاوت، اعراب اور سلیس اردو ترجمہ</p>
          </div>
        </div>

        <Link
          href="/quran"
          className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 font-bold transition-colors"
        >
          <span>تمام ۱۱۴ سورتیں</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* منتخب آیت / روزانہ کا نور */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-right">
        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>آیتِ مبارکہ:</span>
        </div>
        <div className="font-quran text-lg sm:text-xl text-amber-200 leading-relaxed font-bold">
          أَلَا بِذِكۡرِ ٱللَّهِ تَطۡمَئِنُّ ٱلۡقُلُوبُ ۝
        </div>
        <div className="text-xs text-slate-300">
          خبردار! اللہ کے ذکر ہی سے دلوں کو اطمینان حاصل ہوتا ہے۔ (الرعد: ۲۸)
        </div>
      </div>

      {/* مقبول سورتوں کے فوری روابط */}
      <div className="grid grid-cols-2 gap-2">
        {quickSurahs.map((s) => (
          <Link
            key={s.number}
            href={`/quran/${s.number}`}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-800/40 border border-white/10 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-xs text-white group-hover:text-emerald-300 font-nastaleeq">
                سورۃ {s.name}
              </div>
              <div className="text-[10px] text-slate-400">{s.desc}</div>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              تلاوت ←
            </span>
          </Link>
        ))}
      </div>

      {/* مکمل قرآن بٹن */}
      <Link
        href="/quran"
        className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs text-center block shadow-sm transition-all active:scale-95"
      >
        مکمل قرآن مجید کھولیں (۱۱۴ سورتیں)
      </Link>
    </div>
  );
}
