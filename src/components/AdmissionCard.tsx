import React from 'react';
import { Admission } from '@/lib/types';
import { formatUrduDate } from '@/lib/utils';
import { GraduationCap, Calendar, ExternalLink, Clock } from 'lucide-react';

interface AdmissionCardProps {
  admission: Admission;
}

export default function AdmissionCard({ admission }: AdmissionCardProps) {
  // تاریخ کی میعاد چیک کریں
  const isExpiringSoon = admission.deadline ? (
    new Date(admission.deadline).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 7
  ) : false;

  return (
    <div className="portal-card p-6 bg-white flex flex-col justify-between hover:border-portal-gold transition-all duration-300 border-t-4 border-t-portal-gold">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-3 py-1 rounded-md bg-amber-50 text-portal-gold font-bold text-xs border border-amber-200">
            {admission.degree_level}
          </span>
          {admission.deadline && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
              isExpiringSoon ? 'bg-red-50 text-red-600' : 'text-slate-500'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>آخری تاریخ: {formatUrduDate(admission.deadline)}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-portal-slate leading-snug mb-2">
          {admission.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-portal-primary mb-3">
          <GraduationCap className="w-4 h-4 flex-shrink-0" />
          <span>{admission.university_name}</span>
        </div>

        {admission.description && (
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {admission.description}
          </p>
        )}
      </div>

      <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">آن لائن پورٹل</span>
        <a
          href={admission.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-portal-gold text-white text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm"
        >
          <span>آن لائن اپلائی کریں</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
