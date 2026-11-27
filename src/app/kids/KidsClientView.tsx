'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { formatUrduDate } from '@/lib/utils';
import { 
  Sparkles, 
  BookOpen, 
  Heart, 
  Volume2, 
  VolumeX, 
  Smile, 
  Clock, 
  ArrowLeft, 
  Award, 
  Star,
  Compass,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface KidsClientViewProps {
  initialStories: Article[];
}

export default function KidsClientView({ initialStories }: KidsClientViewProps) {
  const [selectedTag, setSelectedTag] = useState<string>('تمام');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // پہلی یا نمایاں کہانی کو "آج کی کہانی" بنائیں
  const featuredStory = initialStories[0];
  const otherStories = initialStories.slice(1);

  // ٹیگز کی بنیاد پر فلٹر
  const filteredStories = selectedTag === 'تمام'
    ? otherStories
    : otherStories.filter(s => 
        s.keywords?.includes(selectedTag) || 
        s.title.includes(selectedTag) || 
        s.summary?.includes(selectedTag)
      );

  // براؤزر کا اسپیچ ریڈر برائے کہانی
  const toggleAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('معذرت، آپ کا براؤزر آڈیو اسپیچ کو سپورٹ نہیں کرتا۔');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ur-PK';
    utterance.rate = 0.85; // بچوں کے لیے آہستہ اور صاف انداز
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const filterTabs = [
    { id: 'تمام', label: 'تمام کہانیاں' },
    { id: 'اخلاقی', label: 'اخلاقی و سبق آموز' },
    { id: 'جانور', label: 'جانوروں کی کہانیاں' },
    { id: 'سچائی', label: 'سچائی و دیانت' },
    { id: 'دانائی', label: 'عقل و دانائی' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-purple-50/30 to-emerald-50/40 py-10 font-urdu-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ہیڈر و خوش آمدید بینر */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm shadow-md animate-bounce">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>بچوں کی رنگین دنیا</span>
            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 font-nastaleeq leading-tight tracking-tight">
            آج کی خوبصورت کہانی
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
            پیارے بچو! روزانہ ایک خوبصورت، سچی اور دلچسپ کہانی پڑھیں جس میں دلکش تصویریں، انوکھی حکمت اور زندگی کو سنوارنے والا ایک سنہری سبق موجود ہے۔
          </p>
        </div>

        {/* 1. آج کی خاص کہانی (Hero Featured Story) */}
        {featuredStory ? (
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border-2 border-purple-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative group">
            
            {/* بائیں / دائیں جانب دلکش تصویری جھلک */}
            <div className="lg:col-span-7 relative h-72 sm:h-[420px] w-full bg-slate-100 overflow-hidden">
              <Image
                src={featuredStory.image_url || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80'}
                alt={featuredStory.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>آج کا خاص انتخاب</span>
                </span>
                <span className="bg-purple-900/80 backdrop-blur-sm text-purple-200 text-xs px-3 py-1.5 rounded-full font-bold">
                  تصویری جھلکیاں 📸
                </span>
              </div>
            </div>

            {/* کہانی کا مواد و اخلاقی نکتہ */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5 text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>۳ تا ۵ منٹ پڑھائی</span>
                  </span>
                  <span>{formatUrduDate(featuredStory.published_at || featuredStory.created_at)}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-nastaleeq leading-tight group-hover:text-purple-700 transition-colors">
                  <Link href={`/articles/${featuredStory.slug}`}>
                    {featuredStory.title}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base text-slate-600 line-clamp-4 leading-relaxed">
                  {featuredStory.summary || featuredStory.content.slice(0, 220)}...
                </p>

                {/* آج کا سبق آموز نکتہ (Moral of the Day) */}
                <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-black text-xs font-nastaleeq">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>آج کا سبق آموز نکتہ:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 font-bold">
                    {featuredStory.meta_description || 'ہمیشہ سچ بولیں اور دوسروں کی مدد کریں، کیونکہ اچھے کام کا بدلہ ہمیشہ اچھا ہوتا ہے۔'}
                  </p>
                </div>
              </div>

              {/* ایکشن بٹنز */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleAudio(`${featuredStory.title}۔ ${featuredStory.summary || featuredStory.content}`)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                  }`}
                  title="کہانی سنیں"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'آواز بند کریں' : 'کہانی سنیں 🔊'}</span>
                </button>

                <Link
                  href={`/articles/${featuredStory.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-sm shadow-md transition-all active:scale-95"
                >
                  <span>مکمل کہانی پڑھیں</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Smile className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold font-nastaleeq text-slate-800">کہانیاں لوڈ ہو رہی ہیں...</h3>
          </div>
        )}

        {/* 2. کہانیوں کے زمرے (Filter Tabs) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-nastaleeq">
                بچوں کا اخلاقی و معلوماتی ذخیرہ
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTag(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedTag === tab.id
                      ? 'bg-purple-700 text-white shadow-sm scale-105'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. کہانیوں کا تصویری گرڈ (Illustrated Stories Grid) */}
          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredStories.map((story, idx) => (
                <div
                  key={story.id || idx}
                  className="bg-white rounded-3xl border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* دلکش تصویری کارڈ */}
                    <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={story.image_url || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-purple-900/85 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                        تصویری کہانی ⭐
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>اخلاقی سبق</span>
                        </span>
                        <span>{formatUrduDate(story.published_at || story.created_at)}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 font-nastaleeq leading-relaxed">
                        <Link href={`/articles/${story.slug}`}>
                          {story.title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {story.summary || story.content.slice(0, 150)}...
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/articles/${story.slug}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-purple-50 hover:bg-purple-700 hover:text-white text-purple-900 text-xs sm:text-sm font-black transition-all shadow-sm"
                    >
                      <span>کہانی پڑھیں</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">اس ٹیگ کے تحت مزید کہانیاں جلد شامل کی جا رہی ہیں۔</p>
            </div>
          )}
        </div>

        {/* 4. والدین اور اساتذہ کے لیے رہنما نکتہ */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Heart className="w-4 h-4 fill-amber-300" />
              <span>والدین اور اساتذہ کے لیے خصوصی رہنمائی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-nastaleeq">
              روزانہ رات کو بچوں کو ایک کہانی ضرور سنائیں!
            </h2>
            <p className="text-sm text-purple-100 leading-relaxed">
              تحقیق کے مطابق جو والدین اپنے بچوں کو روزانہ اخلاقی کہانیاں سناتے ہیں، ان کے بچوں کی تخلیقی صلاحیت، زبان پر گرفت اور اخلاقی تربیت عام بچوں کے مقابلے میں 40 فیصد زیادہ مضبوط ہوتی ہے۔
            </p>
          </div>
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <Link
              href="/"
              className="px-6 py-3 rounded-2xl bg-white text-purple-950 font-black text-sm hover:bg-amber-300 transition-colors shadow-lg"
            >
              ہوم پیج پر واپس جائیں
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
