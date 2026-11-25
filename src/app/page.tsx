import React from 'react';
import Link from 'next/link';
import { 
  getArticles, 
  getDirectoryContacts, 
  getAdmissions, 
  getNewspapers 
} from '@/lib/supabaseClient';
import HeroSearch from '@/components/HeroSearch';
import ArticleCard from '@/components/ArticleCard';
import ContactCard from '@/components/ContactCard';
import AdmissionCard from '@/components/AdmissionCard';
import NewspaperCard from '@/components/NewspaperCard';
import { 
  BookOpen, 
  PhoneCall, 
  GraduationCap, 
  Newspaper as NewspaperIcon, 
  ArrowLeft, 
  Sparkles,
  ShieldAlert,
  Flame,
  PenTool,
  CheckCircle2
} from 'lucide-react';

export const revalidate = 60; // 1 منٹ کی کیشنگ برائے پرفارمنس

export default async function HomePage() {
  const [articles, contacts, admissions, newspapers] = await Promise.all([
    getArticles('approved'),
    getDirectoryContacts(),
    getAdmissions(),
    getNewspapers(),
  ]);

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1, 4);
  const emergencyContacts = contacts.filter((c) => c.emergency).slice(0, 4);
  const featuredAdmissions = admissions.slice(0, 3);
  const featuredNewspapers = newspapers.slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. ہیرو سیکشن مع سرچ بار اور تعارف */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b-4 border-portal-gold">
        {/* پس منظر کے نفیس پیٹرن */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* بیج */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-sm font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-portal-gold" />
            <span>پاکستان اور کشمیر کا اسمارٹ اردو پورٹل</span>
          </div>

          {/* مین ٹائٹل اور ٹیگ لائن */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              پورٹل <span className="text-emerald-400">دسترس</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
              پاکستان اور کشمیر کے لیے معلومات، تعلیم اور رابطوں کا معتبر مرکز
            </p>
          </div>

          {/* گلوبل سرچ کمپوننٹ */}
          <div className="pt-4 pb-2">
            <HeroSearch />
          </div>

          {/* فوری کاؤنٹرز / احصائیات */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">۵۰+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">سرکاری دفاتر و تھانے</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">۱۲+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">معتبر جامعات</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">۱۰+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">قومی اخبارات</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">۱۰۰%</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">خالص اردو انٹرفیس</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 2. خبریں، سائنس، انٹرنیٹ اور مضامین سیکشن */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-portal-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-portal-primary font-bold text-base mb-1">
                <BookOpen className="w-5 h-5 text-portal-primary" />
                <span>علم و آگاہی کا گہوارہ</span>
              </div>
              <h2 className="text-3xl font-extrabold text-portal-slate">
                خبریں، سائنس و انٹرنیٹ ٹیکنالوجی
              </h2>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-portal-primary hover:text-portal-primaryHover font-bold text-lg group self-start sm:self-auto"
            >
              <span>تمام مضامین دیکھیں</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* نمایاں فیچرڈ تحریر */}
          {featuredArticle && (
            <ArticleCard article={featuredArticle} featured={true} />
          )}

          {/* دیگر مضامین کی گرڈ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* 3. رابطہ ڈائریکٹری و ایمرجنسی سیکشن */}
        <section className="space-y-8 bg-emerald-50/50 p-6 sm:p-10 rounded-3xl border border-emerald-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-emerald-200/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-bold text-base mb-1">
                <ShieldAlert className="w-5 h-5" />
                <span>پاکستان و آزاد کشمیر اسمارٹ ڈائریکٹری</span>
              </div>
              <h2 className="text-3xl font-extrabold text-portal-slate">
                اہم سرکاری دفاتر، تھانے اور ایمرجنسی نمبرز
              </h2>
              <p className="text-base text-slate-600 mt-1">
                ایک کلک سے فوری کال کریں یا نمبر کاپی کریں۔ آزاد کشمیر، گلگت بلتستان اور تمام صوبوں کے مستند نمبرز۔
              </p>
            </div>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-portal-primary text-white font-bold text-lg hover:bg-portal-primaryHover transition-colors shadow-sm self-start sm:self-auto"
            >
              <PhoneCall className="w-4 h-4" />
              <span>مکمل ڈائریکٹری کھولیں</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {emergencyContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </section>

        {/* 4. تازہ ترین داخلے و جامعات سیکشن */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-portal-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-portal-gold font-bold text-base mb-1">
                <GraduationCap className="w-5 h-5 text-portal-gold" />
                <span>تعلیم اور مستقبل</span>
              </div>
              <h2 className="text-3xl font-extrabold text-portal-slate">
                تازہ ترین یونیورسٹی داخلے (Admissions Alert)
              </h2>
            </div>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-1.5 text-portal-primary hover:text-portal-primaryHover font-bold text-lg group self-start sm:self-auto"
            >
              <span>تمام جامعات و داخلے</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAdmissions.map((adm) => (
              <AdmissionCard key={adm.id} admission={adm} />
            ))}
          </div>
        </section>

        {/* 5. قومی اخبارات سیکشن */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-portal-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-portal-primary font-bold text-base mb-1">
                <NewspaperIcon className="w-5 h-5 text-portal-primary" />
                <span>ملکی و بین الاقوامی صحافت</span>
              </div>
              <h2 className="text-3xl font-extrabold text-portal-slate">
                پاکستان کے معروف اخبارات و ای پیپرز
              </h2>
            </div>
            <Link
              href="/newspapers"
              className="inline-flex items-center gap-1.5 text-portal-primary hover:text-portal-primaryHover font-bold text-lg group self-start sm:self-auto"
            >
              <span>تمام اخبارات دیکھیں</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNewspapers.map((np) => (
              <NewspaperCard key={np.id} newspaper={np} />
            ))}
          </div>
        </section>

        {/* 6. عوامی مضمون نویسی بینر (Public Submission CTA) */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-portal-primary to-emerald-800 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-lg bg-emerald-700/80 text-emerald-100 text-sm font-semibold border border-emerald-500/30">
              عوامی مضمون نگاری کی دعوت
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              کیا آپ کے پاس کوئی علمی تحقیق، تجزیہ یا سائنسی تحریر ہے؟
            </h2>
            <p className="text-lg text-emerald-100 leading-relaxed">
              دسترس پورٹل پر بغیر کسی فیس کے اپنا مضمون ارسال کریں۔ ہماری ایڈیٹوریل ٹیم کے جائزے کے بعد آپ کی تحریر آپ کے نام کے ساتھ شائع کر دی جائے گی۔
            </p>
            <div className="pt-2">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-portal-primary font-extrabold text-lg hover:bg-emerald-50 transition-all shadow-md active:scale-95"
              >
                <PenTool className="w-5 h-5 text-portal-primary" />
                <span>ابھی مضمون لکھیں اور بھیجیں</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
