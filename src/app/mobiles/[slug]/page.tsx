import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMobileBySlug, getMobiles } from '@/lib/supabaseClient';
import { 
  Smartphone, 
  Cpu, 
  Battery, 
  Camera, 
  HardDrive, 
  Monitor, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import MobileCard from '@/components/MobileCard';

interface MobileDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: MobileDetailPageProps): Promise<Metadata> {
  const mobile = await getMobileBySlug(params.slug);
  if (!mobile) {
    return {
      title: 'موبائل ماڈل نہیں ملا | دسترس',
      description: 'مطلوبہ موبائل فون کا صفحہ موجود نہیں ہے۔',
    };
  }

  const formattedPrice = new Intl.NumberFormat('ur-PK').format(mobile.price_pkr);
  const title = `${mobile.brand} ${mobile.model_name} کی قیمت اور تفصیلات پاکستان میں | دسترس`;
  const description = `${mobile.brand} ${mobile.model_name} کی پاکستان میں تازہ ترین قیمت روپے ${formattedPrice} ہے۔ ریم: ${mobile.ram || 'دستیاب'}، میموری: ${mobile.storage || 'دستیاب'}، کیمرہ: ${mobile.camera || 'دستیاب'}، بیٹری: ${mobile.battery || 'دستیاب'}۔`;

  return {
    title,
    description,
    keywords: [mobile.brand, mobile.model_name, `${mobile.brand} price in Pakistan`, 'موبائل ریٹس', 'دسترس'],
    openGraph: {
      title,
      description,
      images: mobile.image_url ? [{ url: mobile.image_url }] : [],
    },
  };
}

export const revalidate = 120; // 2 منٹ کیشنگ

export default async function MobileDetailPage({ params }: MobileDetailPageProps) {
  const mobile = await getMobileBySlug(params.slug);
  if (!mobile) {
    notFound();
  }

  const relatedMobiles = await getMobiles({ brand: mobile.brand });
  const otherModels = relatedMobiles.filter((m) => m.id !== mobile.id).slice(0, 4);

  const formattedPrice = new Intl.NumberFormat('ur-PK').format(mobile.price_pkr);
  const fallbackImage = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';

  // Product JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${mobile.brand} ${mobile.model_name}`,
    image: mobile.image_url || fallbackImage,
    description: `${mobile.brand} ${mobile.model_name} smartphone price and specifications in Pakistan.`,
    brand: {
      '@type': 'Brand',
      name: mobile.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: mobile.price_pkr,
      availability: 'https://schema.org/InStock',
      url: `https://dastaras.pk/mobiles/${mobile.slug}`,
    },
  };

  const specs = [
    { label: 'برانڈ', value: mobile.brand, icon: Smartphone },
    { label: 'ماڈل کا نام', value: mobile.model_name, icon: Smartphone },
    { label: 'ریم (RAM)', value: mobile.ram || 'معلومات دستیاب نہیں', icon: Cpu },
    { label: 'میموری (Storage)', value: mobile.storage || 'معلومات دستیاب نہیں', icon: HardDrive },
    { label: 'مین کیمرہ (Camera)', value: mobile.camera || 'معلومات دستیاب نہیں', icon: Camera },
    { label: 'بیٹری و چارجنگ', value: mobile.battery || 'معلومات دستیاب نہیں', icon: Battery },
    { label: 'ڈسپلے سائز و اسکرین', value: mobile.display || 'معلومات دستیاب نہیں', icon: Monitor },
    { label: 'پروسیسر (Chipset)', value: mobile.processor || 'معلومات دستیاب نہیں', icon: Cpu },
    { label: 'لانچ کی تاریخ', value: mobile.launch_date || 'حالیہ لانچ', icon: Calendar },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-urdu-sans">
        {/* بریڈکرمب */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700">ہوم</Link>
          <span>/</span>
          <Link href="/mobiles" className="hover:text-emerald-700">موبائل فونز</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">{mobile.brand} {mobile.model_name}</span>
        </div>

        {/* مین پروڈکٹ کارڈ */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* فوٹو */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-8 flex items-center justify-center relative min-h-[350px] border border-slate-100">
            <div className="relative w-full h-80">
              <Image
                src={mobile.image_url || fallbackImage}
                alt={`${mobile.brand} ${mobile.model_name}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain"
              />
            </div>
            {mobile.is_featured && (
              <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                نمایاں ماڈل
              </span>
            )}
          </div>

          {/* ٹائٹل و قیمت اور سمری */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                {mobile.brand} اسمارٹ فون
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-nastaleeq mt-3">
                {mobile.brand} {mobile.model_name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-emerald-600 mt-2 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>پاکستان میں مصدقہ آفیشل و مارکیٹ ریٹ</span>
              </div>
            </div>

            {/* قیمت کا بینر */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">موجودہ قیمت (پاکستان):</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 mt-1">
                  روپے {formattedPrice}
                </div>
              </div>
              <div className="text-xs text-slate-300 bg-white/10 p-3 rounded-xl border border-white/10 sm:max-w-xs">
                قیمتیں اوپن مارکیٹ اور آفیشل ڈسٹری بیوٹرز کے مطابق ہیں اور روزانہ تصدیق کی جاتی ہیں۔
              </div>
            </div>

            {/* فوری خصوصیات کی سمری */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Cpu className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs text-slate-500">ریم</div>
                <div className="font-bold text-sm text-slate-800">{mobile.ram || '—'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <HardDrive className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs text-slate-500">میموری</div>
                <div className="font-bold text-sm text-slate-800">{mobile.storage || '—'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Camera className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs text-slate-500">کیمرہ</div>
                <div className="font-bold text-xs text-slate-800 truncate">{mobile.camera || '—'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Battery className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs text-slate-500">بیٹری</div>
                <div className="font-bold text-xs text-slate-800 truncate">{mobile.battery || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* تفصیلی خصوصیات کا ٹیبل */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-nastaleeq">
            {mobile.brand} {mobile.model_name} کی مکمل تکنیکی خصوصیات (Specifications)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <tbody className="divide-y divide-slate-100">
                {specs.map((s) => {
                  const Icon = s.icon;
                  return (
                    <tr key={s.label} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-600 w-1/3 flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{s.label}</span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900">
                        {s.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* اسی برانڈ کے دیگر موبائلز */}
        {otherModels.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq">
                {mobile.brand} کے دیگر ماڈلز
              </h2>
              <Link
                href={`/mobiles?brand=${mobile.brand}`}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>تمام دیکھیں</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {otherModels.map((m) => (
                <MobileCard key={m.id} mobile={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
