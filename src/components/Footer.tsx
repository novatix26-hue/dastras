import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PhoneCall, 
  ShieldAlert, 
  Heart, 
  MapPin, 
  Mail, 
  ExternalLink 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-portal-primary font-urdu-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* دسترس برانڈ تفصیل */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-32 bg-white rounded-xl p-1 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="دَستْرَس"
                  fill
                  sizes="128px"
                  className="object-contain p-1"
                />
              </div>
              <span className="text-2xl font-black text-white font-nastaleeq">پورٹل دسترس</span>
            </div>
            <p className="text-base text-slate-400 leading-relaxed">
              پاکستان اور آزاد جموں و کشمیر کے لیے معلومات، تعلیم اور سرکاری و نجی رابطوں کا معتبر ترین کثیر المقاصد اردو پورٹل۔
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400 pt-2">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>اسلام آباد، مظفرآباد، لاہور، کراچی، گلگت</span>
            </div>
          </div>

          {/* فوری روابط */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-portal-gold"></span>
              فوری روابط
            </h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  مرکزی صفحہ (ہوم)
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-emerald-400 transition-colors">
                  خبریں اور سائنسی مضامین
                </Link>
              </li>
              <li>
                <Link href="/kids" className="hover:text-emerald-400 transition-colors font-bold text-amber-300">
                  بچوں کی دنیا (آج کی کہانی)
                </Link>
              </li>
              <li>
                <Link href="/petrol-prices" className="hover:text-emerald-400 transition-colors">
                  پاکستان پٹرول و ڈیزل ریٹس
                </Link>
              </li>
              <li>
                <Link href="/category/weird" className="hover:text-emerald-400 transition-colors">
                  عجیب و دلچسپ خبریں
                </Link>
              </li>
              <li>
                <Link href="/directory" className="hover:text-emerald-400 transition-colors">
                  پاکستان و کشمیر ڈائریکٹری
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-emerald-400 transition-colors">
                  جامعات اور تازہ ترین داخلے
                </Link>
              </li>
              <li>
                <Link href="/newspapers" className="hover:text-emerald-400 transition-colors">
                  قومی روزنامے و ای پیپرز
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-emerald-400 transition-colors">
                  عوامی مضمون جمع کروائیں
                </Link>
              </li>
            </ul>
          </div>

          {/* ہنگامی ایمرجنسی نمبرز */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              اہم ہیلپ لائنز
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-300">ریسکیو ایمرجنسی</span>
                <a href="tel:1122" className="text-red-400 font-bold hover:underline">
                  1122
                </a>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-300">پولیس مدد گار</span>
                <a href="tel:15" className="text-emerald-400 font-bold hover:underline">
                  15
                </a>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-300">موٹروے پولیس ہیلپ</span>
                <a href="tel:130" className="text-amber-400 font-bold hover:underline">
                  130
                </a>
              </div>
            </div>
          </div>

          {/* رابطہ و تعاون */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-portal-gold" />
              رابطہ و شمولیت
            </h3>
            <p className="text-base text-slate-400 leading-relaxed mb-4">
              اگر آپ اپنے علاقے کا کوئی ادارہ، تھانہ یا ہسپتال شامل کروانا چاہتے ہیں تو بلا جھجھک ہم سے رابطہ کریں۔
            </p>
            <div className="flex flex-col gap-2">
              <Link 
                href="/submit" 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors border border-emerald-700"
              >
                <span>اپنا مضمون یا تجویز بھیجیں</span>
              </Link>
            </div>
          </div>
        </div>

        {/* کاپی رائٹ */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} پورٹل دسترس۔ جملہ حقوق محفوظ ہیں۔</p>
          <p className="flex items-center gap-1.5">
            <span>پاکستان اور کشمیر کے عوام کے لیے خلوص نیت کے ساتھ تیار کردہ</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
