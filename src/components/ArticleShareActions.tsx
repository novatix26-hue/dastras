'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface ArticleShareActionsProps {
  title: string;
  url: string;
}

export default function ArticleShareActions({ title, url }: ArticleShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`*${title}*\nدسترس پر مکمل تحریر پڑھیں:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const copyArticleLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('تحریر کا لنک کاپی ہو گیا ہے!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="portal-card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-slate-200">
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5 text-portal-primary" />
        <span className="text-lg font-bold text-portal-slate font-nastaleeq">تحریر کو دوستوں کے ساتھ شیئر کریں:</span>
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
  );
}
