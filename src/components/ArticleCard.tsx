import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import { formatUrduDate } from '@/lib/utils';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const categoryColors: Record<string, string> = {
    'خبریں': 'bg-blue-100 text-blue-800 border-blue-200',
    'سائنسی معلومات': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'انٹرنیٹ و ٹیکنالوجی': 'bg-purple-100 text-purple-800 border-purple-200',
    'خصوصی مضامین': 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const badgeClass = categoryColors[article.category] || 'bg-slate-100 text-slate-800 border-slate-200';

  if (featured) {
    return (
      <div className="portal-card overflow-hidden group hover:border-portal-primary/60 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 bg-white">
        <div className="md:col-span-6 relative h-64 md:h-auto min-h-[260px] overflow-hidden bg-slate-100">
          <Image
            src={article.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute top-4 right-4 z-10">
            <span className={`px-3 py-1 rounded-lg text-sm font-bold border shadow-sm ${badgeClass}`}>
              {article.category}
            </span>
          </div>
        </div>
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                {article.author_name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {formatUrduDate(article.created_at)}
              </span>
            </div>
            <Link href={`/articles/${article.slug}`}>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-portal-slate group-hover:text-portal-primary transition-colors leading-relaxed">
                {article.title}
              </h2>
            </Link>
            <p className="text-slate-600 text-base sm:text-lg line-clamp-3 mt-3 leading-relaxed">
              {article.summary || article.content.slice(0, 150) + '...'}
            </p>
          </div>
          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Eye className="w-4 h-4" />
              {article.views} قارئین
            </span>
            <Link
              href={`/articles/${article.slug}`}
              className="inline-flex items-center gap-2 text-portal-primary font-bold hover:text-portal-primaryHover transition-colors group-hover:translate-x-[-4px] duration-200"
            >
              <span>مکمل تحریر پڑھیں</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-card overflow-hidden group hover:border-portal-primary/60 transition-all duration-300 flex flex-col bg-white h-full">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={article.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border shadow-sm ${badgeClass}`}>
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="line-clamp-1">{article.author_name}</span>
            <span>•</span>
            <span>{formatUrduDate(article.created_at)}</span>
          </div>
          <Link href={`/articles/${article.slug}`}>
            <h3 className="text-xl font-bold text-portal-slate group-hover:text-portal-primary transition-colors line-clamp-2 leading-relaxed">
              {article.title}
            </h3>
          </Link>
          <p className="text-slate-600 text-sm line-clamp-2 mt-2 leading-relaxed">
            {article.summary || article.content.slice(0, 100) + '...'}
          </p>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            {article.views}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className="text-portal-primary font-bold hover:underline flex items-center gap-1"
          >
            <span>پڑھیں</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
