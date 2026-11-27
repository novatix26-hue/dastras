import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'پرائیویسی پالیسی (Privacy Policy) | دسترس',
  description: 'دسترس کی پرائیویسی پالیسی، کوکیز کے استعمال اور گوگل ایڈسینس (Google AdSense) ڈیٹا کے تحفظ کی تفصیلی معلومات۔',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-urdu-sans">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>قانونی و اخلاقی ضوابط</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-nastaleeq">
          پرائیویسی پالیسی (Privacy Policy)
        </h1>
        <p className="text-sm text-slate-500">
          آخری تجدید: نومبر 2026 | دسترس
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 leading-relaxed text-base">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-emerald-600 pr-3">
            1. تعارف و عمومی اصول
          </h2>
          <p>
            دسترس اپنے تمام قارئین، صارفین اور زائرین کی رازداری کا دل کی گہرائیوں سے احترام کرتا ہے۔ یہ پرائیویسی پالیسی وضاحت کرتی ہے کہ جب آپ ہماری ویب سائٹ استعمال کرتے ہیں تو ہم آپ کی کون سی معلومات حاصل کرتے ہیں اور ان کا تحفظ کیسے یقینی بنایا جاتا ہے۔
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-emerald-600 pr-3">
            2. گوگل ایڈسینس اور تھرڈ پارٹی اشتہارات (Google AdSense & Cookies)
          </h2>
          <p>
            ہماری ویب سائٹ پر تھرڈ پارٹی وینڈرز بشمول گوگل (Google) اشتہارات دکھانے کے لیے کوکیز (Cookies) کا استعمال کرتے ہیں۔
          </p>
          <ul className="list-disc list-inside space-y-2 pr-4 text-slate-600 text-sm">
            <li>گوگل ڈبل کلک (DoubleClick DART Cookie) کا استعمال کرتا ہے تاکہ قارئین کو ان کے سابقہ انٹرنیٹ وزٹ کی بنیاد پر متعلقہ اور محفوظ اشتہارات دکھائے جا سکیں۔</li>
            <li>صارفین گوگل کی ایڈ سیٹنگز (Google Ad Settings) پر جا کر پرسنلائزڈ اشتہارات کے لیے DART کوکی کے استعمال کو کسی بھی وقت بند (Opt-out) کر سکتے ہیں۔</li>
            <li>ہم اپنے صارفین کا کوئی بھی نجی ڈیٹا کسی بھی اشتہاری کمپنی کو فروخت نہیں کرتے۔</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-emerald-600 pr-3">
            3. لاگ فائلز اور تجزیاتی معلومات (Log Files & Analytics)
          </h2>
          <p>
            دیگر معیاری نیوز ویب سائٹس کی طرح، دسترس لاگ فائلز کا معمول کے مطابق استعمال کرتا ہے۔ ان معلومات میں انٹرنیٹ پروٹوکول (IP) ایڈریس، براؤزر کی قسم، انٹرنیٹ سروس پروائیڈر (ISP)، تاریخ اور وقت کی مہر اور وزٹ کیے جانے والے صفحات شامل ہیں۔ ان معلومات کا مقصد صرف ویب سائٹ کی کارکردگی بہتر بنانا ہے اور ان سے صارف کی ذاتی شناخت ظاہر نہیں ہوتی۔
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-emerald-600 pr-3">
            4. بچوں کے تحفظ کی پالیسی (Children Online Privacy)
          </h2>
          <p>
            دسترس 13 سال سے کم عمر بچوں سے جان بوجھ کر کوئی ذاتی معلومات اکٹھی نہیں کرتا۔ "بچوں کی دنیا" سیکشن مکمل طور پر محفوظ، اخلاقی، تعلیمی اور فلٹر شدہ کہانیوں پر مشتمل ہے۔ اگر کسی والد، والدہ یا سرپرست کو محسوس ہو کہ ان کے بچے نے کوئی ڈیٹا فراہم کیا ہے تو وہ فوری طور پر ہم سے رابطہ کریں، ہم اسے ریکارڈ سے فوری خارج کر دیں گے۔
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-emerald-600 pr-3">
            5. ہم سے رابطہ
          </h2>
          <p>
            پرائیویسی پالیسی یا ذاتی ڈیٹا سے متعلق کسی بھی سوال کے لیے آپ ہمارے قانونی سیل سے ای میل <span className="font-mono text-emerald-800 font-bold">privacy@dastaras.pk</span> کے ذریعے رابطہ کر سکتے ہیں۔
          </p>
        </section>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>صفحہ اول پر واپس جائیں</span>
        </Link>
      </div>
    </div>
  );
}
