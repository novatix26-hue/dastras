'use client';

import React, { useState, useEffect } from 'react';
import { Admission, University, DirectoryRegion } from '@/lib/types';
import { getAdmissions, getUniversities } from '@/lib/supabaseClient';
import AdmissionCard from '@/components/AdmissionCard';
import { useToast } from '@/components/Toast';
import { 
  GraduationCap, 
  RefreshCw, 
  Calendar, 
  ExternalLink, 
  Building, 
  MapPin, 
  Search,
  Sparkles,
  BookOpen
} from 'lucide-react';

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

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [activeTab, setActiveTab] = useState<'admissions' | 'universities'>('admissions');
  const [selectedRegion, setSelectedRegion] = useState<'تمام خطے' | DirectoryRegion>('تمام خطے');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [adms, unies] = await Promise.all([
          getAdmissions(),
          getUniversities(),
        ]);
        setAdmissions(adms);
        setUniversities(unies);
      } catch (err) {
        console.error('Failed to load admissions/universities:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admissions/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('خودکار فیڈ سے داخلے کامیابی کے ساتھ اپ ڈیٹ ہو گئے!', 'success');
        const fresh = await getAdmissions();
        setAdmissions(fresh);
      } else {
        showToast('فیڈ سنک کرنے میں دشواری پیش آئی۔', 'error');
      }
    } catch {
      showToast('سرور سے رابطہ نہ ہو سکا۔', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const filteredAdmissions = admissions.filter((adm) => {
    const query = searchQuery.trim().toLowerCase();
    return (
      !query ||
      adm.title.toLowerCase().includes(query) ||
      adm.university_name.toLowerCase().includes(query) ||
      adm.degree_level.toLowerCase().includes(query)
    );
  });

  const filteredUniversities = universities.filter((u) => {
    const matchesRegion = selectedRegion === 'تمام خطے' || u.region === selectedRegion;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.city.toLowerCase().includes(query);
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* ہیڈر اور ٹائٹل */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-portal-gold font-bold text-sm border border-amber-200">
          <GraduationCap className="w-4 h-4" />
          <span>اعلیٰ تعلیمی و داخلہ ڈائریکٹری</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-portal-slate">
          جامعات اور خودکار داخلہ اشتہارات
        </h1>
        <p className="text-lg text-slate-600">
          پاکستان اور آزاد جموں و کشمیر کی تمام بڑی سرکاری و نجی جامعات اور تازہ ترین داخلوں کی معلومات
        </p>
      </div>

      {/* ٹیبز سوئچر اور خودکار سنک بٹن */}
      <div className="portal-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* ٹیبز */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('admissions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-lg font-bold transition-all ${
              activeTab === 'admissions'
                ? 'bg-portal-gold text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>تازہ ترین داخلے ({admissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('universities')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-lg font-bold transition-all ${
              activeTab === 'universities'
                ? 'bg-portal-primary text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building className="w-5 h-5" />
            <span>جامعات کی فہرست ({universities.length})</span>
          </button>
        </div>

        {/* خودکار سنک ایکشن بٹن */}
        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-portal-primary/40 text-portal-primary hover:bg-emerald-50 text-base font-bold transition-colors disabled:opacity-50 self-start md:self-auto"
          title="ورسل کرون کے ذریعے آر ایس ایس فیڈز کو ابھی سنک کریں"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'سنک ہو رہا ہے...' : 'فیڈز خودکار سنک کریں'}</span>
        </button>
      </div>

      {/* کنٹرول بار: سرچ اور ریجن فلٹر */}
      <div className="portal-card p-6 bg-white space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'admissions'
                ? 'داخلہ عنوان یا یونیورسٹی کا نام تلاش کریں...'
                : 'یونیورسٹی کا نام یا شہر تلاش کریں...'
            }
            className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 focus:border-portal-primary focus:outline-none text-lg"
          />
        </div>

        {activeTab === 'universities' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
            <span className="text-sm font-bold text-slate-500 whitespace-nowrap">خطہ:</span>
            {REGIONS.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  selectedRegion === reg
                    ? 'bg-portal-primary text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* مواد کی نمائش */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xl">
          ڈیٹا لوڈ کیا جا رہا ہے...
        </div>
      ) : activeTab === 'admissions' ? (
        /* داخلہ اشتہارات کی گرڈ */
        filteredAdmissions.length === 0 ? (
          <div className="portal-card bg-white p-12 text-center">
            <p className="text-xl font-bold text-slate-600">کوئی داخلہ اشتہار نہیں ملا۔</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdmissions.map((adm) => (
              <AdmissionCard key={adm.id} admission={adm} />
            ))}
          </div>
        )
      ) : (
        /* جامعات کی گرڈ */
        filteredUniversities.length === 0 ? (
          <div className="portal-card bg-white p-12 text-center">
            <p className="text-xl font-bold text-slate-600">کوئی جامعہ نہیں ملی۔</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => (
              <div
                key={uni.id}
                className="portal-card p-6 bg-white flex flex-col justify-between hover:border-portal-primary transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      {uni.sector}
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-portal-primary" />
                      <span>{uni.region} • {uni.city}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-portal-slate leading-snug mb-2">
                    {uni.name}
                  </h3>

                  {uni.established_year && (
                    <p className="text-xs text-slate-400 mb-3">
                      سال قیام: {uni.established_year}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={uni.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-portal-primary hover:bg-portal-primaryHover text-white text-sm font-bold transition-colors"
                  >
                    <span>ویب سائٹ دیکھیں</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {uni.admissions_url && (
                    <a
                      href={uni.admissions_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-portal-gold hover:underline"
                    >
                      داخلہ پورٹل
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
