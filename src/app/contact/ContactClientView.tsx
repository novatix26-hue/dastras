'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ContactClientView() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-urdu-sans">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
          <MessageSquare className="w-4 h-4 text-emerald-700" />
          <span>رابطہ ڈیسک</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-nastaleeq">
          ہم سے رابطہ کریں (Contact Us)
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          نیوز ڈیسک، پریس ریلیزز، اشتہارات یا کسی بھی تجاویز کے لیے ہماری ٹیم ہمہ وقت حاضر ہے۔
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg font-nastaleeq text-slate-900">ای میل</h3>
          <p className="text-xs text-slate-500">ادارتی و کاروباری رابطے</p>
          <a href="mailto:contact@dastaras.pk" className="block text-sm font-bold text-emerald-700 hover:underline dir-ltr">
            contact@dastaras.pk
          </a>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg font-nastaleeq text-slate-900">فون / واٹس ایپ</h3>
          <p className="text-xs text-slate-500">پریس ڈیسک ہیلپ لائن</p>
          <span className="block text-sm font-bold text-slate-800 dir-ltr font-mono">
            +92 (051) 111-2233
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg font-nastaleeq text-slate-900">مرکزی بیورو</h3>
          <p className="text-xs text-slate-500">اسلام آباد و مظفرآباد</p>
          <span className="block text-xs font-bold text-slate-700">
            سیکٹر F-7، اسلام آباد / لوئر پلیٹ، مظفرآباد
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold font-nastaleeq text-slate-900">
          پیغام بھیجیں
        </h2>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900 font-nastaleeq">آپ کا پیغام کامیابی سے موصول ہو گیا ہے!</h3>
            <p className="text-xs text-emerald-700">ہماری ادارتی ٹیم جلد از جلد آپ کی ای میل پر جواب ارسال کرے گی۔</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">آپ کا نام *</label>
                <input
                  type="text"
                  required
                  placeholder="محمد احمد"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ای میل ایڈریس *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">پیغام کا موضوع *</label>
              <input
                type="text"
                required
                placeholder="خبر کی نشاندہی، اشتہارات یا عام استفسار"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تفصیلی پیغام *</label>
              <textarea
                rows={4}
                required
                placeholder="اپنا پیغام یہاں تحریر کریں..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>پیغام روانہ کریں</span>
            </button>
          </form>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>صفحہ اول پر واپس جائیں</span>
        </Link>
      </div>
    </div>
  );
}
