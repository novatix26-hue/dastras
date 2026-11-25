'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  PenTool, 
  BookOpen, 
  PhoneCall, 
  GraduationCap, 
  Newspaper as NewspaperIcon, 
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'ہوم پورٹل', icon: Compass },
    { href: '/articles', label: 'خبریں و مضامین', icon: BookOpen },
    { href: '/directory', label: 'رابطہ ڈائریکٹری', icon: PhoneCall },
    { href: '/admissions', label: 'جامعات و داخلے', icon: GraduationCap },
    { href: '/newspapers', label: 'قومی اخبارات', icon: NewspaperIcon },
    { href: '/admin', label: 'ایڈمن پینل', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-portal-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* لوگو اور برانڈ نیم */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-portal-primary to-portal-primaryHover flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl font-bold tracking-tight">د</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-portal-primary tracking-tight group-hover:text-portal-primaryHover transition-colors">
                  دسترس
                </span>
                <span className="text-xs text-portal-muted hidden sm:inline -mt-1">
                  معلومات، تعلیم اور رابطوں کا معتبر مرکز
                </span>
              </div>
            </Link>
          </div>

          {/* ڈیسک ٹاپ مینو لنکس */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-lg transition-all duration-200 ${
                    isActive
                      ? 'text-portal-primary font-bold bg-portal-primaryLight'
                      : 'text-portal-slate/85 hover:text-portal-primary hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ایکشن بٹنز */}
          <div className="flex items-center gap-3">
            <Link
              href="/submit"
              className="flex items-center gap-2 bg-portal-primary hover:bg-portal-primaryHover text-white px-5 py-2.5 rounded-xl font-bold text-lg shadow-sm hover:shadow transition-all duration-200 group active:scale-95"
            >
              <PenTool className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform duration-300" />
              <span>مضمون لکھیں</span>
            </Link>

            {/* موبائل مینو ٹوگل */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-portal-slate hover:bg-slate-100 transition-colors"
              aria-label="مینو کھولیں"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* موبائل دراز (Mobile Drawer) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-portal-border bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-portal-primaryLight text-portal-primary font-bold'
                      : 'text-portal-slate hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-portal-primary/80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <Link
                href="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-portal-primary text-white py-3 rounded-xl font-bold text-lg shadow-sm"
              >
                <PenTool className="w-5 h-5" />
                <span>مضمون جمع کروائیں</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
