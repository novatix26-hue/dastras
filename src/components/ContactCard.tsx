'use client';

import React, { useState } from 'react';
import { Phone, Copy, Check, MapPin, AlertTriangle } from 'lucide-react';
import { DirectoryContact } from '@/lib/types';
import { useToast } from './Toast';

interface ContactCardProps {
  contact: DirectoryContact;
}

export default function ContactCard({ contact }: ContactCardProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.phone);
    setCopied(true);
    showToast(`نمبر کاپی ہو گیا: ${contact.phone}`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`portal-card p-5 bg-white relative flex flex-col justify-between ${
      contact.emergency ? 'border-r-4 border-r-red-500' : 'border-r-4 border-r-portal-primary'
    }`}>
      <div>
        {/* بیجز اور مقام */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            {contact.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-portal-primary" />
            <span>{contact.region}</span> • <span>{contact.city}</span>
          </div>
        </div>

        {/* عنوان */}
        <h3 className="text-xl font-bold text-portal-slate leading-snug">
          {contact.title}
        </h3>

        {/* پتہ (اگر موجود ہو) */}
        {contact.address && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {contact.address}
          </p>
        )}
      </div>

      {/* فون نمبر اور ایکشن بٹنز */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400">فون نمبر</span>
          <span className="text-lg font-bold text-portal-slate tracking-wide" dir="ltr">
            {contact.phone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* نمبر کاپی بٹن */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
            title="نمبر کاپی کریں"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">کاپی ہو گیا</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>کاپی کریں</span>
              </>
            )}
          </button>

          {/* کال بٹن */}
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-portal-primary hover:bg-portal-primaryHover text-white text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>کال کریں</span>
          </a>
        </div>
      </div>
    </div>
  );
}
