import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/supabaseClient';
import { formatUrduDate } from '@/lib/utils';
import { 
  Flame, 
  Clock, 
  ArrowLeft, 
  BookOpen, 
  Tag, 
  Sparkles,
  PackageX 
} from 'lucide-react';

interface CategoryPageProps {
  params: { category: string };
}

const CATEGORY_MAP: Record<string, { urduName: string; title: string; desc: string }> = {
  'pakistan': {
    urduName: 'پاکستان',
    title: 'پاکستان کی تازہ ترین خبریں و حالاتِ حاضرہ | دسترس',
    desc: 'پاکستان بھر سے لمحہ بہ لمحہ باوثوق سیاسی، معاشی اور سماجی خبریں اور تجزیات۔',
  },
  'azad-kashmir': {
    urduName: 'آزاد کشمیر',
    title: 'آزاد کشمیر اور مظفرآباد کی تازہ ترین خبریں | دسترس',
    desc: 'آزاد جموں و کشمیر، مظفرآباد، میرپور، راولاکوٹ اور گردونواح کی اہم پیش رفت اور مصدقہ خبریں۔',
  },
  'international': {
    urduName: 'عالمی',
    title: 'عالمی خبریں اور بین الاقوامی حالات | دسترس',
    desc: 'دنیا بھر سے اہم ترین بین الاقوامی خبریں، سفارتکاری اور عالمی طاقتوں کی پیش رفت۔',
  },
  'sports': {
    urduName: 'کھیل',
    title: 'کھیل اور کرکٹ کی تازہ ترین خبریں | دسترس',
    desc: 'کرکٹ، پی ایس ایل، ورلڈ کپ اور دیگر قومی و بین الاقوامی کھیلوں کے لائیو اپڈیٹس۔',
  },
  'health': {
    urduName: 'صحت',
    title: 'طبی و صحت رہنمائی اور مضامین | دسترس',
    desc: 'صحت، تندرستی، گھریلو نسخے، جدید میڈیکل ریسرچ اور ڈاکٹروں کی مستند آراء۔',
  },
  'technology': {
    urduName: 'ٹیکنالوجی',
    title: 'سائنس و ٹیکنالوجی اور سمارٹ گیجٹس | دسترس',
    desc: 'مصنوعی ذہانت، اسمارٹ فونز، انٹرنیٹ اور جدید سائنس سے متعلق معلوماتی مضامین۔',
  },
  'business': {
    urduName: 'کاروبار',
    title: 'کاروبار، اسٹاک مارکیٹ اور معیشت | دسترس',
    desc: 'پاکستانی معیشت، اسٹاک ایکسچینج، سونا و چاندی اور کاروباری دنیا کی تازہ ترین صورتحال۔',
  },
  'weird': {
    urduName: 'عجیب و دلچسپ',
    title: 'عجیب و غریب اور دلچسپ خبریں | حیرت انگیز واقعات | دسترس',
    desc: 'دنیا بھر سے عجیب و غریب واقعات، انوکھے ریکارڈز، پراسرار کہانیاں اور حیرت انگیز سچی خبریں۔',
  },
  'kids': {
    urduName: 'بچوں کی دنیا',
    title: 'بچوں کی دنیا | اخلاقی کہانیاں و سبق آموز تحریریں | دسترس',
    desc: 'بچوں کے لیے خوبصورت، سبق آموز اور دلچسپ کہانیاں، تصویری جھلکیاں اور اخلاقی اسباق۔',
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const meta = CATEGORY_MAP[params.category];
  if (!meta) {
    return { title: 'زمرہ دستیاب نہیں | دسترس' };
  }

  return {
    title: meta.title,
    description: meta.desc,
    keywords: [meta.urduName, 'اردو خبریں', 'دسترس', 'پاکستان'],
  };
}

export const revalidate = 60; // 1 منٹ کیشنگ

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryInfo = CATEGORY_MAP[params.category];
  if (!categoryInfo) {
    notFound();
  }

  // زمرے کے تمام مضامین حاصل کریں
  const articles = await getArticles({
    category: params.category,
    limit: 30,
  });

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-urdu-sans">
      {/* ہیڈر */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
          <Tag className="w-4 h-4 text-emerald-700" />
          <span>خصوصی کوریج ڈیسک</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-nastaleeq">
          شعبہ: {categoryInfo.urduName}
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          {categoryInfo.desc}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="space-y-10">
          {/* نمایاں فیچرڈ تحریر */}
          {featured && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 group hover:shadow-md transition-shadow">
              <div className="lg:col-span-7 relative h-72 sm:h-96 w-full bg-slate-100">
                <Image
                  src={featured.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {featured.is_breaking && (
                  <span className="absolute top-4 right-4 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md animate-pulse">
                    بریکنگ نیوز
                  </span>
                )}
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatUrduDate(featured.published_at || featured.created_at)}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors font-nastaleeq leading-tight">
                    <Link href={`/articles/${featured.slug}`}>
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">
                    {featured.summary || featured.content.slice(0, 200)}...
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {featured.source_name || 'دسترس ایڈیٹوریل'}
                  </span>
                  <Link
                    href={`/articles/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold text-sm"
                  >
                    <span>مکمل پڑھیں</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* دیگر مضامین کی گرڈ */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={art.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
                        alt={art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatUrduDate(art.published_at || art.created_at)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 font-nastaleeq">
                        <Link href={`/articles/${art.slug}`}>
                          {art.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {art.summary || art.content.slice(0, 140)}...
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/articles/${art.slug}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-colors"
                    >
                      <span>تفصیل پڑھیں</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* خالی حالت (Empty State) */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 font-nastaleeq">
            اس زمرے میں فی الحال کوئی تحریر موجود نہیں
          </h3>
          <p className="text-sm text-slate-500">
            تازہ ترین خبریں خودکار طریقے سے حاصل کی جا رہی ہیں۔ آپ ایڈمن پینل سے فوری دستی خبریں بھی شامل کر سکتے ہیں۔
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-sm hover:bg-emerald-800 transition-colors"
          >
            ہوم پیج پر واپس جائیں
          </Link>
        </div>
      )}
    </div>
  );
}
