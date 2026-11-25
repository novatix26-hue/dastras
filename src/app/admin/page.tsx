'use client';

import React, { useState, useEffect } from 'react';
import { 
  Article, 
  DirectoryContact, 
  Admission, 
  Newspaper, 
  DirectoryCategory, 
  DirectoryRegion, 
  ArticleCategory 
} from '@/lib/types';
import { 
  getArticles, 
  updateArticleStatus, 
  getDirectoryContacts, 
  addDirectoryContact, 
  getAdmissions, 
  addAdmission, 
  getNewspapers,
  isSupabaseConfigured,
  supabase
} from '@/lib/supabaseClient';
import { useToast } from '@/components/Toast';
import { formatUrduDate } from '@/lib/utils';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  PhoneCall, 
  GraduationCap, 
  Newspaper as NewspaperIcon, 
  Plus, 
  Eye, 
  BarChart3,
  LogOut,
  Clock,
  Sparkles
} from 'lucide-react';

const DIRECTORY_CATEGORIES: DirectoryCategory[] = [
  'تھانے',
  'ہسپتال و ایمرجنسی',
  'یونیورسٹیز',
  'سرکاری دفاتر',
  'تعلیمی بورڈز',
];

const DIRECTORY_REGIONS: DirectoryRegion[] = [
  'آزاد کشمیر',
  'گلگت بلتستان',
  'پنجاب',
  'سندھ',
  'خیبر پختونخوا',
  'بلوچستان',
  'اسلام آباد',
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ڈیش بورڈ اسٹیٹس
  const [activeTab, setActiveTab] = useState<'pending' | 'directory' | 'admissions' | 'newspapers' | 'stats'>('pending');
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [contacts, setContacts] = useState<DirectoryContact[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // نئے ریکارڈز کے فارم اسٹیٹس
  const [newContact, setNewContact] = useState({
    title: '',
    category: 'تھانے' as DirectoryCategory,
    region: 'آزاد کشمیر' as DirectoryRegion,
    city: '',
    phone: '',
    alternate_phone: '',
    address: '',
    emergency: false,
  });

  const [newAdmission, setNewAdmission] = useState({
    title: '',
    university_name: '',
    degree_level: 'بی ایس و ایم ایس',
    deadline: '',
    apply_url: '',
    description: '',
  });

  const { showToast } = useToast();

  // ڈیٹا لوڈنگ
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [arts, conts, adms, nps] = await Promise.all([
        getArticles('all'),
        getDirectoryContacts(),
        getAdmissions(),
        getNewspapers(),
      ]);
      setAllArticles(arts);
      setContacts(conts);
      setAdmissions(adms);
      setNewspapers(nps);
    } catch (err) {
      console.error(err);
      showToast('ڈیٹا لوڈ کرنے میں دشواری ہوئی۔', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // ایڈمن لاگ ان
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });

        if (!error) {
          setIsAuthenticated(true);
          showToast('خوش آمدید! آپ بطور ایڈمن لاگ ان ہو چکے ہیں۔', 'success');
          return;
        }
      }

      // ڈیفالٹ یا ڈیمو ایڈمن پاس ورڈ برائے ٹیسٹنگ
      if (adminPassword === 'admin123' || adminPassword === 'دسترس' || adminEmail === 'admin@dastaras.pk') {
        setIsAuthenticated(true);
        showToast('خوش آمدید! آپ بطور ایڈمن لاگ ان ہو چکے ہیں۔', 'success');
      } else {
        showToast('ای میل یا پاس ورڈ درست نہیں ہے۔ (ڈیمو پن: admin123)', 'error');
      }
    } catch {
      showToast('لاگ ان کی توثیق نہیں ہو سکی۔', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // مضمون کی منظوری یا استرداد
  const handleArticleAction = async (id: string, status: 'approved' | 'rejected') => {
    const success = await updateArticleStatus(id, status);
    if (success) {
      showToast(
        status === 'approved' 
          ? 'مضمون منظور کر لیا گیا ہے اور اب پورٹل پر لائیو ہے!' 
          : 'مضمون مسترد کر دیا گیا ہے۔', 
        status === 'approved' ? 'success' : 'info'
      );
      setAllArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      setSelectedArticle(null);
    }
  };

  // نیا رابطہ شامل کریں
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.title || !newContact.city || !newContact.phone) {
      showToast('برائے مہربانی نام، شہر اور فون نمبر درج کریں!', 'error');
      return;
    }

    try {
      const added = await addDirectoryContact(newContact);
      setContacts([added, ...contacts]);
      showToast('نیا رابطہ نمبر کامیابی کے ساتھ شامل کر دیا گیا!', 'success');
      setNewContact({
        title: '',
        category: 'تھانے',
        region: 'آزاد کشمیر',
        city: '',
        phone: '',
        alternate_phone: '',
        address: '',
        emergency: false,
      });
    } catch {
      showToast('رابطہ شامل کرنے میں خرابی ہوئی۔', 'error');
    }
  };

  // نیا داخلہ اشتہار شامل کریں
  const handleAddAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmission.title || !newAdmission.university_name || !newAdmission.apply_url) {
      showToast('برائے مہربانی داخلہ کا عنوان، یونیورسٹی اور اپلائی لنک درج کریں!', 'error');
      return;
    }

    try {
      const added = await addAdmission({
        ...newAdmission,
        is_active: true,
      });
      setAdmissions([added, ...admissions]);
      showToast('نیا داخلہ اشتہار کامیابی کے ساتھ شائع کر دیا گیا!', 'success');
      setNewAdmission({
        title: '',
        university_name: '',
        degree_level: 'بی ایس و ایم ایس',
        deadline: '',
        apply_url: '',
        description: '',
      });
    } catch {
      showToast('داخلہ شامل کرنے میں خرابی ہوئی۔', 'error');
    }
  };

  const pendingArticles = allArticles.filter((a) => a.status === 'pending');
  const approvedArticles = allArticles.filter((a) => a.status === 'approved');

  // اگر لاگ ان نہ ہو تو خالص اردو لاگ ان اسکرین دکھائیں
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="portal-card p-8 bg-white shadow-xl border-2 border-portal-primary/30 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-portal-primary text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-portal-slate">ایڈمن پینل لاگ ان</h1>
            <p className="text-sm text-slate-500">
              دسترس پورٹل کے انتظامی امور کے لیے لاگ ان کریں
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-base font-bold text-portal-slate">
                ای میل ایڈریس
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@dastaras.pk"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-base font-bold text-portal-slate">
                پاس ورڈ یا پن کوڈ
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base tracking-widest"
                dir="ltr"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 leading-relaxed border border-slate-200">
              <span className="font-bold text-portal-primary">ڈیمو پاس ورڈ:</span> <code>admin123</code> (یا سپابیس پروجیکٹ کے کریڈینشلز)
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-portal-primary hover:bg-portal-primaryHover text-white font-extrabold text-lg shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-5 h-5" />
              <span>{loginLoading ? 'توثیق ہو رہی ہے...' : 'لاگ ان کریں'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ایڈمن ہیڈر */}
      <div className="portal-card p-6 bg-gradient-to-l from-slate-900 to-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-none shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-portal-primary flex items-center justify-center text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">دسترس ایڈمنسٹریشن کنٹرول روم</h1>
            <p className="text-sm text-emerald-200">
              عوامی مضامین کی منظوری، ڈائریکٹری اور داخلوں کا انتظام
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>لاگ آؤٹ</span>
        </button>
      </div>

      {/* نیویگیشن ٹیبز */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-all ${
            activeTab === 'pending'
              ? 'bg-portal-primary text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>زیر التواء مضامین ({pendingArticles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-all ${
            activeTab === 'directory'
              ? 'bg-portal-primary text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>رابطہ ڈائریکٹری کا اندراج</span>
        </button>

        <button
          onClick={() => setActiveTab('admissions')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-all ${
            activeTab === 'admissions'
              ? 'bg-portal-primary text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>داخلہ اشتہارات</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-all ${
            activeTab === 'stats'
              ? 'bg-portal-primary text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>پورٹل شماریات</span>
        </button>
      </div>

      {/* 1. زیر التواء مضامین کا ٹیب */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-portal-slate">
              منظوری کے منتظر مضامین ({pendingArticles.length})
            </h2>
            <span className="text-sm text-slate-500">
              شائع شدہ مضامین: <strong className="text-emerald-700">{approvedArticles.length}</strong>
            </span>
          </div>

          {pendingArticles.length === 0 ? (
            <div className="portal-card bg-white p-12 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-700">کوئی مضمون زیر التواء نہیں ہے</h3>
              <p className="text-slate-500 text-sm">
                تمام جمع شدہ تحریریں جانچی اور منظور کی جا چکی ہیں۔
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingArticles.map((art) => (
                <div
                  key={art.id}
                  className="portal-card p-6 bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        {art.category}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">مصنف: {art.author_name}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{formatUrduDate(art.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-portal-slate leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {art.summary || art.content.slice(0, 150)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>پڑھیں</span>
                    </button>
                    <button
                      onClick={() => handleArticleAction(art.id, 'approved')}
                      className="px-4 py-2 rounded-lg bg-portal-primary hover:bg-portal-primaryHover text-white font-bold text-sm flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>منظور کریں</span>
                    </button>
                    <button
                      onClick={() => handleArticleAction(art.id, 'rejected')}
                      className="px-3.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>مسترد کریں</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* مضمون مکمل پڑھنے کا ماڈل */}
          {selectedArticle && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 text-sm font-bold">
                    {selectedArticle.category}
                  </span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    بند کریں ✕
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-portal-slate">
                    {selectedArticle.title}
                  </h2>
                  <div className="text-sm text-slate-500 mt-2">
                    مصنف: {selectedArticle.author_name} • تاریخ: {formatUrduDate(selectedArticle.created_at)}
                  </div>
                </div>
                <div className="text-lg text-portal-slate leading-loose whitespace-pre-line border-t border-slate-100 pt-4 font-nastaleeq">
                  {selectedArticle.content}
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleArticleAction(selectedArticle.id, 'rejected')}
                    className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-base hover:bg-red-200"
                  >
                    مسترد کریں
                  </button>
                  <button
                    onClick={() => handleArticleAction(selectedArticle.id, 'approved')}
                    className="px-6 py-2 rounded-xl bg-portal-primary text-white font-bold text-base hover:bg-portal-primaryHover"
                  >
                    منظور کریں اور لائیو شائع کریں
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. رابطہ ڈائریکٹری فارم */}
      {activeTab === 'directory' && (
        <div className="portal-card p-6 sm:p-10 bg-white space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Plus className="w-5 h-5 text-portal-primary" />
            <h2 className="text-2xl font-bold text-portal-slate">
              نیا ادارہ یا ہیلپ لائن نمبر شامل کریں
            </h2>
          </div>

          <form onSubmit={handleAddContact} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  ادارے یا تھانے کا نام <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newContact.title}
                  onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                  placeholder="مثلاً: سنٹرل پولیس کنٹرول مظفرآباد"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  شعبہ / زمرہ <span className="text-red-500">*</span>
                </label>
                <select
                  value={newContact.category}
                  onChange={(e) => setNewContact({ ...newContact, category: e.target.value as DirectoryCategory })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base bg-white"
                >
                  {DIRECTORY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  خطہ <span className="text-red-500">*</span>
                </label>
                <select
                  value={newContact.region}
                  onChange={(e) => setNewContact({ ...newContact, region: e.target.value as DirectoryRegion })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base bg-white"
                >
                  {DIRECTORY_REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  شہر <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newContact.city}
                  onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
                  placeholder="مثلاً: مظفرآباد، میرپور، گلگت، لاہور..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  فون نمبر <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="05822-920000 یا 15"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  متبادل فون نمبر (اختیاری)
                </label>
                <input
                  type="text"
                  value={newContact.alternate_phone}
                  onChange={(e) => setNewContact({ ...newContact, alternate_phone: e.target.value })}
                  placeholder="متبادل نمبر درج کریں"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-base font-bold text-portal-slate">
                پتہ یا مقام
              </label>
              <input
                type="text"
                value={newContact.address}
                onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
                placeholder="کچہری روڈ، ضلعی ہیڈ کوارٹرز..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emergency-checkbox"
                checked={newContact.emergency}
                onChange={(e) => setNewContact({ ...newContact, emergency: e.target.checked })}
                className="w-5 h-5 text-portal-primary rounded"
              />
              <label htmlFor="emergency-checkbox" className="text-base font-bold text-slate-700">
                یہ ایک ہنگامی / ایمرجنسی نمبر ہے
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-portal-primary hover:bg-portal-primaryHover text-white font-bold text-lg shadow-md transition-all"
            >
              رابطہ محفوظ کریں
            </button>
          </form>
        </div>
      )}

      {/* 3. داخلہ اشتہار فارم */}
      {activeTab === 'admissions' && (
        <div className="portal-card p-6 sm:p-10 bg-white space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Plus className="w-5 h-5 text-portal-gold" />
            <h2 className="text-2xl font-bold text-portal-slate">
              نیا یونیورسٹی داخلہ اشتہار شامل کریں
            </h2>
          </div>

          <form onSubmit={handleAddAdmission} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  داخلہ اشتہار کا عنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAdmission.title}
                  onChange={(e) => setNewAdmission({ ...newAdmission, title: e.target.value })}
                  placeholder="مثلاً: بی ایس اور ایم ایس داخلے 2025"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  جامعہ (University) کا نام <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAdmission.university_name}
                  onChange={(e) => setNewAdmission({ ...newAdmission, university_name: e.target.value })}
                  placeholder="مثلاً: جامعہ کشمیر مظفرآباد"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  ڈگری کی سطح
                </label>
                <input
                  type="text"
                  value={newAdmission.degree_level}
                  onChange={(e) => setNewAdmission({ ...newAdmission, degree_level: e.target.value })}
                  placeholder="بی ایس، ایم فل، پی ایچ ڈی"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-portal-slate">
                  درخواست کی آخری تاریخ
                </label>
                <input
                  type="date"
                  value={newAdmission.deadline}
                  onChange={(e) => setNewAdmission({ ...newAdmission, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-base font-bold text-portal-slate">
                آن لائن اپلائی کا لنک <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={newAdmission.apply_url}
                onChange={(e) => setNewAdmission({ ...newAdmission, apply_url: e.target.value })}
                placeholder="https://university.edu.pk/admissions"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-base font-bold text-portal-slate">
                تفصیل / ضروری شرائط
              </label>
              <textarea
                rows={3}
                value={newAdmission.description}
                onChange={(e) => setNewAdmission({ ...newAdmission, description: e.target.value })}
                placeholder="نشستوں، انٹری ٹیسٹ اور کوٹہ کی مختصر تفصیل..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-portal-gold hover:bg-amber-600 text-white font-bold text-lg shadow-md transition-all"
            >
              داخلہ اشتہار شائع کریں
            </button>
          </form>
        </div>
      )}

      {/* 4. شماریات ٹیب */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="portal-card p-6 bg-white border-t-4 border-t-emerald-600">
            <span className="text-sm text-slate-500 font-bold">کل مضامین (منظور شدہ)</span>
            <div className="text-4xl font-extrabold text-emerald-700 mt-2">{approvedArticles.length}</div>
            <span className="text-xs text-slate-400 mt-1 block">زیر التواء: {pendingArticles.length}</span>
          </div>

          <div className="portal-card p-6 bg-white border-t-4 border-t-blue-600">
            <span className="text-sm text-slate-500 font-bold">رابطہ ڈائریکٹری نمبرز</span>
            <div className="text-4xl font-extrabold text-blue-700 mt-2">{contacts.length}</div>
            <span className="text-xs text-slate-400 mt-1 block">۷ خطے و صوبے</span>
          </div>

          <div className="portal-card p-6 bg-white border-t-4 border-t-amber-600">
            <span className="text-sm text-slate-500 font-bold">فعال داخلے</span>
            <div className="text-4xl font-extrabold text-amber-700 mt-2">{admissions.length}</div>
            <span className="text-xs text-slate-400 mt-1 block">خودکار فیڈ فعال</span>
          </div>

          <div className="portal-card p-6 bg-white border-t-4 border-t-purple-600">
            <span className="text-sm text-slate-500 font-bold">شامل کردہ اخبارات</span>
            <div className="text-4xl font-extrabold text-purple-700 mt-2">{newspapers.length}</div>
            <span className="text-xs text-slate-400 mt-1 block">اردو و انگریزی</span>
          </div>
        </div>
      )}
    </div>
  );
}
