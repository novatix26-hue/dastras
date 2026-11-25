'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Phone, BookOpen, GraduationCap, ArrowLeft, X } from 'lucide-react';
import { Article, DirectoryContact, University } from '@/lib/types';
import { getArticles, getDirectoryContacts, getUniversities } from '@/lib/supabaseClient';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allContacts, setAllContacts] = useState<DirectoryContact[]>([]);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [arts, contacts, unies] = await Promise.all([
          getArticles('approved'),
          getDirectoryContacts(),
          getUniversities(),
        ]);
        setAllArticles(arts);
        setAllContacts(contacts);
        setAllUniversities(unies);
      } catch (e) {
        console.error('Data load error:', e);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const filteredArticles = trimmed.length > 1
    ? allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmed) ||
          a.author_name.toLowerCase().includes(trimmed) ||
          a.category.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredContacts = trimmed.length > 1
    ? allContacts.filter(
        (c) =>
          c.title.toLowerCase().includes(trimmed) ||
          c.city.toLowerCase().includes(trimmed) ||
          c.region.toLowerCase().includes(trimmed) ||
          c.phone.includes(trimmed)
      ).slice(0, 4)
    : [];

  const filteredUniversities = trimmed.length > 1
    ? allUniversities.filter(
        (u) =>
          u.name.toLowerCase().includes(trimmed) ||
          u.city.toLowerCase().includes(trimmed) ||
          u.region.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const totalResults =
    filteredArticles.length + filteredContacts.length + filteredUniversities.length;

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={dropdownRef}>
      {/* سرچ ان پٹ باکس */}
      <div className="relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-portal-border hover:border-portal-primary focus-within:border-portal-primary focus-within:ring-4 focus-within:ring-portal-primary/10 transition-all duration-300">
        <div className="pr-5 pl-2 text-portal-primary">
          <Search className="w-7 h-7 stroke-[2.2]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="خبریں، تھانے، یونیورسٹیز یا کوئی بھی نمبر تلاش کریں..."
          className="w-full py-4 pl-12 pr-2 bg-transparent text-xl text-portal-slate placeholder-slate-400 focus:outline-none font-nastaleeq"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-4 p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
            title="صاف کریں"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* سرچ نتائج کا ڈراپ ڈاؤن */}
      {isOpen && query.trim().length > 1 && (
        <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 duration-200 max-h-[480px] overflow-y-auto">
          {totalResults === 0 ? (
            <div className="p-8 text-center text-slate-500 text-lg">
              کوئی نتیجہ نہیں ملا۔ برائے مہربانی کوئی دوسرا لفظ یا شہر تلاش کریں۔
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* رابطہ ڈائریکٹری نتائج */}
              {filteredContacts.length > 0 && (
                <div className="p-4 bg-slate-50/70">
                  <div className="flex items-center gap-2 text-sm font-bold text-portal-primary mb-2">
                    <Phone className="w-4 h-4" />
                    <span>رابطہ ڈائریکٹری و ایمرجنسی</span>
                  </div>
                  <div className="space-y-2">
                    {filteredContacts.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-portal-primary/50 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-portal-slate text-lg leading-tight">
                            {c.title}
                          </div>
                          <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <span>{c.region}</span>
                            <span>•</span>
                            <span>{c.city}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{c.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${c.phone}`}
                            className="flex items-center gap-1.5 bg-emerald-50 text-portal-primary hover:bg-portal-primary hover:text-white px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all border border-emerald-200"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{c.phone}</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* خبریں و مضامین نتائج */}
              {filteredArticles.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-portal-primary mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>خبریں و معلوماتی مضامین</span>
                  </div>
                  <div className="space-y-2">
                    {filteredArticles.map((a) => (
                      <Link
                        key={a.id}
                        href={`/articles/${a.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/50 transition-colors group"
                      >
                        <div>
                          <div className="font-bold text-portal-slate text-lg group-hover:text-portal-primary transition-colors">
                            {a.title}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            <span>{a.author_name}</span> • <span>{a.category}</span>
                          </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-portal-primary group-hover:-translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* جامعات نتائج */}
              {filteredUniversities.length > 0 && (
                <div className="p-4 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-sm font-bold text-portal-primary mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>جامعات (Universities)</span>
                  </div>
                  <div className="space-y-2">
                    {filteredUniversities.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200"
                      >
                        <div>
                          <div className="font-bold text-portal-slate text-lg">{u.name}</div>
                          <div className="text-sm text-slate-500 mt-0.5">
                            {u.region} • {u.city} • {u.sector}
                          </div>
                        </div>
                        <a
                          href={u.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-portal-primary hover:underline"
                        >
                          ویب سائٹ
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
