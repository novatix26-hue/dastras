'use client';

import React, { useState, useEffect } from 'react';
import { Article, ArticleCategory } from '@/lib/types';
import { getArticles } from '@/lib/supabaseClient';
import ArticleCard from '@/components/ArticleCard';
import { BookOpen, Search, Filter } from 'lucide-react';

const CATEGORIES: ('تمام' | ArticleCategory)[] = [
  'تمام',
  'خبریں',
  'سائنسی معلومات',
  'انٹرنیٹ و ٹیکنالوجی',
  'خصوصی مضامین',
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'تمام' | ArticleCategory>('تمام');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getArticles('approved');
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = articles.filter((a) => {
    const matchesCategory = selectedCategory === 'تمام' || a.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      a.title.toLowerCase().includes(query) ||
      a.author_name.toLowerCase().includes(query) ||
      (a.summary && a.summary.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* ہیڈر اور عنوان */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 text-portal-primary font-bold text-sm border border-emerald-200">
          <BookOpen className="w-4 h-4" />
          <span>علمی و فکری مرکز</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-portal-slate">
          خبریں، سائنس اور خصوصی مضامین
        </h1>
        <p className="text-lg text-slate-600">
          پاکستان، کشمیر اور دنیا بھر سے مصدقہ سائنسی، تکنیکی اور تجزیاتی تحریروں کا مستند ذخیرہ
        </p>
      </div>

      {/* فلٹرز اور سرچ بار */}
      <div className="portal-card p-6 bg-white space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* سرچ ان پٹ */}
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="مضمون کا عنوان یا مصنف کا نام تلاش کریں..."
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 focus:border-portal-primary focus:outline-none text-lg text-portal-slate placeholder:text-slate-400"
            />
          </div>

          {/* کل تعداد */}
          <div className="text-sm font-semibold text-slate-500 self-center">
            دستیاب مضامین: <span className="font-bold text-portal-primary text-base">{filtered.length}</span>
          </div>
        </div>

        {/* کیٹیگری ٹیبز */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-slate-400 text-sm ml-2 flex items-center gap-1 font-semibold flex-shrink-0">
            <Filter className="w-4 h-4" />
            کیٹیگری:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-base font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-portal-primary text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* مضامین کی فہرست */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xl">
          مضامین لوڈ ہو رہے ہیں...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center portal-card bg-white p-8">
          <p className="text-xl font-bold text-slate-600">کوئی مضمون نہیں ملا۔</p>
          <p className="text-slate-400 mt-2">براہ کرم کوئی دوسرا لفظ تلاش کریں یا کیٹیگری تبدیل کریں۔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
