'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getArticleBySlug, getArticles } from '@/lib/supabaseClient';
import { formatUrduDate } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import ArticleCard from '@/components/ArticleCard';
import { 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  ArrowRight, 
  Copy, 
  Check, 
  BookOpen, 
  Tag 
} from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const art = await getArticleBySlug(slug);
        setArticle(art);

        if (art) {
          const all = await getArticles('approved');
          const rel = all.filter((a) => a.id !== art.id && a.category === art.category).slice(0, 3);
          setRelated(rel);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareOnWhatsApp = () => {
    if (!article) return;
    const text = encodeURIComponent(`*${article.title}*\nپورٹل دسترس پر مکمل تحریر پڑھیں:\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    if (!article) return;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const copyArticleLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('تحریر کا لنک کاپی ہو گیا ہے!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-xl text-slate-500">
        تحریر لوڈ کی جا رہی ہے...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-800">مضمون دستیاب نہیں ہے</h1>
        <p className="text-slate-500">معذرت، مطلوبہ تحریر نہیں مل سکی یا حذف کر دی گئی ہے۔</p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-portal-primary text-white font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>تمام مضامین کی طرف واپس جائیں</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
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
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-portal-slate leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-base text-slate-500 pt-2 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <User className="w-5 h-5 text-emerald-600" />
            <span>مصنف: {article.author_name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>{formatUrduDate(article.created_at)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Eye className="w-5 h-5 text-emerald-600" />
            <span>{article.views} قارئین</span>
          </div>
        </div>
      </div>

      {/* نمایاں تصویر */}
      {article.image_url && (
        <div className="relative w-full h-72 sm:h-96 md:h-[450px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      {/* خلاصہ (اگر موجود ہو) */}
      {article.summary && (
        <div className="p-6 rounded-2xl bg-amber-50/70 border-r-4 border-portal-gold text-portal-slate text-xl font-medium leading-loose">
          <p className="italic">{article.summary}</p>
        </div>
      )}

      {/* مکمل تحریر کا مواد - باوقار نستعلیق پڑھنے کا انداز */}
      <div className="prose prose-lg max-w-none text-portal-slate text-xl sm:text-2xl leading-[2.5] space-y-6 pt-2 font-nastaleeq">
        {article.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-justify">
            {paragraph}
          </p>
        ))}
      </div>

      {/* شیئرنگ بار */}
      <div className="portal-card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-portal-border">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-portal-primary" />
          <span className="text-lg font-bold text-portal-slate">تحریر کو دوستوں کے ساتھ شیئر کریں:</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors shadow-sm"
          >
            <span>واٹس ایپ پر شیئر کریں</span>
          </button>
          <button
            onClick={shareOnFacebook}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors shadow-sm"
          >
            <span>فیس بک</span>
          </button>
          <button
            onClick={copyArticleLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">کاپی ہو گیا</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>لنک کاپی کریں</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* متعلقہ مضامین */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-portal-primary" />
            <h3 className="text-2xl font-bold text-portal-slate">اسی زمرے سے مزید تحریریں</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
