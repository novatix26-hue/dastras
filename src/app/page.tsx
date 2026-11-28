import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getArticles, 
  getMobiles,
  getDirectoryContacts, 
  getAdmissions, 
  getNewspapers 
} from '@/lib/supabaseClient';
import { getLiveWeather } from '@/lib/api/weather';
import { getLiveCurrencyRates } from '@/lib/api/currency';
import { getLivePrayerTimings } from '@/lib/api/prayer';
import WeatherWidget from '@/components/WeatherWidget';
import PrayerWidget from '@/components/PrayerWidget';
import CurrencyWidget from '@/components/CurrencyWidget';
import PetrolWidget from '@/components/PetrolWidget';
import MobileCard from '@/components/MobileCard';
import AdSlot from '@/components/AdSlot';
import OptimizedImage from '@/components/OptimizedImage';
import { 
  Flame, 
  Clock, 
  ArrowLeft, 
  Smartphone, 
  HeartPulse, 
  Laptop, 
  Trophy, 
  Building2, 
  TrendingUp, 
  Sparkles,
  PhoneCall,
  GraduationCap,
  Newspaper as NewspaperIcon,
  Fuel,
  Star,
  BookOpen,
  Compass
} from 'lucide-react';
import { formatUrduDate } from '@/lib/utils';
import { getDailyStory } from '@/lib/dailyStory';

export const revalidate = 60; // 1 منٹ کیشنگ

