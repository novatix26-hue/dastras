import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Info, ArrowLeft, Target, Award, Users2, Globe2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ہمارے متعلق (About Us) | ادارتی مشن و تعارف | دسترس',
  description: 'دسترس کا تعارف، صحافتی اقدار، ادارتی ٹیم اور پاکستان، آزاد کشمیر و عالمی کوریج کا مشن۔',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-urdu-sans">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
          <Info className="w-4 h-4 text-blue-700" />
          <span>ہم کون ہیں؟</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-nastaleeq">
          ہمارے متعلق (About Dastaras)
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          پاکستان، آزاد جموں و کشمیر اور دنیا بھر کے اردو قارئین کے لیے ایک غیر جانبدار، مستند اور جدید معلوماتی و نیوز نیٹ ورک
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-10 text-slate-700 leading-relaxed text-base">
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-emerald-700" />
            <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq">
              ہمارا وژن اور نصب العین
            </h2>
          </div>
          <p>
            'دسترس' کا مقصد اردو زبان میں قارئین کو جدید صحافت، سچی خبریں، عالمی حالات، سائنسی و طبی رہنمائی، بچوں کی خوبصورت اخلاقی کہانیاں اور روزمرہ کی ضروری معلومات (جیسے پٹرول ریٹس، موبائل قیمتیں، لائیو موسم اور اوقاتِ نماز) ایک ہی چھت تلے فراہم کرنا ہے۔
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Award className="w-8 h-8 text-amber-600 mb-2" />
            <h3 className="font-bold text-lg text-slate-900 font-nastaleeq">100% مستند صحافت</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ہم افواہوں اور سنسنی خیزی کے بجائے حقائق پر مبنی باوثوق خبروں کو ترجیح دیتے ہیں۔
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Globe2 className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-lg text-slate-900 font-nastaleeq">عالمی و علاقائی کوریج</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              پاکستان کے تمام صوبوں، آزاد جموں و کشمیر اور بین الاقوامی دنیا کے اہم ترین واقعات۔
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Users2 className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-bold text-lg text-slate-900 font-nastaleeq">بچوں اور خاندان کی تربیت</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              بچوں کی اخلاقی کہانیاں، والدین کے لیے رہنمائی اور معاشرتی مثبت اقدار کا فروغ۔
            </p>
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq">
            ادارتی بورڈ اور رابطہ
          </h2>
          <p>
            دسترس کی ادارتی ٹیم اسلام آباد، مظفرآباد اور لاہور میں تجربہ کار صحافیوں اور محققین پر مشتمل ہے۔ کسی بھی قسم کی تجویز، اصلاح یا معلومات کے لیے آپ <Link href="/contact" className="text-emerald-700 font-bold underline">ہم سے رابطہ</Link> صفحہ وزٹ کر سکتے ہیں۔
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
