import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsArticleBySlug, getNewsArticles } from '@/lib/supabaseClient';
import { formatUrduDate } from '@/lib/utils';
import { 
  Clock, 
  Share2, 
  ArrowRight, 
  ExternalLink, 
  Radio, 
  MapPin, 
  Building2, 
  Flame,
  CheckCircle2
} from 'lucide-react';

interface NewsDetailPageProps {
  params: { slug: string };
}

// 1. ڈائنامک میٹا ڈیٹا برائے ایس ای او (Dynamic SEO Metadata)
export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const news = await getNewsArticleBySlug(params.slug);

  if (!news) {
    return {
      title: 'خبر نہیں مل سکی | دسترس',
      description: 'مطلوبہ خبر دستیاب نہیں ہے یا حذف کر دی گئی ہے۔',
    };
  }

  const siteUrl = 'https://dastaras.pk';
  const articleUrl = `${siteUrl}/news/${news.slug}`;
  const title = `${news.title} | تازہ ترین خبریں | دسترس`;
  const description = news.meta_description || news.summary || news.content.slice(0, 160);
  const imageUrl = news.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    keywords: [news.category, 'پاکستان بریکنگ نیوز', 'آزاد کشمیر خبریں', 'مظفرآباد', 'دسترس نیوز', news.title],
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: 'دسترس',
      locale: 'ur_PK',
      type: 'article',
      publishedTime: news.published_at,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const revalidate = 60; // 1 منٹ کیشنگ

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const news = await getNewsArticleBySlug(params.slug);

  if (!news) {
    notFound();
  }

  const siteUrl = 'https://dastaras.pk';
  const articleUrl = `${siteUrl}/news/${news.slug}`;

  // اسی زمرے سے مزید خبریں
  const allRelated = await getNewsArticles(news.category, 4);
  const relatedNews = allRelated.filter((n) => n.id !== news.id).slice(0, 3);

  // JSON-LD اسٹرکچرڈ ڈیٹا (NewsArticle Schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: news.title,
    description: news.meta_description || news.summary || news.content.slice(0, 160),
    image: [news.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'],
    datePublished: news.published_at,
    dateModified: news.created_at || news.published_at,
    inLanguage: 'ur',
    author: [
      {
        '@type': 'Organization',
        name: 'دسترس نیوز بیورو',
        url: siteUrl,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'دسترس',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    articleSection: news.category,
    articleBody: news.content,
  };

  const shareText = encodeURIComponent(`*${news.title}*\nدسترس پر مکمل خبر پڑھیں:\n${articleUrl}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;

  return (
    <>
      {/* 2. گوگل اور سرچ انجن کے لیے اسٹرکچرڈ ڈیٹا */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* بریڈ کرمب اور واپس جانے کا ربط */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-bold transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>تمام بریکنگ نیوز پر واپس جائیں</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-red-50 text-red-700 font-extrabold text-xs border border-red-200">
              {news.category}
            </span>
          </div>
        </div>

        {/* سرخی اور اشاعت کا وقت */}
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-portal-slate leading-tight">
            {news.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2 border-b border-slate-200 pb-4">
            <span className="flex items-center gap-1.5 font-bold text-red-600">
              <Clock className="w-4 h-4" />
              <span>شائع شدہ: {formatUrduDate(news.published_at)}</span>
            </span>
            {news.source_name && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>اصل ذریعہ: {news.source_name}</span>
                </span>
              </>
            )}
            <span>•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>مصدقہ اردو صحافتی کوریج</span>
            </span>
          </div>
        </header>

        {/* اہم تصویر */}
        {news.image_url && (
          <div className="relative w-full h-72 sm:h-96 md:h-[440px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* فوری خلاصہ باکس (Summary Box) */}
        {news.summary && (
          <div className="p-6 rounded-2xl bg-red-50/70 border-r-4 border-red-600 text-portal-slate text-xl font-medium leading-loose">
            <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>فوری اہم نکات:</span>
            </div>
            <p>{news.summary}</p>
          </div>
        )}

        {/* مکمل صحافتی خبر کا متن (Pure Nastaleeq Article Body) */}
        <article className="prose prose-lg max-w-none text-portal-slate text-xl sm:text-2xl leading-[2.5] space-y-6 pt-2 font-nastaleeq">
          {news.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-justify">
              {para}
            </p>
          ))}
        </article>

        {/* اصل ذریعہ کا ریفرنس */}
        {news.source_url && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              یہ خبر خودکار طور پر اصل نیوز فیڈ سے وصول کر کے جدید صحافتی اصولوں کے مطابق مرتب کی گئی ہے۔
            </span>
            <a
              href={news.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-portal-primary font-bold hover:underline whitespace-nowrap self-start sm:self-auto"
            >
              <span>اصل نیوز سورس دیکھیں</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* واٹس ایپ اور فیس بک شیئر بار */}
        <div className="portal-card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-red-100">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-red-600" />
            <span className="text-lg font-bold text-portal-slate">خبر اپنے حلقے میں شیئر کریں:</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors shadow-sm"
            >
              <span>واٹس ایپ پر بھیجیں</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors shadow-sm"
            >
              <span>فیس بک</span>
            </a>
          </div>
        </div>

        {/* متعلقہ خبریں */}
        {relatedNews.length > 0 && (
          <section className="pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              <h3 className="text-2xl font-bold text-portal-slate">
                {news.category} سے مزید اہم خبریں
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <div
                  key={item.id}
                  className="portal-card p-5 bg-white flex flex-col justify-between hover:border-red-300 transition-colors"
                >
                  <div>
                    <span className="text-xs text-red-600 font-semibold">{formatUrduDate(item.published_at)}</span>
                    <Link href={`/news/${item.slug}`}>
                      <h4 className="text-lg font-bold text-portal-slate hover:text-red-600 transition-colors line-clamp-2 mt-1 leading-relaxed">
                        {item.title}
                      </h4>
                    </Link>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100">
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-sm font-bold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <span>پڑھیں</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
