'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Search, 
  Smartphone, 
  CloudSun, 
  Clock, 
  TrendingUp, 
  Flame, 
  HeartPulse, 
  Laptop, 
  Trophy, 
  Globe2, 
  MapPin, 
  Building2,
  PenTool,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mainCategories = [
    { href: '/', label: 'ہوم' },
    { href: '/category/pakistan', label: 'پاکستان', badge: 'اہم' },
    { href: '/category/azad-kashmir', label: 'آزاد کشمیر', badge: 'خصوصی' },
    { href: '/category/international', label: 'عالمی' },
    { href: '/category/sports', label: 'کھیل' },
    { href: '/category/health', label: 'صحت' },
    { href: '/category/technology', label: 'ٹیکنالوجی' },
    { href: '/mobiles', label: 'موبائل ریٹس', icon: Smartphone, highlight: true },
    { href: '/weather', label: 'موسم', icon: CloudSun },
    { href: '/prayer-times', label: 'نماز کے اوقات', icon: Clock },
    { href: '/category/business', label: 'کاروبار', icon: TrendingUp },
  ];

  const secondaryLinks = [
    { href: '/directory', label: 'رابطہ ڈائریکٹری' },
    { href: '/admissions', label: 'داخلے و جامعات' },
    { href: '/newspapers', label: 'قومی اخبارات' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* 1. مین برانڈنگ ہیڈر */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* لوگو اور اردو پوائنٹ اسٹائل نام */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
              <span className="text-3xl font-bold font-nastaleeq">د</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tracking-tight font-nastaleeq group-hover:text-emerald-700 transition-colors">
                دسترس پورٹل
              </span>
              <span className="text-xs text-slate-500 font-urdu-sans hidden sm:inline -mt-1 font-semibold">
                پاکستان و آزاد کشمیر کا خودکار نیوز و معلوماتی پورٹل
              </span>
            </div>
          </Link>

          {/* سرچ اور مضمون لکھیں ایکشن */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/currency-rates"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-urdu-sans transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>کرنسی کنورٹر</span>
            </Link>

            <Link
              href="/submit"
              className="hidden sm:flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl font-bold text-sm font-urdu-sans shadow-sm transition-all duration-200 group active:scale-95"
            >
              <PenTool className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
              <span>مضمون بھیجیں</span>
            </Link>

            {/* موبائل مینو ٹوگل */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="مینو کھولیں"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. اردو پوائنٹ اسٹائل کیٹیگری نیویگیشن بار */}
      <nav className="hidden xl:block bg-emerald-900 text-white font-urdu-sans border-t border-emerald-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-wrap gap-1 py-1">
              {mainCategories.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-bold transition-all duration-150 rounded-lg relative ${
                      isActive
                        ? 'bg-emerald-800 text-yellow-300 shadow-sm'
                        : item.highlight
                        ? 'text-yellow-300 hover:bg-emerald-800'
                        : 'text-slate-100 hover:bg-emerald-800/80 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* سیکنڈری ڈراپ ڈاؤن / لنکس */}
            <div className="flex items-center gap-2">
              <Link
                href="/directory"
                className="text-xs font-semibold text-emerald-200 hover:text-white px-2 py-1"
              >
                ڈائریکٹری
              </Link>
              <span className="text-emerald-700">|</span>
              <Link
                href="/admissions"
                className="text-xs font-semibold text-emerald-200 hover:text-white px-2 py-1"
              >
                داخلے
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* موبائل دراز (Mobile Drawer) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-4 duration-200 font-urdu-sans max-h-[85vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 px-3 py-1">اہم زمرہ جات</div>
              <div className="grid grid-cols-2 gap-1.5">
                {mainCategories.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-900 font-bold'
                          : item.highlight
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="text-xs font-bold text-slate-400 px-3 py-1">پورٹل خدمات</div>
              <div className="flex flex-col gap-1">
                {secondaryLinks.map((sec) => (
                  <Link
                    key={sec.href}
                    href={sec.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    {sec.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-sm"
              >
                <PenTool className="w-4 h-4" />
                <span>مضمون جمع کروائیں</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
