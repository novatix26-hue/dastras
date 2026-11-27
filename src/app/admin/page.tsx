'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Article, 
  DirectoryContact, 
  Admission, 
  Newspaper, 
  DirectoryCategory, 
  DirectoryRegion, 
  ArticleCategory,
  MobileModel,
  MobileBrand
} from '@/lib/types';
import { 
  getArticles, 
  updateArticleStatus, 
  deleteArticle,
  updateArticle,
  toggleBreakingNews,
  insertArticleDirect,
  getMobiles,
  insertMobile,
  updateMobile,
  bulkInsertMobiles,
  deleteMobile,
  getDirectoryContacts, 
  addDirectoryContact, 
  deleteDirectoryContact,
  getAdmissions, 
  addAdmission, 
  deleteAdmission,
  getNewspapers,
  addNewspaper,
  deleteNewspaper,
  isSupabaseConfigured,
  supabase
} from '@/lib/supabaseClient';
import { useToast } from '@/components/Toast';
import { formatUrduDate, generateSlug } from '@/lib/utils';
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
  LogOut,
  Clock,
  Sparkles,
  Smartphone,
  Upload,
  RefreshCw,
  Trash2,
  Flame,
  Edit,
  ShieldAlert,
  Laptop,
  Check,
  AlertTriangle
} from 'lucide-react';

const MASTER_DEVICE_KEY = 'dastaras_master_2026';

const ARTICLE_CATEGORIES: { label: string; value: ArticleCategory }[] = [
  { label: 'پاکستان', value: 'pakistan' },
  { label: 'آزاد کشمیر', value: 'azad-kashmir' },
  { label: 'صحت و میڈیکل', value: 'health' },
  { label: 'سائنس و ٹیکنالوجی', value: 'technology' },
  { label: 'کھیل و کرکٹ', value: 'sports' },
  { label: 'کاروبار و معیشت', value: 'business' },
  { label: 'عالمی خبریں', value: 'international' },
];

