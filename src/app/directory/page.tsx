'use client';

import React, { useState, useEffect } from 'react';
import { DirectoryContact, DirectoryRegion, DirectoryCategory } from '@/lib/types';
import { getDirectoryContacts } from '@/lib/supabaseClient';
import ContactCard from '@/components/ContactCard';
import { PhoneCall, Search, MapPin, Building, ShieldAlert } from 'lucide-react';

const REGIONS: ('تمام خطے' | DirectoryRegion)[] = [
  'تمام خطے',
  'آزاد کشمیر',
  'گلگت بلتستان',
  'پنجاب',
  'سندھ',
  'خیبر پختونخوا',
  'بلوچستان',
  'اسلام آباد',
];

const CATEGORIES: ('تمام زمرے' | DirectoryCategory)[] = [
  'تمام زمرے',
  'تھانے',
  'ہسپتال و ایمرجنسی',
  'یونیورسٹیز',
  'سرکاری دفاتر',
  'تعلیمی بورڈز',
];

export default function DirectoryPage() {
  const [contacts, setContacts] = useState<DirectoryContact[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<'تمام خطے' | DirectoryRegion>('تمام خطے');
  const [selectedCategory, setSelectedCategory] = useState<'تمام زمرے' | DirectoryCategory>('تمام زمرے');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDirectoryContacts();
        setContacts(data);
      } catch (err) {
        console.error('Failed to load contacts:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = contacts.filter((c) => {
    const matchesRegion = selectedRegion === 'تمام خطے' || c.region === selectedRegion;
    const matchesCategory = selectedCategory === 'تمام زمرے' || c.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      c.title.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.address && c.address.toLowerCase().includes(query));
    return matchesRegion && matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* ہیڈر تعارف */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-portal-primary font-bold text-sm border border-emerald-200">
          <PhoneCall className="w-4 h-4" />
          <span>پاکستان اور کشمیر اسمارٹ ڈائریکٹری</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-portal-slate">
          سرکاری دفاتر، تھانے، ہسپتال اور تعلیمی بورڈز
        </h1>
        <p className="text-lg text-slate-600">
          آزاد کشمیر، گلگت بلتستان، اسلام آباد اور تمام صوبوں کے مستند ٹیلی فون نمبرز اور پتے
        </p>
      </div>

      {/* کنٹرول پینل: سرچ اور فلٹرز */}
      <div className="portal-card p-6 bg-white space-y-6">
        {/* سرچ بار */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ادارے کا نام، شہر، یا فون نمبر درج کریں (مثلاً: مظفرآباد، پمز، ریسکیو)..."
            className="w-full pr-12 pl-4 py-3.5 rounded-xl border border-slate-200 focus:border-portal-primary focus:outline-none text-xl text-portal-slate placeholder:text-slate-400"
          />
        </div>

        {/* خطوں کے فلٹرز (Regions) */}
        <div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 mb-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>خطہ منتخب کریں:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-base font-bold whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'bg-portal-primary text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* زمروں کے فلٹرز (Categories) */}
        <div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 mb-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>شعبہ / زمرہ منتخب کریں:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-base font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-portal-gold text-white shadow-md'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* نتائج کی تعداد */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-semibold">
          <span>
            کل رابطے: <strong className="text-portal-primary text-base">{filtered.length}</strong>
          </span>
          {(selectedRegion !== 'تمام خطے' || selectedCategory !== 'تمام زمرے' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRegion('تمام خطے');
                setSelectedCategory('تمام زمرے');
                setSearchQuery('');
              }}
              className="text-red-600 hover:underline font-bold"
            >
              تمام فلٹرز ختم کریں
            </button>
          )}
        </div>
      </div>

      {/* رابطوں کی گرڈ */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xl">
          ڈائریکٹری لوڈ ہو رہی ہے...
        </div>
      ) : filtered.length === 0 ? (
        <div className="portal-card bg-white p-12 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">کوئی رابطہ نمبر نہیں ملا</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            مطلوبہ سرچ اور فلٹرز سے ملتا جلتا کوئی ریکارڈ موجود نہیں۔ برائے مہربانی فلٹر تبدیل کریں۔
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}
