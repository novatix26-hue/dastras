import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getNewsArticles } from '@/lib/supabaseClient';
import { formatUrduDate } from '@/lib/utils';
import { 
  Flame, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Radio, 
  ShieldAlert, 
  Share2, 
  Globe2, 
  Sparkles 
} from 'lucide-react';

export const revalidate = 60; // 1 منٹ کیشنگ تاکہ تازہ ترین بریکنگ نیوز فوری ظاہر ہو

export const metadata: Metadata = {
  title: 'تازہ ترین بریکنگ نیوز | پاکستان اور آزاد کشمیر کی مستند خبریں | دسترس',
  description: 'پاکستان اور آزاد جموں و کشمیر سے لمحہ بہ لمحہ باوثوق بریکنگ نیوز، سیاسی و سماجی پیش رفت، معیشت اور اہم ترین اعلانات۔',
  keywords: ['بریکنگ نیوز', 'پاکستان خبریں', 'آزاد کشمیر خبریں', 'مظفرآباد نیوز', 'کشمیر تازہ ترین', 'دسترس نیوز'],
  openGraph: {
    title: 'تازہ ترین بریکنگ نیوز - پاکستان و آزاد کشمیر | دسترس',
    description: 'پاکستان اور آزاد جموں و کشمیر سے لمحہ بہ لمحہ باوثوق بریکنگ نیوز اور اہم پیش رفت۔',
    type: 'website',
    locale: 'ur_PK',
  },
};

export default async function NewsListingPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const selectedCategory = searchParams?.category || 'تمام';
  const allNews = await getNewsArticles(
    selectedCategory === 'تمام' ? undefined : selectedCategory,
    40
  );

  const breakingItem = allNews[0];
  const regularNews = allNews.slice(1);

  const categories = ['تمام', 'پاکستان', 'آزاد کشمیر'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* لائیو بریکنگ بینر */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md">
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/20 text-white font-extrabold text-sm whitespace-nowrap animate-pulse">
          <Radio className="w-4 h-4" />
          <span>لائیو کوریج</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-base font-semibold truncate leading-normal">
            {breakingItem
              ? `بریکنگ: ${breakingItem.title}`
              : 'پاکستان اور آزاد کشمیر سے تازہ ترین اطلاعات خودکار طور پر نشر کی جا رہی ہیں۔'}
          </p>
        </div>
        <Link
          href="#latest"
          className="text-xs bg-white text-red-700 px-3 py-1.5 rounded-lg font-bold hover:bg-red-50 transition-colors whitespace-nowrap hidden sm:inline-block"
        >
          تمام پڑھیں
        </Link>
      </div>

      {/* ہیڈر اور عنوان */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-700 font-bold text-sm border border-red-200">
          <Flame className="w-4 h-4 text-red-600 fill-red-600" />
          <span>خودکار و مصدقہ نیوز ڈیسک</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-portal-slate leading-tight">
          پاکستان اور آزاد کشمیر کی تازہ ترین خبریں
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          جدید سمارٹ فیڈز اور مصنوعی ذہانت کے ذریعے مرتب کردہ لمحہ بہ لمحہ باوثوق اردو صحافتی کوریج
        </p>
      </div>

      {/* کیٹیگری فلٹرز */}
      <div className="portal-card p-4 sm:p-6 bg-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-sm font-bold text-slate-500 ml-2">زمرہ:</span>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === 'تمام' ? '/news' : `/news?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-xl text-base font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="text-sm text-slate-500 font-bold">
          دستیاب خبریں: <span className="text-red-600 font-extrabold text-base">{allNews.length}</span>
        </div>
      </div>

      {/* نمایاں ترین خبر (Featured Hero News) */}
      {breakingItem && (
        <section className="portal-card overflow-hidden bg-white border-2 border-red-100 hover:border-red-400 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 group">
          <div className="md:col-span-7 relative h-72 md:h-auto min-h-[320px] bg-slate-100 overflow-hidden">
            <Image
              src={breakingItem.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
              alt={breakingItem.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-lg text-sm font-extrabold bg-red-600 text-white shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                بریکنگ
              </span>
              <span className="px-3 py-1 rounded-lg text-sm font-bold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm border">
                {breakingItem.category}
              </span>
            </div>
          </div>

          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-red-600">
                  <Clock className="w-3.5 h-3.5" />
                  {formatUrduDate(breakingItem.published_at)}
                </span>
                {breakingItem.source_name && (
                  <>
                    <span>•</span>
                    <span>ذریعہ: {breakingItem.source_name}</span>
                  </>
                )}
              </div>

              <Link href={`/news/${breakingItem.slug}`}>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-portal-slate group-hover:text-red-600 transition-colors leading-relaxed">
                  {breakingItem.title}
                </h2>
              </Link>

              <p className="text-slate-600 text-base sm:text-lg line-clamp-4 leading-relaxed pt-1">
                {breakingItem.summary || breakingItem.content.slice(0, 160) + '...'}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">مکمل صحافتی کوریج</span>
              <Link
                href={`/news/${breakingItem.slug}`}
                className="inline-flex items-center gap-2 text-red-600 font-extrabold hover:text-red-700 transition-colors group-hover:translate-x-[-4px] duration-200"
              >
                <span>تفصیلات پڑھیں</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* دیگر خبروں کی گرڈ */}
      <section id="latest" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-portal-border pb-3">
          <Globe2 className="w-5 h-5 text-red-600" />
          <h3 className="text-2xl font-extrabold text-portal-slate">
            تازہ ترین خبر نامہ ({selectedCategory})
          </h3>
        </div>

        {regularNews.length === 0 ? (
          <div className="portal-card bg-white p-12 text-center text-slate-500">
            اس زمرے میں فی الوقت مزید خبریں دستیاب نہیں ہیں۔
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((news) => (
              <article
                key={news.id}
                className="portal-card overflow-hidden bg-white flex flex-col justify-between group hover:border-red-300 transition-all duration-300"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={news.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/90 text-slate-800 shadow-sm border">
                        {news.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-red-500" />
                      <span>{formatUrduDate(news.published_at)}</span>
                      {news.source_name && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{news.source_name}</span>
                        </>
                      )}
                    </div>

                    <Link href={`/news/${news.slug}`}>
                      <h4 className="text-xl font-bold text-portal-slate group-hover:text-red-600 transition-colors line-clamp-2 leading-relaxed">
                        {news.title}
                      </h4>
                    </Link>

                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {news.summary || news.content.slice(0, 110) + '...'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 mt-2 border-t border-slate-50 flex items-center justify-between text-sm">
                  <span className="text-xs text-slate-400">دسترس نیوز ڈیسک</span>
                  <Link
                    href={`/news/${news.slug}`}
                    className="text-red-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>مکمل پڑھیں</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