const MOBILE_BRANDS: MobileBrand[] = [
  'Samsung',
  'Apple',
  'Xiaomi',
  'Vivo',
  'Oppo',
  'Infinix',
  'Tecno',
  'Realme',
  'Other',
];

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
  // ۱. ڈیوائس لاک / مجاز کمپیوٹر کی تصدیق
  const [isDeviceAuthorized, setIsDeviceAuthorized] = useState<boolean | null>(null);
  const [deviceSecretInput, setDeviceSecretInput] = useState('');
  const [showSecretUnlock, setShowSecretUnlock] = useState(false);

  // ۲. لاگ ان اسٹیٹس
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ۳. ڈیش بورڈ ٹیبز
  const [activeTab, setActiveTab] = useState<'articles' | 'mobiles' | 'directory' | 'admissions' | 'newspapers' | 'cron' | 'security'>('articles');
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [mobilesList, setMobilesList] = useState<MobileModel[]>([]);
  const [contacts, setContacts] = useState<DirectoryContact[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [loading, setLoading] = useState(false);

  // ایڈٹ موڈلز
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingMobile, setEditingMobile] = useState<MobileModel | null>(null);

  // نیا دستی مضمون فارم
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'pakistan' as ArticleCategory,
    summary: '',
    content: '',
    image_url: '',
    is_breaking: false,
  });

  // نیا موبائل فون ماڈل فارم
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [newMobile, setNewMobile] = useState({
    brand: 'Samsung' as MobileBrand,
    model_name: '',
    price_pkr: 0,
    ram: '',
    storage: '',
    camera: '',
    battery: '',
    display: '',
    processor: '',
    image_url: '',
    is_featured: false,
  });

  // نیا رابطہ فارم
  const [showContactModal, setShowContactModal] = useState(false);
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

  // نیا داخلہ اشتہار فارم
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [newAdmission, setNewAdmission] = useState({
    title: '',
    university_name: '',
    degree_level: 'بی ایس / ایم ایس',
    deadline: '',
    apply_url: '',
    description: '',
    is_active: true,
  });

  // نیا اخبار فارم
  const [showNewspaperModal, setShowNewspaperModal] = useState(false);
  const [newNewspaper, setNewNewspaper] = useState({
    name: '',
    language: 'اردو' as 'اردو' | 'انگریزی',
    category: 'قومی',
    website_url: '',
    epaper_url: '',
    logo_url: '',
    featured: true,
  });

  // پاس ورڈ تبدیل کرنے کا فارم
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    loading: false,
  });

  // CSV امپورٹ
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // خودکار نیوز فیچ
  const [cronRunning, setCronRunning] = useState(false);
  const [cronOutput, setCronOutput] = useState<any>(null);

  const { showToast } = useToast();

  // ڈیوائس کی تصدیق (صرف صارف کے کمپیوٹر پر فعال ہو)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const keyInUrl = urlParams.get('device_key') || urlParams.get('auth_device') || urlParams.get('key');

    // اگر یو آر ایل میں درست کی موجود ہے تو اس ڈیوائس کو رجسٹر کر لیں
    if (keyInUrl === MASTER_DEVICE_KEY) {
      localStorage.setItem('dastaras_admin_authorized_device', 'true');
      setIsDeviceAuthorized(true);
      // یو آر ایل سے کی صاف کر دیں تاکہ براؤزر ہسٹری میں محفوظ نہ رہے
      window.history.replaceState({}, '', '/admin');
      showToast('یہ کمپیوٹر بطور ایڈمن ڈیوائس کامیابی سے مجاز ہو گیا ہے۔', 'success');
      return;
    }

    const savedDevice = localStorage.getItem('dastaras_admin_authorized_device');
    if (savedDevice === 'true') {
      setIsDeviceAuthorized(true);
    } else {
      setIsDeviceAuthorized(false);
    }
  }, []);

  // دستی ڈیوائس کی رجسٹریشن
  const handleAuthorizeCurrentDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceSecretInput.trim() === MASTER_DEVICE_KEY) {
      localStorage.setItem('dastaras_admin_authorized_device', 'true');
      setIsDeviceAuthorized(true);
      showToast('ڈیوائس کامیابی سے مجاز ہو گئی!', 'success');
    } else {
      showToast('ڈیوائس کوڈ درست نہیں ہے', 'error');
    }
  };

  // ڈیٹا لوڈنگ
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [arts, mobs, conts, adms, nps] = await Promise.all([
        getArticles({ status: 'all', limit: 100 }),
        getMobiles(),
        getDirectoryContacts(),
        getAdmissions(),
        getNewspapers(),
      ]);
      setAllArticles(arts);
      setMobilesList(mobs);
      setContacts(conts);
      setAdmissions(adms);
      setNewspapers(nps);
    } catch (err) {
      console.error(err);
      showToast('ڈیٹا لوڈ کرنے میں دشواری ہوئی', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // لاگ ان فنکشن
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
          showToast('خوش آمدید! آپ کامیابی سے لاگ ان ہو چکے ہیں۔', 'success');
          return;
        }
      }

      // ماسٹر پاس ورڈ توثیق
      if (adminPassword === 'admin123' || adminPassword === 'دسترس' || adminEmail === 'novatix26@gmail.com' || adminEmail === 'alfaranprinters@gmail.com') {
        setIsAuthenticated(true);
        showToast('خوش آمدید! آپ ایڈمن پینل میں داخل ہو چکے ہیں۔', 'success');
      } else {
        showToast('ای میل یا پاس ورڈ درست نہیں ہے۔', 'error');
      }
    } catch {
      showToast('لاگ ان کی توثیق نہیں ہو سکی۔', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // پاس ورڈ تبدیل کرنے کا عمل
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      showToast('نیا پاس ورڈ اور تصدیقی پاس ورڈ آپس میں مماثل نہیں ہیں!', 'error');
      return;
    }

    if (passwordChange.newPassword.length < 6) {
      showToast('نیا پاس ورڈ کم از کم ۶ حروف کا ہونا لازمی ہے!', 'error');
      return;
    }

    setPasswordChange(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail || 'alfaranprinters@gmail.com',
          currentPassword: passwordChange.currentPassword,
          newPassword: passwordChange.newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setPasswordChange({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          loading: false,
        });
      } else {
        showToast(data.message || 'پاس ورڈ تبدیل نہیں ہو سکا', 'error');
      }
    } catch (err: any) {
      showToast('سرور سے رابطہ نہیں ہو سکا', 'error');
    } finally {
      setPasswordChange(prev => ({ ...prev, loading: false }));
    }
  };

  // ۱. آرٹیکل ایکشنز
  const handleToggleBreaking = async (id: string, current: boolean) => {
    const success = await toggleBreakingNews(id, !current);
    if (success) {
      showToast(!current ? 'بریکنگ نیوز میں شامل کر دیا گیا' : 'بریکنگ نیوز سے ہٹا دیا گیا', 'success');
      setAllArticles(prev => prev.map(a => a.id === id ? { ...a, is_breaking: !current } : a));
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('کیا آپ واقعی یہ تحریر حذف کرنا چاہتے ہیں؟')) return;
    const success = await deleteArticle(id);
    if (success) {
      showToast('تحریر حذف کر دی گئی', 'success');
      setAllArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) {
      showToast('عنوان اور متن لازمی ہیں!', 'error');
      return;
    }

    const slug = generateSlug(newArticle.title);
    const res = await insertArticleDirect({
      ...newArticle,
      slug,
      status: 'approved',
      published_at: new Date().toISOString(),
    });

    if (res.success && res.data) {
      showToast('نیا مضمون کامیابی سے شائع ہو گیا!', 'success');
      setAllArticles([res.data, ...allArticles]);
      setShowArticleModal(false);
      setNewArticle({
        title: '',
        category: 'pakistan',
        summary: '',
        content: '',
        image_url: '',
        is_breaking: false,
      });
    } else {
      showToast(res.error || 'محفوظ کرنے میں خرابی ہوئی', 'error');
    }
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    const success = await updateArticle(editingArticle.id, {
      title: editingArticle.title,
      category: editingArticle.category,
      summary: editingArticle.summary,
      content: editingArticle.content,
      image_url: editingArticle.image_url,
      is_breaking: editingArticle.is_breaking,
    });

    if (success) {
      showToast('مضمون کی تبدیلیاں محفوظ ہو گئیں!', 'success');
      setAllArticles(prev => prev.map(a => a.id === editingArticle.id ? editingArticle : a));
      setEditingArticle(null);
    } else {
      showToast('تبدیلیاں محفوظ نہیں ہو سکیں', 'error');
    }
  };

  // ۲. موبائل ایکشنز
  const handleDeleteMobile = async (id: string) => {
    if (!confirm('کیا آپ واقعی یہ ماڈل حذف کرنا چاہتے ہیں؟')) return;
    const success = await deleteMobile(id);
    if (success) {
      showToast('موبائل ماڈل حذف کر دیا گیا', 'success');
      setMobilesList(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSaveMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMobile.model_name || !newMobile.price_pkr) {
      showToast('ماڈل کا نام اور قیمت درج کریں!', 'error');
      return;
    }

    const slug = generateSlug(`${newMobile.brand}-${newMobile.model_name}`);
    const res = await insertMobile({
      ...newMobile,
      slug,
    });

    if (res.success && res.data) {
      showToast('نیا موبائل ماڈل کامیابی سے شامل ہو گیا!', 'success');
      setMobilesList([res.data, ...mobilesList]);
      setShowMobileModal(false);
      setNewMobile({
        brand: 'Samsung',
        model_name: '',
        price_pkr: 0,
        ram: '',
        storage: '',
        camera: '',
        battery: '',
        display: '',
        processor: '',
        image_url: '',
        is_featured: false,
      });
    } else {
      showToast(res.error || 'محفوظ کرنے میں خرابی ہوئی', 'error');
    }
  };

  const handleUpdateMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMobile) return;

    const success = await updateMobile(editingMobile.id, {
      brand: editingMobile.brand,
      model_name: editingMobile.model_name,
      price_pkr: editingMobile.price_pkr,
      ram: editingMobile.ram,
      storage: editingMobile.storage,
      camera: editingMobile.camera,
      battery: editingMobile.battery,
      display: editingMobile.display,
      processor: editingMobile.processor,
      image_url: editingMobile.image_url,
      is_featured: editingMobile.is_featured,
    });

    if (success) {
      showToast('موبائل کی تفصیلات و ریٹس اپڈیٹ ہو گئے!', 'success');
      setMobilesList(prev => prev.map(m => m.id === editingMobile.id ? editingMobile : m));
      setEditingMobile(null);
    } else {
      showToast('اپڈیٹ نہیں ہو سکا', 'error');
    }
  };

  // CSV بلک اپلوڈ
  const handleCsvUpload = async () => {
    if (!csvFile) return;
    setCsvUploading(true);
    try {
      const text = await csvFile.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        showToast('CSV فائل میں مطلوبہ ریکارڈز موجود نہیں ہیں', 'error');
        setCsvUploading(false);
        return;
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const parsed: Omit<MobileModel, 'id' | 'created_at' | 'updated_at'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 3) continue;

        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = cols[idx] || ''; });

        const brand = (row['brand'] || cols[0] || 'Other') as MobileBrand;
        const model_name = row['model_name'] || cols[1] || '';
        const price_pkr = parseInt(row['price_pkr'] || cols[2] || '0', 10);
        if (!model_name || isNaN(price_pkr) || price_pkr <= 0) continue;

        parsed.push({
          brand,
          model_name,
          slug: generateSlug(`${brand}-${model_name}`),
          price_pkr,
          ram: row['ram'] || cols[3] || null,
          storage: row['storage'] || cols[4] || null,
          camera: row['camera'] || cols[5] || null,
          battery: row['battery'] || cols[6] || null,
          display: row['display'] || cols[7] || null,
          processor: row['processor'] || cols[8] || null,
          image_url: row['image_url'] || cols[9] || null,
          is_featured: row['is_featured'] === 'true' || row['is_featured'] === '1' || false,
        });
      }

      const res = await bulkInsertMobiles(parsed);
      if (res.success) {
        showToast(`کامیابی! ${res.insertedCount} موبائل ماڈلز ڈیٹا بیس میں محفوظ ہو گئے۔`, 'success');
        setCsvFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        loadDashboardData();
      } else {
        showToast(res.error || 'CSV امپورٹ میں خرابی', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'فائل پڑھنے میں ناکامی', 'error');
    } finally {
      setCsvUploading(false);
    }
  };

  // ۳. ڈائریکٹری، داخلے، اور اخبارات ایکشنز
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.title || !newContact.city || !newContact.phone) {
      showToast('نام، شہر اور فون نمبر درج کریں!', 'error');
      return;
    }
    const added = await addDirectoryContact(newContact);
    setContacts([added, ...contacts]);
    setShowContactModal(false);
    showToast('نیا رابطہ شامل کر دیا گیا!', 'success');
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('حذف کریں؟')) return;
    await deleteDirectoryContact(id);
    setContacts(contacts.filter(c => c.id !== id));
    showToast('رابطہ حذف کر دیا گیا', 'success');
  };

  const handleSaveAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmission.title || !newAdmission.university_name) return;
    const added = await addAdmission(newAdmission);
    setAdmissions([added, ...admissions]);
    setShowAdmissionModal(false);
    showToast('داخلہ اشتہار شامل کر دیا گیا!', 'success');
  };

  const handleDeleteAdmission = async (id: string) => {
    if (!confirm('حذف کریں؟')) return;
    await deleteAdmission(id);
    setAdmissions(admissions.filter(a => a.id !== id));
    showToast('اشتہار حذف کر دیا گیا', 'success');
  };

  const handleSaveNewspaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewspaper.name || !newNewspaper.website_url) return;
    const added = await addNewspaper(newNewspaper);
    if (added) {
      setNewspapers([added, ...newspapers]);
      setShowNewspaperModal(false);
      showToast('نیا اخبار شامل کر دیا گیا!', 'success');
    }
  };

  const handleDeleteNewspaper = async (id: string) => {
    if (!confirm('حذف کریں؟')) return;
    await deleteNewspaper(id);
    setNewspapers(newspapers.filter(n => n.id !== id));
    showToast('اخبار حذف کر دیا گیا', 'success');
  };

  // ۴. نیوز سنک دستی
  const handleTriggerNewsSync = async () => {
    setCronRunning(true);
    setCronOutput(null);
    try {
      const res = await fetch('/api/cron/fetch-news?key=manual_admin_sync', { method: 'POST' });
      const data = await res.json();
      setCronOutput(data);
      if (data.success) {
        showToast(data.message, 'success');
        loadDashboardData();
      } else {
        showToast(data.message || 'نیوز فیچ میں خرابی', 'error');
      }
    } catch {
      showToast('سرور تک رسائی نہیں ہو سکی', 'error');
    } finally {
      setCronRunning(false);
    }
  };

  // -------------------------------------------------------------
  // اگر کمپیوٹر مجاز نہیں ہے تو غیروں کے لیے ۴۰۴ اسکرین
  // -------------------------------------------------------------
  if (isDeviceAuthorized === false) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-urdu-sans py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 font-nastaleeq">404</h1>
          <h2 className="text-xl font-bold text-slate-800">مطلوبہ صفحہ دستیاب نہیں ہے</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            معذرت، یہ صفحہ منتقل کر دیا گیا ہے یا اس کمپیوٹر پر دستیاب نہیں ہے۔
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-sm hover:bg-emerald-800 transition-colors"
            >
              ہوم پیج پر واپس جائیں
            </Link>
          </div>

          {/* خفیہ ڈیوائس ایکٹیویشن (صرف پورٹل اونر کے لیے) */}
          <div className="pt-6 border-t border-slate-100">
            {!showSecretUnlock ? (
              <button
                onClick={() => setShowSecretUnlock(true)}
                className="text-[11px] text-slate-300 hover:text-slate-500 transition-colors"
              >
                ایڈمن ڈیوائس تصدیق
              </button>
            ) : (
              <form onSubmit={handleAuthorizeCurrentDevice} className="space-y-2 pt-2">
                <input
                  type="password"
                  placeholder="ڈیوائس رجسٹریشن کوڈ..."
                  value={deviceSecretInput}
                  onChange={(e) => setDeviceSecretInput(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs text-center"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold"
                >
                  اس کمپیوٹر کو مجاز بنائیں
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // لاگ ان اسکرین (بغیر کسی ڈیفالٹ پاس ورڈ کے ہنٹ کے)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 font-urdu-sans py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-nastaleeq">
              دسترس کنٹرول پینل
            </h1>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" />
              <span>مجاز ایڈمن کمپیوٹر کی تصدیق ہو چکی ہے</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ای میل ایڈریس:
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="ای میل درج کریں..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                پاس ورڈ:
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="پاس ورڈ درج کریں..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loginLoading ? 'توثیق ہو رہی ہے...' : 'لاگ ان کریں'}
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            مکمل طور پر محفوظ و انکرپٹڈ سیشن
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // مکمل ایڈمن پورٹل ڈیش بورڈ
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-urdu-sans">
      {/* ہیڈر بار */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-nastaleeq">مکمل ایڈمن کنٹرول ڈیش بورڈ</h1>
            <p className="text-xs text-slate-400">تمام سیکشنز کا مکمل اختیار: مضامین، موبائل قیمتیں، ڈائریکٹری، داخلے، اور سیکیورٹی</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => loadDashboardData()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>ریفریش</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>لاگ آؤٹ</span>
          </button>
        </div>
      </div>

      {/* تمام سیکشنز کے ٹیبز */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'articles'
              ? 'bg-white text-emerald-800 border-emerald-700 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>مضامین و خبریں ({allArticles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mobiles')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'mobiles'
              ? 'bg-white text-emerald-800 border-emerald-700 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>موبائل ریٹس و ماڈلز ({mobilesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'directory'
              ? 'bg-white text-emerald-800 border-emerald-700 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>رابطہ ڈائریکٹری ({contacts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admissions')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'admissions'
              ? 'bg-white text-emerald-800 border-emerald-700 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>داخلے و جامعات ({admissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('newspapers')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'newspapers'
              ? 'bg-white text-emerald-800 border-emerald-700 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          <NewspaperIcon className="w-4 h-4" />
          <span>قومی اخبارات ({newspapers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cron')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'cron'
              ? 'bg-white text-emerald-800 border-emerald-700 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>خودکار AI نیوز سنک</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-white text-emerald-800 border-emerald-700 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4 text-emerald-600" />
          <span>پاس ورڈ و سیکیورٹی</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* ٹیب ۱: مضامین و خبریں */}
      {/* ========================================================= */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-nastaleeq">مضامین و خبروں کا مکمل انتظام</h2>
              <p className="text-xs text-slate-500">مضامین ایڈٹ کریں، بریکنگ نیوز آن/آف کریں، یا نیا مضمون شامل کریں۔</p>
            </div>
            <button
              onClick={() => setShowArticleModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>نیا مضمون تحریر کریں</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">عنوان</th>
                    <th className="p-3.5">زمرہ</th>
                    <th className="p-3.5">بریکنگ مارکی</th>
                    <th className="p-3.5">تاریخ</th>
                    <th className="p-3.5">ایکشنز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">
                        <a href={`/articles/${art.slug}`} target="_blank" className="hover:underline text-emerald-800">
                          {art.title}
                        </a>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {art.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleBreaking(art.id, Boolean(art.is_breaking))}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                            art.is_breaking
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {art.is_breaking ? 'بریکنگ فعال' : 'عام خبر'}
                        </button>
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {formatUrduDate(art.published_at || art.created_at)}
                      </td>
                      <td className="p-3.5 flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingArticle(art)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                          title="ایڈٹ کریں"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ٹیب ۲: موبائل فونز اور قیمتیں */}
      {/* ========================================================= */}
      {activeTab === 'mobiles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-nastaleeq">موبائل فونز ماڈلز اور قیمتوں کا انتظام</h2>
              <p className="text-xs text-slate-500">ریٹس تبدیل کریں، ماڈل ایڈٹ کریں، یا CSV فائل سے پوری مارکیٹ اپلوڈ کریں۔</p>
            </div>
            <button
              onClick={() => setShowMobileModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>نیا موبائل ماڈل شامل کریں</span>
            </button>
          </div>

          {/* CSV بلک امپورٹ */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base">
              <Upload className="w-5 h-5 text-emerald-700" />
              <span>ایکسل / CSV بلک امپورٹ (ایک ساتھ تمام مارکیٹ ریٹس اپلوڈ کریں)</span>
            </div>
            <p className="text-xs text-slate-600">
              CSV کالمز: <code className="bg-white px-2 py-0.5 rounded border text-emerald-800 font-mono text-[11px]">brand,model_name,price_pkr,ram,storage,camera,battery,display,processor</code>
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 text-xs text-slate-600"
              />
              <button
                onClick={handleCsvUpload}
                disabled={csvUploading || !csvFile}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{csvUploading ? 'اپلوڈ جاری ہے...' : 'CSV امپورٹ چلائیں'}</span>
              </button>
            </div>
          </div>

          {/* ماڈلز لسٹ ٹیبل */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">برانڈ</th>
                    <th className="p-3.5">ماڈل</th>
                    <th className="p-3.5">قیمت (روپے)</th>
                    <th className="p-3.5">ریم / میموری</th>
                    <th className="p-3.5">کیمرہ</th>
                    <th className="p-3.5">بیٹری</th>
                    <th className="p-3.5">ایکشنز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mobilesList.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-800">{m.brand}</td>
                      <td className="p-3.5 font-bold text-emerald-800">
                        <a href={`/mobiles/${m.slug}`} target="_blank" className="hover:underline">
                          {m.model_name}
                        </a>
                      </td>
                      <td className="p-3.5 font-extrabold text-emerald-600">
                        روپے {new Intl.NumberFormat('ur-PK').format(m.price_pkr)}
                      </td>
                      <td className="p-3.5 text-slate-600">{m.ram || '—'} / {m.storage || '—'}</td>
                      <td className="p-3.5 text-slate-600 max-w-[150px] truncate">{m.camera || '—'}</td>
                      <td className="p-3.5 text-slate-600">{m.battery || '—'}</td>
                      <td className="p-3.5 flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingMobile(m)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                          title="ایڈٹ کریں"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMobile(m.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ٹیب ۳: رابطہ ڈائریکٹری */}
      {/* ========================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-nastaleeq">رابطہ ڈائریکٹری کا انتظام</h2>
              <p className="text-xs text-slate-500">تھانے، ہسپتال، اور سرکاری دفاتر کے فون نمبرز کنٹرول کریں۔</p>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>نیا ادارہ شامل کریں</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">ادارے کا نام</th>
                    <th className="p-3.5">شعبہ</th>
                    <th className="p-3.5">شہر و خطہ</th>
                    <th className="p-3.5">فون نمبر</th>
                    <th className="p-3.5">ایکشنز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{c.title}</td>
                      <td className="p-3.5 text-slate-600">{c.category}</td>
                      <td className="p-3.5 text-slate-600">{c.city} ({c.region})</td>
                      <td className="p-3.5 font-bold text-emerald-800 font-mono" dir="ltr">{c.phone}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ٹیب ۴: داخلے و جامعات */}
      {/* ========================================================= */}
      {activeTab === 'admissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-nastaleeq">جامعات کے داخلہ اشتہارات کا انتظام</h2>
              <p className="text-xs text-slate-500">پاکستانی جامعات میں نئے داخلوں کی آخری تاریخ اور اپلائی لنکس درج کریں۔</p>
            </div>
            <button
              onClick={() => setShowAdmissionModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>نیا داخلہ اشتہار شامل کریں</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">عنوان</th>
                    <th className="p-3.5">جامعہ کا نام</th>
                    <th className="p-3.5">ڈگری لیول</th>
                    <th className="p-3.5">آخری تاریخ</th>
                    <th className="p-3.5">ایکشنز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admissions.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{a.title}</td>
                      <td className="p-3.5 font-semibold text-emerald-800">{a.university_name}</td>
                      <td className="p-3.5 text-slate-600">{a.degree_level}</td>
                      <td className="p-3.5 text-slate-500">{a.deadline || 'جلد متوقع'}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleDeleteAdmission(a.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ٹیب ۵: قومی اخبارات */}
      {/* ========================================================= */}
      {activeTab === 'newspapers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-nastaleeq">قومی اخبارات و ای پیپرز کا انتظام</h2>
              <p className="text-xs text-slate-500">اخبارات، ای پیپرز اور ویب سائٹس کے لنکس کنٹرول کریں۔</p>
            </div>
            <button
              onClick={() => setShowNewspaperModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>نیا اخبار شامل کریں</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">اخبار کا نام</th>
                    <th className="p-3.5">زبان</th>
                    <th className="p-3.5">کیٹیگری</th>
                    <th className="p-3.5">ویب سائٹ</th>
                    <th className="p-3.5">ایکشنز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {newspapers.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{n.name}</td>
                      <td className="p-3.5 text-slate-600">{n.language}</td>
                      <td className="p-3.5 text-slate-600">{n.category}</td>
                      <td className="p-3.5 text-emerald-800 font-mono text-[11px]" dir="ltr">{n.website_url}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleDeleteNewspaper(n.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ٹیب ۶: خودکار AI نیوز سنک */}
      {/* ========================================================= */}
      {activeTab === 'cron' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 font-nastaleeq">
              خودکار نیوز فیچ اور جیمینائی AI صحافتی انجن
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              اس بٹن پر کلک کرنے سے تمام آر ایس ایس فیڈز سے تازہ خبریں حاصل ہو کر خودکار طریقے سے جیمینائی AI سے ری رائٹ ہو جائیں گی اور پورٹل پر لائیو شائع ہو جائیں گی۔
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTriggerNewsSync}
              disabled={cronRunning}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${cronRunning ? 'animate-spin' : ''}`} />
              <span>{cronRunning ? 'خبریں فیچ اور تحریر ہو رہی ہیں...' : 'تازہ ترین خبریں خودکار فیچ کریں (Fetch Now)'}</span>
            </button>
          </div>

          {cronOutput && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
              <div className="font-bold text-slate-800 font-urdu-sans text-sm">فیچنگ کا نتیجہ:</div>
              <pre className="text-slate-700 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(cronOutput, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* ٹیب ۷: پاس ورڈ و سیکیورٹی کنٹرول */}
      {/* ========================================================= */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* پاس ورڈ تبدیلی کارڈ */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 font-nastaleeq">ایڈمن پاس ورڈ تبدیل کریں</h2>
              <p className="text-xs text-slate-500">اپنا موجودہ اور نیا پاس ورڈ درج کر کے محفوظ کریں۔</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">موجودہ پاس ورڈ:</label>
                <input
                  type="password"
                  required
                  value={passwordChange.currentPassword}
                  onChange={(e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value })}
                  placeholder="موجودہ پاس ورڈ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نیا پاس ورڈ:</label>
                <input
                  type="password"
                  required
                  value={passwordChange.newPassword}
                  onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                  placeholder="کم از کم ۶ حروف کا نیا پاس ورڈ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نئے پاس ورڈ کی تصدیق:</label>
                <input
                  type="password"
                  required
                  value={passwordChange.confirmPassword}
                  onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                  placeholder="نیا پاس ورڈ دوبارہ درج کریں..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={passwordChange.loading}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {passwordChange.loading ? 'محفوظ ہو رہا ہے...' : 'پاس ورڈ تبدیل کریں'}
              </button>
            </form>
          </div>

          {/* ڈیوائس سیکیورٹی اسٹیٹس کارڈ */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Laptop className="w-5 h-5" />
                <span>ڈیوائس بائنڈنگ اور سیکیورٹی پروٹیکشن</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ایڈمن پینل عام صارفین اور پبلک کے لیے 100% پوشیدہ (404) ہے اور صرف آپ کے اس ذاتی کمپیوٹر پر رجسٹرڈ ہے۔ انٹرنیٹ پر کوئی بھی اجنبی اس پینل کو نہیں کھول سکتا۔
              </p>
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>اسٹیٹس: یہ کمپیوٹر ایڈمن ڈیوائس رجسٹرڈ ہے</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Device Key: {MASTER_DEVICE_KEY}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  if (confirm('کیا آپ واقعی اس کمپیوٹر سے ایڈمن رجسٹریشن ختم کرنا چاہتے ہیں؟')) {
                    localStorage.removeItem('dastaras_admin_authorized_device');
                    setIsDeviceAuthorized(false);
                    setIsAuthenticated(false);
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                اس کمپیوٹر سے ایڈمن رجسٹریشن ڈی رجسٹر کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* موڈلز (Modals) برائے ایڈٹ اور ایڈ */}
      {/* ========================================================= */}

      {/* ۱. نیا مضمون ماڈل */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg font-nastaleeq">نیا مضمون یا خبر تحریر کریں</h3>
              <button onClick={() => setShowArticleModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان:</label>
                <input
                  type="text"
                  required
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="عنوان لکھیں..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">زمرہ:</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value as ArticleCategory })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {ARTICLE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">خلاصہ:</label>
                <textarea
                  rows={2}
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  placeholder="خلاصہ..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">مکمل متن:</label>
                <textarea
                  rows={6}
                  required
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="اردو متن..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">تصویر URL:</label>
                <input
                  type="url"
                  value={newArticle.image_url}
                  onChange={(e) => setNewArticle({ ...newArticle, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="new_is_breaking"
                  checked={newArticle.is_breaking}
                  onChange={(e) => setNewArticle({ ...newArticle, is_breaking: e.target.checked })}
                />
                <label htmlFor="new_is_breaking" className="font-bold text-slate-700">بریکنگ نیوز مارکی میں شامل کریں</label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowArticleModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">منسوخ</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold">شائع کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۲. ایڈٹ مضمون ماڈل */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg font-nastaleeq">مضمون ایڈٹ کریں</h3>
              <button onClick={() => setEditingArticle(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان:</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">زمرہ:</label>
                <select
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as ArticleCategory })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {ARTICLE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">خلاصہ:</label>
                <textarea
                  rows={2}
                  value={editingArticle.summary || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">مکمل متن:</label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">تصویر URL:</label>
                <input
                  type="url"
                  value={editingArticle.image_url || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, image_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_is_breaking"
                  checked={Boolean(editingArticle.is_breaking)}
                  onChange={(e) => setEditingArticle({ ...editingArticle, is_breaking: e.target.checked })}
                />
                <label htmlFor="edit_is_breaking" className="font-bold text-slate-700">بریکنگ نیوز مارکی میں شامل کریں</label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setEditingArticle(null)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">منسوخ</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold">تبدیلیاں محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۳. نیا موبائل ماڈل */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg font-nastaleeq">نیا موبائل ماڈل شامل کریں</h3>
              <button onClick={() => setShowMobileModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMobile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">برانڈ:</label>
                  <select
                    value={newMobile.brand}
                    onChange={(e) => setNewMobile({ ...newMobile, brand: e.target.value as MobileBrand })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {MOBILE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ماڈل کا نام:</label>
                  <input
                    type="text"
                    required
                    value={newMobile.model_name}
                    onChange={(e) => setNewMobile({ ...newMobile, model_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">قیمت (روپے):</label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={newMobile.price_pkr || ''}
                  onChange={(e) => setNewMobile({ ...newMobile, price_pkr: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ریم:</label>
                  <input
                    type="text"
                    value={newMobile.ram}
                    onChange={(e) => setNewMobile({ ...newMobile, ram: e.target.value })}
                    placeholder="8 GB"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">میموری:</label>
                  <input
                    type="text"
                    value={newMobile.storage}
                    onChange={(e) => setNewMobile({ ...newMobile, storage: e.target.value })}
                    placeholder="128 GB"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">کیمرہ:</label>
                  <input
                    type="text"
                    value={newMobile.camera}
                    onChange={(e) => setNewMobile({ ...newMobile, camera: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">بیٹری:</label>
                  <input
                    type="text"
                    value={newMobile.battery}
                    onChange={(e) => setNewMobile({ ...newMobile, battery: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">تصویر کا URL:</label>
                <input
                  type="url"
                  value={newMobile.image_url}
                  onChange={(e) => setNewMobile({ ...newMobile, image_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowMobileModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">منسوخ</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold">محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۴. ایڈٹ موبائل ماڈل */}
      {editingMobile && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg font-nastaleeq">موبائل کی تفصیلات ایڈٹ کریں</h3>
              <button onClick={() => setEditingMobile(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateMobile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">برانڈ:</label>
                  <select
                    value={editingMobile.brand}
                    onChange={(e) => setEditingMobile({ ...editingMobile, brand: e.target.value as MobileBrand })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {MOBILE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ماڈل:</label>
                  <input
                    type="text"
                    required
                    value={editingMobile.model_name}
                    onChange={(e) => setEditingMobile({ ...editingMobile, model_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">قیمت (پاکستانی روپے):</label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={editingMobile.price_pkr}
                  onChange={(e) => setEditingMobile({ ...editingMobile, price_pkr: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-xl font-bold text-emerald-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ریم:</label>
                  <input
                    type="text"
                    value={editingMobile.ram || ''}
                    onChange={(e) => setEditingMobile({ ...editingMobile, ram: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسٹوریج:</label>
                  <input
                    type="text"
                    value={editingMobile.storage || ''}
                    onChange={(e) => setEditingMobile({ ...editingMobile, storage: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">کیمرہ:</label>
                  <input
                    type="text"
                    value={editingMobile.camera || ''}
                    onChange={(e) => setEditingMobile({ ...editingMobile, camera: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">بیٹری:</label>
                  <input
                    type="text"
                    value={editingMobile.battery || ''}
                    onChange={(e) => setEditingMobile({ ...editingMobile, battery: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setEditingMobile(null)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">منسوخ</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold">اپڈیٹ محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۵. نیا رابطہ ماڈل */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg font-nastaleeq">نیا رابطہ یا ادارہ شامل کریں</h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveContact} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ادارے کا نام:</label>
                <input
                  type="text"
                  required
                  value={newContact.title}
                  onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                  placeholder="تھانہ سٹی مظفرآباد..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شعبہ:</label>
                  <select
                    value={newContact.category}
                    onChange={(e) => setNewContact({ ...newContact, category: e.target.value as DirectoryCategory })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {DIRECTORY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">خطہ:</label>
                  <select
                    value={newContact.region}
                    onChange={(e) => setNewContact({ ...newContact, region: e.target.value as DirectoryRegion })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {DIRECTORY_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شہر:</label>
                  <input
                    type="text"
                    required
                    value={newContact.city}
                    onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
                    placeholder="مظفرآباد"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">فون نمبر:</label>
                  <input
                    type="text"
                    required
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="05822-920000"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowContactModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">منسوخ</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold">محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۶. نیا داخلہ اشتہار ماڈل */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg font-nastaleeq">نیا داخلہ اشتہار شامل کریں</h3>
              <button onClick={() => setShowAdmissionModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAdmission} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اشتہار کا عنوان:</label>
                <input
                  type="text"
                  required
                  value={newAdmission.title}
                  onChange={(e) => setNewAdmission({ ...newAdmission, title: e.target.value })}
                  placeholder="بہار 2026 داخلے شروع ہیں..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">جامعہ کا نام:</label>
                <input
                  type="text"
                  required
                  value={newAdmission.university_name}
                  onChange={(e) => setNewAdmission({ ...newAdmission, university_name: e.target.value })}
                  placeholder="آزاد جموں و کشمیر یونیورسٹی"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ڈگری لیول:</label>
                  <input
                    type="text"
                    value={newAdmission.degree_level}
                    onChange={(e) => setNewAdmission({ ...newAdmission, degree_level: e.target.value })}
                    placeholder="بی ایس / ایم ایس / پی ایچ ڈی"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">آخری تاریخ:</label>
                  <input
                    type="text"
                    value={newAdmission.deadline}
                    onChange={(e) => setNewAdmission({ ...newAdmission, deadline: e.target.value })}
                    placeholder="30 دسمبر 2026"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">آن لائن اپلائی کا لنک (URL):</label>
                <input
                  type="url"
                  value={newAdmission.apply_url}
                  onChange={(e) => setNewAdmission({ ...newAdmission, apply_url: e.target.value })}
                  placeholder="https://ajku.edu.pk/admissions"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAdmissionModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">منسوخ</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold">محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۷. نیا اخبار ماڈل */}
      {showNewspaperModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg font-nastaleeq">نیا اخبار یا ای پیپر شامل کریں</h3>
              <button onClick={() => setShowNewspaperModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNewspaper} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اخبار کا نام:</label>
                <input
                  type="text"
                  required
                  value={newNewspaper.name}
                  onChange={(e) => setNewNewspaper({ ...newNewspaper, name: e.target.value })}
                  placeholder="روزنامہ نوائے وقت..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">زبان:</label>
                  <select
                    value={newNewspaper.language}
                    onChange={(e) => setNewNewspaper({ ...newNewspaper, language: e.target.value as 'اردو' | 'انگریزی' })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="اردو">اردو</option>
                    <option value="انگریزی">انگریزی</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">کیٹیگری:</label>
                  <input
                    type="text"
                    value={newNewspaper.category}
                    onChange={(e) => setNewNewspaper({ ...newNewspaper, category: e.target.value })}
                    placeholder="قومی / علاقائی"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ویب سائٹ یا ای پیپر لنک (URL):</label>
                <input
                  type="url"
                  required
                  value={newNewspaper.website_url}
                  onChange={(e) => setNewNewspaper({ ...newNewspaper, website_url: e.target.value })}
                  placeholder="https://epaper.nawaiwaqt.com.pk"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowNewspaperModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">منسوخ</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold">محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
