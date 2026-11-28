'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SurahDetail, QARI_OPTIONS, ALL_SURAHS_DATA, QariOption } from '@/lib/api/quran';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Bookmark, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Type, 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  Settings2,
  Share2,
  RotateCcw
} from 'lucide-react';

interface SurahReaderClientProps {
  surah: SurahDetail;
}

export default function SurahReaderClient({ surah }: SurahReaderClientProps) {
  const router = useRouter();

  // ترتیبات اور اسٹیٹس
  const [selectedFont, setSelectedFont] = useState<'amiri' | 'indopak'>('amiri');
  const [fontSize, setFontSize] = useState<number>(32); // پکسل سائز
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [selectedQari, setSelectedQari] = useState<string>('ar.alafasy');

  // آڈیو پلیئر اسٹیٹ
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [bookmarkedAyah, setBookmarkedAyah] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // آڈیو انیشلائزیشن اور آٹو ایڈوانس (خودکار اگلی آیت چلانا)
  useEffect(() => {
    audioRef.current = new Audio();

    const handleEnded = () => {
      setPlayingAyahIndex((prev) => {
        if (prev !== null && prev < surah.ayahs.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return null;
        }
      });
    };

    const handleError = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('error', handleError);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, [surah.ayahs.length]);

  // جب پلے نگ آیت بدلے تو آڈیو لوڈ کر کے چلائیں اور اسکرول کریں
  useEffect(() => {
    if (playingAyahIndex !== null && audioRef.current) {
      const activeAyah = surah.ayahs[playingAyahIndex];
      if (activeAyah) {
        // اگر قاری مشاری راشد کے علاوہ ہو تو اس کی آڈیو URL منتخب کریں
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedQari}/${activeAyah.number}.mp3`;
        audioRef.current.src = audioUrl;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });

        // متعلقہ آیت کی طرف سمارٹ اسکرول
        const elem = document.getElementById(`ayah-${activeAyah.numberInSurah}`);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [playingAyahIndex, selectedQari, surah.ayahs]);

  // پلے / پاز ٹوگل
  const togglePlayAyah = (index: number) => {
    if (playingAyahIndex === index) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setPlayingAyahIndex(index);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingAyahIndex(null);
    setIsPlaying(false);
  };

  const handleNextAyah = () => {
    if (playingAyahIndex !== null && playingAyahIndex < surah.ayahs.length - 1) {
      setPlayingAyahIndex(playingAyahIndex + 1);
    }
  };

  const handlePrevAyah = () => {
    if (playingAyahIndex !== null && playingAyahIndex > 0) {
      setPlayingAyahIndex(playingAyahIndex - 1);
    }
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 0.75];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  // آیت بک مارک کرنا
  const handleBookmark = (ayahNumber: number) => {
    try {
      localStorage.setItem(
        'dastaras_quran_last_read',
        JSON.stringify({
          surahNumber: surah.meta.number,
          surahName: surah.meta.urduName,
          ayahNumber,
        })
      );
      setBookmarkedAyah(ayahNumber);
      setTimeout(() => setBookmarkedAyah(null), 2500);
    } catch (e) {}
  };

  // آیت کاپی کرنا
  const handleCopyAyah = (arabicText: string, urduText: string, ayahNum: number) => {
    const textToCopy = `${arabicText} ۝ (${ayahNum})\n\nترجمہ:\n${urduText}\n\n[سورۃ ${surah.meta.urduName}، آیت ${ayahNum} | دسترس پورٹل]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayahNum);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  // اگلی اور پچھلی سورت
  const prevSurahNumber = surah.meta.number > 1 ? surah.meta.number - 1 : null;
  const nextSurahNumber = surah.meta.number < 114 ? surah.meta.number + 1 : null;

  return (
    <div className="space-y-8 font-urdu-sans pb-28">
      {/* سورت ٹاپ نیویگیشن و کنٹرول بار */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* بیک ٹو لسٹ اور سورت کا نام */}
          <div className="flex items-center gap-3">
            <Link
              href="/quran"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="سورتوں کی فہرست"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-nastaleeq">
                  {surah.meta.urduName}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {surah.meta.revelationTypeUrdu}
                </span>
                <span className="text-xs text-slate-500">
                  {surah.meta.numberOfAyahs} آیات
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                مفہوم: {surah.meta.urduMeaning} ({surah.meta.englishName})
              </p>
            </div>
          </div>

          {/* سورت ڈراپ ڈاؤن منتخب کریں */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <select
              value={surah.meta.number}
              onChange={(e) => router.push(`/quran/${e.target.value}`)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {ALL_SURAHS_DATA.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.urduName} ({s.revelationTypeUrdu})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* تلاوت سیٹنگز پٹی: رسم الخط، سائز، ترجمہ آن/آف، قاری کا انتخاب */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          {/* ۱. رسم الخط سوئچر */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSelectedFont('amiri')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFont === 'amiri'
                  ? 'bg-white text-emerald-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مصحفِ مدینہ (امیرے)
            </button>
            <button
              onClick={() => setSelectedFont('indopak')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFont === 'indopak'
                  ? 'bg-white text-emerald-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ہند و پاک رسم الخط (شہرزاد)
            </button>
          </div>

          {/* ۲. فونٹ سائز کنٹرول */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700">
            <span className="text-[11px] text-slate-500">فونٹ سائز:</span>
            <button
              onClick={() => setFontSize((s) => Math.max(22, s - 3))}
              className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center font-black"
              title="فونٹ چھوٹا کریں"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-mono">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(52, s + 3))}
              className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center font-black"
              title="فونٹ بڑا کریں"
            >
              +
            </button>
          </div>

          {/* ۳. اردو ترجمہ ٹوگل */}
          <button
            onClick={() => setShowTranslation((t) => !t)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors border ${
              showTranslation
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {showTranslation ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>اردو ترجمہ: {showTranslation ? 'آن' : 'آف'}</span>
          </button>

          {/* ۴. قاری کا انتخاب */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <select
              value={selectedQari}
              onChange={(e) => {
                setSelectedQari(e.target.value);
                if (playingAyahIndex !== null) {
                  // پلے بیک ری سیٹ کریں نئے قاری کے ساتھ
                  stopAudio();
                }
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {QARI_OPTIONS.map((q) => (
                <option key={q.identifier} value={q.identifier}>
                  قاری: {q.nameUrdu}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* سورۃ کا روایتی آرائشی ہیڈر اور بسم اللہ */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-emerald-700/50">
        <div className="space-y-2">
          <div className="text-xs tracking-widest text-emerald-300 font-bold">
            {surah.meta.revelationTypeUrdu === 'مکی' ? 'مَكِّيَّةٌ' : 'مَدَنِيَّةٌ'} • {surah.meta.numberOfAyahs} آيَاتٍ
          </div>
          <div className="text-3xl sm:text-5xl font-bold font-quran text-amber-300 py-1">
            {surah.meta.name}
          </div>
        </div>

        {/* بسم اللہ شریف (سوائے سورۃ التوبہ کے) */}
        {surah.meta.number !== 9 && (
          <div className="pt-4 border-t border-white/10 max-w-xl mx-auto">
            <div className="text-2xl sm:text-4xl font-quran text-slate-100 leading-relaxed tracking-wider">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
            {showTranslation && (
              <div className="text-xs sm:text-sm text-emerald-200/90 mt-2 font-medium">
                شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے
              </div>
            )}
          </div>
        )}
      </div>

      {/* تمام آیات کی تفصیلی فہرست (آیت بہ آیت تلاوت و ترجمہ) */}
      <div className="space-y-4">
        {surah.ayahs.map((ayah, index) => {
          const isCurrentPlaying = playingAyahIndex === index;

          return (
            <div
              key={ayah.number}
              id={`ayah-${ayah.numberInSurah}`}
              className={`rounded-3xl p-5 sm:p-7 border transition-all space-y-4 scroll-mt-24 ${
                isCurrentPlaying
                  ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* آیت کا ٹاپ ایکشن بار */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  {/* آیت نمبر بیج */}
                  <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center font-mono">
                    {ayah.numberInSurah}
                  </span>

                  {ayah.sajdah && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                      سجدۂ تلاوت
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    پارہ {ayah.juz}
                  </span>
                </div>

                {/* ایکشنز: پلے، بک مارک، کاپی */}
                <div className="flex items-center gap-1.5">
                  {/* پلے / پاز بٹن */}
                  <button
                    onClick={() => togglePlayAyah(index)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                      isCurrentPlaying && isPlaying
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                    title={isCurrentPlaying && isPlaying ? 'آڈیو روکیں' : 'آڈیو تلاوت سنیں'}
                  >
                    {isCurrentPlaying && isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">روکیں</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">سنیں</span>
                      </>
                    )}
                  </button>

                  {/* بک مارک بٹن */}
                  <button
                    onClick={() => handleBookmark(ayah.numberInSurah)}
                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-amber-600 transition-colors border border-slate-200/80"
                    title="اس آیت کو آخری پڑھی گئی آیت کے طور پر محفوظ کریں"
                  >
                    {bookmarkedAyah === ayah.numberInSurah ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  {/* کاپی بٹن */}
                  <button
                    onClick={() => handleCopyAyah(ayah.text, ayah.translation, ayah.numberInSurah)}
                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-emerald-700 transition-colors border border-slate-200/80"
                    title="آیت اور ترجمہ کاپی کریں"
                  >
                    {copiedAyah === ayah.numberInSurah ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* عربی قرآنی متن */}
              <div
                dir="rtl"
                className={`text-right text-slate-900 font-bold transition-all ${
                  selectedFont === 'indopak' ? 'font-quran-indopak' : 'font-quran'
                }`}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: selectedFont === 'indopak' ? '2.4' : '2.6',
                }}
              >
                {ayah.text}{' '}
                <span className="text-emerald-700 inline-block px-1 font-quran text-[0.85em] select-none font-normal">
                  ۝{ayah.numberInSurah.toLocaleString('ar-EG')}
                </span>
              </div>

              {/* اردو ترجمہ (مولانا فتح محمد جالندھری) */}
              {showTranslation && ayah.translation && (
                <div className="pt-3 border-t border-slate-100/80 text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50/60 p-3.5 rounded-2xl">
                  <div className="text-[10px] text-emerald-800 font-bold mb-1">
                    ترجمہ:
                  </div>
                  {ayah.translation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* سورت کے اختتام پر اگلی اور پچھلی سورت کا نیویگیشن */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        {prevSurahNumber ? (
          <Link
            href={`/quran/${prevSurahNumber}`}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 font-bold text-sm shadow-sm transition-all"
          >
            <ChevronRight className="w-4 h-4" />
            <span>پچھلی سورت ({ALL_SURAHS_DATA[prevSurahNumber - 1].urduName})</span>
          </Link>
        ) : <div />}

        <Link
          href="/quran"
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>تمام سورتوں کی فہرست</span>
        </Link>

        {nextSurahNumber ? (
          <Link
            href={`/quran/${nextSurahNumber}`}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 font-bold text-sm shadow-sm transition-all"
          >
            <span>اگلی سورت ({ALL_SURAHS_DATA[nextSurahNumber - 1].urduName})</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>

      {/* ======================================================== */}
      {/* فلوٹنگ آڈیو پلیئر بار (اسکرین کے نیچے لائیو کنٹرول) */}
      {/* ======================================================== */}
      {playingAyahIndex !== null && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-50 bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-4 shadow-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-5">
          {/* سورت اور آیت کی معلومات */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-sm text-emerald-300 font-nastaleeq">
                {surah.meta.urduName} — آیت نمبر {surah.ayahs[playingAyahIndex].numberInSurah}
              </div>
              <div className="text-[11px] text-slate-400">
                قاری: {QARI_OPTIONS.find((q) => q.identifier === selectedQari)?.nameUrdu}
              </div>
            </div>
          </div>

          {/* پلے بیک کنٹرولز */}
          <div className="flex items-center gap-3">
            {/* پچھلی آیت */}
            <button
              onClick={handlePrevAyah}
              disabled={playingAyahIndex === 0}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 transition-colors"
              title="پچھلی آیت"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* پلے / پاز بٹن */}
            <button
              onClick={() => togglePlayAyah(playingAyahIndex)}
              className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              title={isPlaying ? 'روکیں' : 'چلائیں'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* اگلی آیت */}
            <button
              onClick={handleNextAyah}
              disabled={playingAyahIndex === surah.ayahs.length - 1}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 transition-colors"
              title="اگلی آیت"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* رفتار (Speed) */}
            <button
              onClick={changeSpeed}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-300 font-mono"
              title="تلاوت کی رفتار"
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* بند کریں */}
          <button
            onClick={stopAudio}
            className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            آڈیو بند کریں ✕
          </button>
        </div>
      )}
    </div>
  );
}
