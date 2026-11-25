'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper } from '@/lib/types';
import { getNewspapers } from '@/lib/supabaseClient';
import NewspaperCard from '@/components/NewspaperCard';
import { Newspaper as NewspaperIcon, Search, Globe } from 'lucide-react';

export default function NewspapersPage() {
  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [selectedLang, setSelectedLang] = useState<'تمام' | 'اردو' | 'انگریزی'>('تمام');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNewspapers();
        setNewspapers(data);
      } catch (err) {
        console.error('Failed to load newspapers:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = newspapers.filter((np) => {
    const matchesLang = selectedLang === 'تمام' || np.language === selectedLang;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      np.name.toLowerCase().includes(query) ||
      (np.description && np.description.toLowerCase().includes(query));
    return matchesLang && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* ہیڈر */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-portal-primary font-bold text-sm border border-emerald-200">
          <NewspaperIcon className="w-4 h-4" />
          <span>پاکستانی و بین الاقوامی صحافت</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-portal-slate">
          پاکستان کے نامور اخبارات و ای پیپرز
        </h1>
        <p className="text-lg text-slate-600">
          روزنامہ جنگ، ایکسپریس، نوائے وقت، دنیا، مشرق، ڈان اور دیگر قومی و علاقائی اخبارات کا براہ راست مطالعہ
        </p>
      </div>

      {/* کنٹرول پینل */}
      <div className="portal-card p-6 bg-white space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* سرچ بار */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="اخبار کا نام تلاش کریں..."
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 focus:border-portal-primary focus:outline-none text-lg"
            />
          </div>

          {/* زبان کا فلٹر */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-sm font-bold text-slate-500">زبان:</span>
            {(['تمام', 'اردو', 'انگریزی'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-4 py-2 rounded-xl text-base font-bold transition-all ${
                  selectedLang === lang
                    ? 'bg-portal-primary text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* اخبارات کی گرڈ */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xl">
          اخبارات لوڈ ہو رہے ہیں...
        </div>
      ) : filtered.length === 0 ? (
        <div className="portal-card bg-white p-12 text-center">
          <p className="text-xl font-bold text-slate-600">کوئی اخبار نہیں ملا۔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((newspaper) => (
            <NewspaperCard key={newspaper.id} newspaper={newspaper} />
          ))}
        </div>
      )}
    </div>
  );
}
