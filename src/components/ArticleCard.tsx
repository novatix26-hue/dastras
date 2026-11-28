import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { formatUrduDate } from '@/lib/utils';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const categoryColors: Record<string, string> = {
    'خبریں': 'bg-blue-100 text-blue-800 border-blue-200',
    'pakistan': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'azad-kashmir': 'bg-teal-100 text-teal-800 border-teal-200',
    'international': 'bg-sky-100 text-sky-800 border-sky-200',
    'sports': 'bg-amber-100 text-amber-800 border-amber-200',
    'business': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'health': 'bg-rose-100 text-rose-800 border-rose-200',
    'technology': 'bg-purple-100 text-purple-800 border-purple-200',
    'سائنسی معلومات': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'انٹرنیٹ و ٹیکنالوجی': 'bg-purple-100 text-purple-800 border-purple-200',
    'خصوصی مضامین': 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const badgeClass = categoryColors[article.category] || 'bg-slate-100 text-slate-800 border-slate-200';

  if (featured) {
    return (
      <div className="portal-card overflow-hidden group hover:border-portal-primary/60 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md">
        <div className="md:col-span-6 relative aspect-video md:aspect-auto md:min-h-[280px] overflow-hidden bg-slate-100">
          <OptimizedImage
            src={article.image_url}
            alt={article.title}
            fill
            className="group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            containerClassName="w-full h-full"
          />
          <div className="absolute top-4 right-4 z-10">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold border shadow-sm ${badgeClass}`}>
              {article.category}
            </span>
          </div>
        </div>
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <User className="w-4 h-4 text-emerald-600" />
                {article.author_name || article.source_name || 'نمائندہ دسترس'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {formatUrduDate(article.published_at || article.created_at)}
              </span>
            </div>
            <Link href={`/articles/${article.slug}`}>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-portal-slate group-hover:text-portal-primary transition-colors leading-[1.8] font-nastaleeq">
                {article.title}
              </h2>
            </Link>
            <p className="text-slate-600 text-sm sm:text-base line-clamp-3 mt-3 leading-relaxed">
              {article.summary || article.content.slice(0, 150) + '...'}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Eye className="w-4 h-4" />
              {article.views || 100}+ قارئین
            </span>
            <Link
              href={`/articles/${article.slug}`}
              className="inline-flex items-center gap-2 text-portal-primary font-bold hover:text-portal-primaryHover transition-colors group-hover:translate-x-[-4px] duration-200 text-sm"
            >
              <span>مکمل تحریر پڑھیں</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-card overflow-hidden group hover:border-portal-primary/60 transition-all duration-300 flex flex-col bg-white h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <OptimizedImage
          src={article.image_url}
          alt={article.title}
          fill
          className="group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
          containerClassName="w-full h-full"
        />
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border shadow-sm ${badgeClass}`}>
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="line-clamp-1 font-semibold">{article.author_name || article.source_name || 'دسترس'}</span>
            <span>•</span>
            <span>{formatUrduDate(article.published_at || article.created_at)}</span>
          </div>
          <Link href={`/articles/${article.slug}`}>
            <h3 className="text-lg sm:text-xl font-bold text-portal-slate group-hover:text-portal-primary transition-colors line-clamp-2 leading-[1.8] font-nastaleeq">
              {article.title}
            </h3>
          </Link>
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed">
            {article.summary || article.content.slice(0, 100) + '...'}
          </p>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            {article.views || 50}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className="text-portal-primary font-bold hover:underline flex items-center gap-1 text-xs sm:text-sm"
          >
            <span>پڑھیں</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