export default async function HomePage() {
  // تمام لائیو اور ڈیٹا بیس سورسز سے حقیقی ڈیٹا حاصل کریں (کوئی فرضی ڈیٹا نہیں)
  const [
    allArticles,
    mobiles,
    liveWeather,
    currencyRates,
    prayerTimings,
    contacts,
    admissions,
    newspapers,
    kidsStories,
    weirdArticles
  ] = await Promise.all([
    getArticles({ status: 'approved', limit: 40 }),
    getMobiles({ featured: true }),
    getLiveWeather('Islamabad'),
    getLiveCurrencyRates(),
    getLivePrayerTimings('Islamabad'),
    getDirectoryContacts(),
    getAdmissions(),
    getNewspapers(),
    getArticles({ category: 'kids', limit: 3, status: 'approved' }),
    getArticles({ category: 'weird', limit: 3, status: 'approved' }),
  ]);

  // صرف خاص، اہم اور قومی و بین الاقوامی خبریں (کہانیاں ٹکر یا ہیرو میں نہیں آئیں گی)
  const newsArticles = allArticles.filter(a => a.category !== 'kids');

  // بریکنگ اور نمایاں ترین خبروں کو ترجیح دیں
  const breakingNews = newsArticles.filter(a => a.is_breaking);
  const otherNews = newsArticles.filter(a => !a.is_breaking);
  const prioritizedNews = [...breakingNews, ...otherNews];

  const tickerArticles = prioritizedNews.slice(0, 10);
  const heroArticle = prioritizedNews[0];
  const sidebarArticles = prioritizedNews.slice(1, 6);

  // پس منظر میں از خود سنک چیک: اگر آخری خبر کو ۱۵ منٹ سے زیادہ ہو چکے ہوں تو نئی خبریں خودکار حاصل ہوں
  const latestArticleTime = prioritizedNews[0] ? new Date(prioritizedNews[0].published_at || prioritizedNews[0].created_at).getTime() : 0;
  const minutesSinceLastArticle = (Date.now() - latestArticleTime) / (1000 * 60);

  if (minutesSinceLastArticle > 15) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dastras-five.vercel.app';
    fetch(`${siteUrl}/api/cron/fetch-news?key=dastaras_cron_secret_2026`, {
      method: 'POST',
      headers: { 'x-cron-secret': 'dastaras_cron_secret_2026' },
      cache: 'no-store',
    }).catch(() => {});
  }

  // کیٹیگری کے لحاظ سے فلٹرنگ
  const pakistanArticles = allArticles.filter(a => a.category === 'pakistan' || a.category === 'azad-kashmir' || a.category === 'خبریں').slice(0, 4);
  const healthArticles = allArticles.filter(a => a.category === 'health' || a.category === 'سائنسی معلومات').slice(0, 3);
  const techArticles = allArticles.filter(a => a.category === 'technology' || a.category === 'انٹرنیٹ و ٹیکنالوجی').slice(0, 3);
  const sportsArticles = allArticles.filter(a => a.category === 'sports').slice(0, 3);
  const businessArticles = allArticles.filter(a => a.category === 'business').slice(0, 3);

  // نمایاں موبائل ماڈلز
  const featuredMobiles = mobiles.slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-14 font-urdu-sans pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 2. اردو پوائنٹ اسٹائل ہیرو گرڈ (مین فیچرڈ + سائیڈ بار ہیڈلائنز) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* مین ہیرو نیوز (8 Columns) */}
          <div className="lg:col-span-8">
            {heroArticle ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative h-72 sm:h-[420px] w-full bg-slate-100 overflow-hidden">
                  <OptimizedImage
                    src={heroArticle.image_url}
                    alt={heroArticle.title}
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-6 right-6 left-6 text-white space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {heroArticle.is_breaking ? 'بریکنگ نیوز' : 'نمایاں خبر'}
                      </span>
                      <span className="text-xs text-slate-300">
                        {formatUrduDate(heroArticle.published_at || heroArticle.created_at)}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black font-nastaleeq leading-tight text-white drop-shadow-md">
                      <Link href={`/articles/${heroArticle.slug}`} className="hover:text-amber-300 transition-colors">
                        {heroArticle.title}
                      </Link>
                    </h1>
                    <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed hidden sm:block">
                      {heroArticle.summary || heroArticle.content.slice(0, 180)}...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                کوئی خبر دستیاب نہیں ہے۔
              </div>
            )}
          </div>

          {/* تازہ ترین بریکنگ سائیڈ بار (4 Columns) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600 fill-red-600" />
                <h2 className="text-lg font-bold text-slate-900 font-nastaleeq">
                  تازہ ترین اہم خبریں
                </h2>
              </div>
              <Link
                href="/category/pakistan"
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
              >
                مزید
              </Link>
            </div>

            <div className="space-y-4">
              {sidebarArticles.map((art, idx) => (
                <div
                  key={art.id || idx}
                  className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0 group"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <Link
                      href={`/articles/${art.slug}`}
                      className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
                    >
                      {art.title}
                    </Link>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatUrduDate(art.published_at || art.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* اشتہار بینر ۱ (گوگل ایڈسینس لیڈر بورڈ) */}
        <AdSlot format="horizontal" slotId="home-top-leaderboard" />

        {/* 3. لائیو یوٹیلیٹیز گرڈ: موسم، اوقاتِ نماز، کرنسی ریٹس */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq">
                لائیو یوٹیلیٹیز و عوامی معلومات (مصدقہ APIs)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <WeatherWidget initialWeather={liveWeather} />
            <PrayerWidget prayerData={prayerTimings} />
            <CurrencyWidget initialData={currencyRates} />
            <PetrolWidget />
          </div>
        </section>

        {/* 3.1 قرآنِ کریم آن لائن تلاوت و سلیس اردو ترجمہ */}
        <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-700/50 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>کلامِ الٰہی • آسان و واضح قرآنی رسم الخط</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-nastaleeq leading-tight text-white">
                قرآن مجید آن لائن تلاوت، اردو ترجمہ و قراءت
              </h2>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                پڑھنے میں انتہائی آسان اعراب والا قرآنی رسم الخط، مولانا فتح محمد جالندھری کا سلیس اردو ترجمہ اور مشاری راشد العفاسی و قراء کبار کی خوبصورت آواز میں آیت بہ آیت سماعت۔
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/quran"
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>تلاوت شروع کریں (۱۱۴ سورتیں)</span>
                </Link>
                <Link
                  href="/quran/36"
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                >
                  سورۃ یٰس
                </Link>
                <Link
                  href="/quran/55"
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                >
                  سورۃ الرحمٰن
                </Link>
                <Link
                  href="/quran/67"
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                >
                  سورۃ الملک
                </Link>
              </div>
            </div>

            {/* آیتِ مبارکہ کارڈ */}
            <div className="w-full lg:w-96 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center space-y-3">
              <div className="text-xs text-amber-300 font-bold">آیتِ کریمہ</div>
              <div className="font-quran text-2xl text-amber-200 leading-loose py-1 font-bold">
                أَلَا بِذِكۡرِ ٱللَّهِ تَطۡمَئِنُّ ٱلۡقُلُوبُ ۝
              </div>
              <div className="text-xs text-slate-300">
                خبردار! اللہ کے ذکر ہی سے دلوں کو اطمینان حاصل ہوتا ہے۔
              </div>
              <div className="text-[11px] text-emerald-400 font-bold pt-1">
                [سورۃ الرعد: ۲۸]
              </div>
            </div>
          </div>
        </section>

        {/* 4. موبائل فونز ماڈلز اور قیمتیں پاکستان شوکیس */}
        {featuredMobiles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-emerald-700" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-nastaleeq">
                  موبائل فونز کی تازہ ترین قیمتیں (پاکستان)
                </h2>
              </div>
              <Link
                href="/mobiles"
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-sm"
              >
                <span>تمام موبائل ریٹس</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredMobiles.map((mob) => (
                <MobileCard key={mob.id} mobile={mob} />
              ))}
            </div>
          </section>
        )}

        {/* 4.1 بچوں کی دنیا شوکیس */}
        {kidsStories && kidsStories.length > 0 && (() => {
          const todaysStory = getDailyStory(kidsStories).story || kidsStories[0];
          return (
            <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl overflow-hidden relative">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-400/30">
                    <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>بچوں کی رنگین دنیا • آج کی خاص کہانی</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-nastaleeq leading-tight text-white">
                    {todaysStory.title}
                  </h2>
                  <p className="text-sm sm:text-base text-purple-100 line-clamp-2 leading-relaxed">
                    {todaysStory.summary || todaysStory.content.slice(0, 180)}...
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      href={`/articles/${todaysStory.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    >
                      <span>کہانی پڑھیں</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/kids"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/10 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-purple-300" />
                      <span>بچوں کی تمام کہانیاں</span>
                    </Link>
                  </div>
                </div>

                <div className="relative w-full lg:w-96 h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl shrink-0">
                  <Image
                    src={todaysStory.image_url || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'}
                    alt={todaysStory.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 384px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 right-3 bg-purple-950/80 backdrop-blur-sm text-purple-200 text-xs px-3 py-1 rounded-full font-bold">
                    تصویری جھلکیاں 📸
                  </span>
                </div>
              </div>
            </section>
          );
        })()}

        {/* 4.2 عجیب و دلچسپ خبریں شوکیس */}
        {weirdArticles && weirdArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-nastaleeq">
                  عجیب و دلچسپ دنیا
                </h2>
              </div>
              <Link
                href="/category/weird"
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-sm"
              >
                <span>مزید حیرت انگیز خبریں</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {weirdArticles.slice(0, 3).map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={art.image_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'}
                        alt={art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatUrduDate(art.published_at || art.created_at)}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 font-nastaleeq leading-snug">
                        <Link href={`/articles/${art.slug}`}>
                          {art.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {art.summary || art.content.slice(0, 120)}...
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/articles/${art.slug}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-colors"
                    >
                      <span>تفصیل پڑھیں</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. کیٹیگری بلاکس: صحت و میڈیکل، ٹیکنالوجی، کھیل */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* صحت و طبی رہنمائی */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-xl text-slate-900 font-nastaleeq">
                  صحت و میڈیکل ریسرچ
                </h3>
              </div>
              <Link href="/category/health" className="text-xs text-rose-600 font-bold hover:underline">
                تمام دیکھیں
              </Link>
            </div>
            <div className="space-y-4">
              {healthArticles.length > 0 ? (
                healthArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    className="block group space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="font-bold text-sm text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {art.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatUrduDate(art.published_at || art.created_at)}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-400">مضامین لوڈ ہو رہے ہیں...</p>
              )}
            </div>
          </div>

          {/* سائنس و ٹیکنالوجی */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-xl text-slate-900 font-nastaleeq">
                  سائنس و ٹیکنالوجی
                </h3>
              </div>
              <Link href="/category/technology" className="text-xs text-blue-600 font-bold hover:underline">
                تمام دیکھیں
              </Link>
            </div>
            <div className="space-y-4">
              {techArticles.length > 0 ? (
                techArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    className="block group space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {art.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatUrduDate(art.published_at || art.created_at)}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-400">مضامین لوڈ ہو رہے ہیں...</p>
              )}
            </div>
          </div>

          {/* کھیل و کرکٹ */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-xl text-slate-900 font-nastaleeq">
                  کھیل و کرکٹ
                </h3>
              </div>
              <Link href="/category/sports" className="text-xs text-amber-600 font-bold hover:underline">
                تمام دیکھیں
              </Link>
            </div>
            <div className="space-y-4">
              {sportsArticles.length > 0 ? (
                sportsArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    className="block group space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="font-bold text-sm text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {art.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatUrduDate(art.published_at || art.created_at)}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-400">مضامین لوڈ ہو رہے ہیں...</p>
              )}
            </div>
          </div>
        </div>

        {/* 6. پورٹل خدمات کوئیک لنکس */}
        <section className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-nastaleeq">
              دسترس کی عوامی، تعلیمی و عالمی خدمات
            </h2>
            <p className="text-sm text-emerald-200">
              پاکستان، آزاد کشمیر اور دنیا بھر کے قارئین کے لیے باوثوق خبریں، ڈائریکٹریز اور معلوماتی خدمات
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <Link
              href="/directory"
              className="p-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-nastaleeq">رابطہ ڈائریکٹری</h3>
                <p className="text-xs text-slate-300 mt-1">تھانے، ہسپتال اور سرکاری دفاتر کے فون نمبرز</p>
              </div>
            </Link>

            <Link
              href="/admissions"
              className="p-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-nastaleeq">جامعات و داخلے</h3>
                <p className="text-xs text-slate-300 mt-1">پاکستانی یونیورسٹیوں میں تازہ ترین داخلہ اشتہارات</p>
              </div>
            </Link>

            <Link
              href="/newspapers"
              className="p-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <NewspaperIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-nastaleeq">قومی اخبارات</h3>
                <p className="text-xs text-slate-300 mt-1">جنگ، نوائے وقت، ایکسپریس اور ڈان کے ای پیپرز</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
