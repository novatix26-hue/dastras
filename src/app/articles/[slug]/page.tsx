import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticles } from '@/lib/supabaseClient';
import { formatUrduDate } from '@/lib/utils';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import ArticleShareActions from '@/components/ArticleShareActions';
import OptimizedImage from '@/components/OptimizedImage';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  BookOpen, 
  ExternalLink,
  CheckCircle2,
  Radio
} from 'lucide-react';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  let decodedSlug = params.slug;
  try {
    decodedSlug = decodeURIComponent(params.slug);
  } catch {}

  const article = await getArticleBySlug(decodedSlug);

  if (!article) {
    return {
      title: 'مضمون نہیں مل سکا | دسترس',
      description: 'معذرت، مطلوبہ تحریر نہیں مل سکی یا حذف کر دی گئی ہے۔',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dastras-five.vercel.app';
  const articleUrl = `${siteUrl}/articles/${encodeURIComponent(article.slug)}`;
  const title = `${article.title} | دسترس`;
  const description = article.meta_description || article.summary || article.content.slice(0, 160);
  const imageUrl = article.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    keywords: Array.isArray(article.keywords) ? article.keywords : [article.category, 'پاکستان', 'دسترس', article.title],
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
      publishedTime: article.published_at || article.created_at,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
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

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  let decodedSlug = params.slug;
  try {
    decodedSlug = decodeURIComponent(params.slug);
  } catch {}

  const article = await getArticleBySlug(decodedSlug);

  if (!article) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dastras-five.vercel.app';
  const articleUrl = `${siteUrl}/articles/${encodeURIComponent(article.slug)}`;

  // اسی زمرے سے مزید مضامین
  const allRelated = await getArticles({ category: article.category, limit: 4 });
  const related = allRelated.filter((a) => a.id !== article.id).slice(0, 3);

  // JSON-LD اسٹرکچرڈ ڈیٹا برائے گوگل اور سرچ انجنز
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: article.title,
    description: article.meta_description || article.summary || article.content.slice(0, 160),
    image: [article.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'],
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.created_at,
    inLanguage: 'ur',
    author: [
      {
        '@type': 'Person',
        name: article.author_name || article.source_name || 'نمائندہ دسترس',
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
    articleSection: article.category,
    articleBody: article.content,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-urdu-sans">
        {/* واپس جانے کا ربط */}
        <div className="flex items-center justify-between">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-portal-primary font-bold text-base transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>مضامین کی فہرست پر واپس جائیں</span>
          </Link>
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-portal-primary font-bold text-sm border border-emerald-200">
            {article.category}
          </span>
        </div>

        {/* عنوان اور میٹا معلومات */}
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-portal-slate leading-tight font-nastaleeq">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <User className="w-4 h-4 text-emerald-600" />
              <span>مصنف / ذریعہ: {article.author_name || article.source_name || 'نمائندہ دسترس'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{formatUrduDate(article.published_at || article.created_at)}</span>
            </div>
            {article.source_name && (
              <>
                <span>•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>مصدقہ خبر</span>
                </span>
              </>
            )}
          </div>
        </header>

        {/* نمایاں تصویر مع فال بیک اور اسکیلیٹن */}
        <OptimizedImage
          src={article.image_url}
          alt={article.title}
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          containerClassName="w-full h-72 sm:h-96 md:h-[450px] rounded-2xl shadow-lg border border-slate-200"
        />

        {/* خلاصہ (اگر موجود ہو) */}
        {article.summary && (
          <div className="p-6 rounded-2xl bg-amber-50/70 border-r-4 border-amber-600 text-portal-slate text-xl font-medium leading-loose">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>اہم خلاصہ و اہم نکات:</span>
            </div>
            <p className="font-nastaleeq">{article.summary}</p>
          </div>
        )}

        {/* مضمون کے اندر کا اشتہار (Google In-Article Ad) */}
        <AdSlot format="fluid" layoutKey="-6t+ed+2i-1n-4w" slotId="article-in-feed" />

        {/* مکمل تحریر کا مواد - باوقار نستعلیق پڑھنے کا انداز */}
        <div className="prose prose-lg max-w-none text-portal-slate text-xl sm:text-2xl leading-[2.5] space-y-6 pt-2 font-nastaleeq">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-justify">
              {paragraph}
            </p>
          ))}
        </div>

        {/* اصل ذریعہ کا ریفرنس اگر موجود ہو */}
        {article.source_url && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              یہ تحریر و خبر مصدقہ ذرائع سے قارئین کی سہولت کے لیے بروقت فراہم کی گئی ہے۔
            </span>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-portal-primary font-bold hover:underline whitespace-nowrap self-start sm:self-auto"
            >
              <span>اصل ذریعہ دیکھیں</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* شیئرنگ بار (Client Interactive) */}
        <ArticleShareActions title={article.title} url={articleUrl} />

        {/* متعلقہ مضامین */}
        {related.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-portal-primary" />
              <h3 className="text-2xl font-bold text-portal-slate font-nastaleeq">اسی زمرے سے مزید تحریریں</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
