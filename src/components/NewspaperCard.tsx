import React from 'react';
import { Newspaper } from '@/lib/types';
import { ExternalLink, BookOpen, Globe } from 'lucide-react';

interface NewspaperCardProps {
  newspaper: Newspaper;
}

export default function NewspaperCard({ newspaper }: NewspaperCardProps) {
  return (
    <div className="portal-card p-6 bg-white flex flex-col justify-between hover:border-portal-primary transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            newspaper.language === 'اردو' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {newspaper.language}
          </span>
          <span className="text-xs text-slate-400">{newspaper.category}</span>
        </div>

        <h3 className="text-2xl font-bold text-portal-slate mb-2">
          {newspaper.name}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {newspaper.description || 'پاکستان کا نمایاں اور معروف روزنامہ۔'}
        </p>
      </div>

      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={newspaper.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-portal-primary text-white text-sm font-bold hover:bg-portal-primaryHover transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>اخبار پڑھیں</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        {newspaper.epaper_url && (
          <a
            href={newspaper.epaper_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>ای پیپر</span>
          </a>
        )}
      </div>
    </div>
  );
}
