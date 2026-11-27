import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileCheck, ArrowLeft, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'شرائط و ضوابط (Terms of Service) | دسترس',
  description: 'دسترس کے استعمال کی قانونی شرائط، کاپی رائٹ اور ادارتی ضوابط۔',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-urdu-sans">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
          <FileCheck className="w-4 h-4 text-amber-700" />
          <span>معاہدہ استعمال</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-nastaleeq">
          شرائط و ضوابط (Terms of Service)
        </h1>
        <p className="text-sm text-slate-500">
          آخری تجدید: نومبر 2026 | دسترس
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 leading-relaxed text-base">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-amber-600 pr-3">
            1. شرائط کی قبولیت
          </h2>
          <p>
            ویب سائٹ 'دسترس' کو وزٹ کرنے، پڑھنے یا اس کی خدمات استعمال کرنے کی صورت میں آپ ان شرائط و ضوابط کے پابند سمجھے جائیں گے۔ اگر آپ ان شرائط سے متفق نہیں ہیں تو برائے مہربانی ویب سائٹ کا استعمال ترک کر دیں۔
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-amber-600 pr-3">
            2. کاپی رائٹ اور مواد کی ملکیت
          </h2>
          <p>
            دسترس پر شائع ہونے والا تمام تحریری مواد، صحافتی رپورٹس، گرافکس، لوگو اور ڈیٹابیس کاپی رائٹ قوانین کے تحت محفوظ ہیں۔ کسی بھی تحریر کو بغیر پیشگی اجازت یا کریڈٹ کے مکمل طور پر کاپی یا چوری کرنا قانوناً ممنوع ہے۔
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-amber-600 pr-3">
            3. عمومی ڈس کلیمر (General Disclaimer)
          </h2>
          <p>
            پورٹل پر فراہم کردہ خبریں، مضامین، پٹرول کی قیمتیں، موسم کا حال، کرنسی ریٹس اور اوقاتِ نماز مصدقہ سرکاری اور عوامی ذرائع سے حاصل کیے جاتے ہیں۔ تاہم بازار میں فوری رد و بدل یا کسی تکنیکی تاخیر کی صورت میں قارئین متعلقہ سرکاری محکموں سے حتمی توثیق کا مشورہ دیا جاتا ہے۔
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 font-nastaleeq border-r-4 border-amber-600 pr-3">
            4. قانونی دائرہ اختیار
          </h2>
          <p>
            یہ تمام شرائط اسلامی جمہوریہ پاکستان کے مروجہ قوانین اور سائبر کرائم ایکٹ کے ماتحت ہیں۔
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
