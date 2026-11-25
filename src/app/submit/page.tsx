'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitArticle } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/utils';
import { ArticleCategory } from '@/lib/types';
import { useToast } from '@/components/Toast';
import { 
  PenTool, 
  CheckCircle2, 
  Send, 
  FileText, 
  Image as ImageIcon, 
  User, 
  Tag, 
  Eye, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CATEGORIES: ArticleCategory[] = [
  'خبریں',
  'سائنسی معلومات',
  'انٹرنیٹ و ٹیکنالوجی',
  'خصوصی مضامین',
];

export default function SubmitArticlePage() {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('سائنسی معلومات');
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !authorName.trim() || !content.trim()) {
      showToast('برائے مہربانی عنوان، مصنف کا نام اور مکمل مضمون درج کریں!', 'error');
      return;
    }

    setLoading(true);

    try {
      const slug = generateSlug(title);
      const res = await submitArticle({
        title: title.trim(),
        slug,
        author_name: authorName.trim(),
        category,
        image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
        summary: summary.trim() || content.trim().slice(0, 140) + '...',
        content: content.trim(),
      });

      if (res.success) {
        setIsSubmitted(true);
        showToast(res.message, 'success');
      } else {
        showToast('مضمون جمع کروانے میں دشواری ہوئی۔ دوبارہ کوشش کریں۔', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('سرور سے رابطہ نہ ہو سکا۔ برائے مہربانی دوبارہ کوشش کریں۔', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setAuthorName('');
    setImageUrl('');
    setSummary('');
    setContent('');
    setIsSubmitted(false);
    setPreviewMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ہیڈر */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-portal-primary font-bold text-sm border border-emerald-200">
          <PenTool className="w-4 h-4" />
          <span>عوامی قلم کار پورٹل</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-portal-slate">
          اپنا مضمون یا علمی تحقیق ارسال کریں
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          دسترس پر پاکستان، کشمیر اور دنیا بھر کے اردو قارئین کے لیے اپنی تحریر شائع کروائیں۔
        </p>
      </div>

      {/* اگر مضمون جمع ہو چکا ہو تو اردو تصدیق نامہ دکھائیں */}
      {isSubmitted ? (
        <div className="portal-card p-10 sm:p-14 bg-white text-center space-y-6 border-2 border-emerald-500 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-portal-slate">
              آپ کا مضمون موصول ہو گیا ہے!
            </h2>
            <p className="text-xl text-emerald-800 font-semibold max-w-xl mx-auto leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              آپ کا مضمون موصول ہو گیا ہے، ایڈمن کی منظوری کے بعد شائع کر دیا جائے گا۔
            </p>
            <p className="text-slate-500 text-base">
              معیار کی جانچ اور تصدیق کے بعد تحریر لائیو کر دی جائے گی۔
            </p>
          </div>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-portal-primary text-white font-bold text-lg hover:bg-portal-primaryHover transition-colors shadow-sm"
            >
              ایک اور مضمون لکھیں
            </button>
            <Link
              href="/articles"
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-lg hover:bg-slate-200 transition-colors"
            >
              دیگر مضامین پڑھیں
            </Link>
          </div>
        </div>
      ) : (
        <div className="portal-card p-6 sm:p-10 bg-white shadow-md border border-slate-200">
          {/* موڈ ٹوگل (لکھیں / پیش نظارہ) */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <span className="text-base font-bold text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              مضمون کا فارم
            </span>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'فارم پر واپس جائیں' : 'پیش نظارہ (Preview)'}</span>
            </button>
          </div>

          {previewMode ? (
            /* لائیو پریویو موڈ */
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-sm font-semibold">
                یہ صرف ایک پیش نظارہ ہے کہ آپ کا مضمون شائع ہونے کے بعد کیسا نظر آئے گا۔
              </div>
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-sm font-bold">
                  {category}
                </span>
                <h2 className="text-3xl font-extrabold text-portal-slate">
                  {title || 'مضمون کا عنوان یہاں ظاہر ہوگا'}
                </h2>
                <div className="text-sm text-slate-500">
                  مصنف: {authorName || 'آپ کا نام'}
                </div>
              </div>
              {summary && (
                <div className="p-4 bg-slate-50 rounded-xl border-r-4 border-portal-gold text-lg">
                  {summary}
                </div>
              )}
              <div className="text-xl text-slate-800 leading-loose whitespace-pre-line font-nastaleeq">
                {content || 'مکمل مضمون کا متن یہاں ظاہر ہوگا۔'}
              </div>
            </div>
          ) : (
            /* ان پٹ فارم */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* عنوان */}
              <div className="space-y-2">
                <label className="block text-lg font-bold text-portal-slate">
                  مضمون کا عنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: مصنوعی ذہانت اور ہمارے طلبہ کا مستقبل..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-portal-primary focus:ring-2 focus:ring-emerald-500/20 text-xl font-nastaleeq focus:outline-none"
                />
              </div>

              {/* مصنف کا نام اور کیٹیگری */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-lg font-bold text-portal-slate flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    مصنف کا نام <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="اپنا مکمل نام درج کریں"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-lg font-nastaleeq"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-lg font-bold text-portal-slate flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    زمرہ (کیٹیگری) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-lg font-nastaleeq bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* تصویر کا لنک (اختیاری) */}
              <div className="space-y-2">
                <label className="block text-lg font-bold text-portal-slate flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  تصویر کا ویب لنک (اختیاری)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg (خالی چھوڑنے پر خودکار تصویر لگ جائے گی)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-base"
                  dir="ltr"
                />
              </div>

              {/* مختصر خلاصہ */}
              <div className="space-y-2">
                <label className="block text-lg font-bold text-portal-slate">
                  مختصر خلاصہ (تعارف)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="ایک سے دو جملوں میں مضمون کا مرکزی خیال بیان کریں..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-portal-primary focus:outline-none text-lg font-nastaleeq"
                />
              </div>

              {/* مکمل مضمون */}
              <div className="space-y-2">
                <label className="block text-lg font-bold text-portal-slate">
                  مکمل مضمون یا تحریر <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اپنا مکمل مضمون یہاں تحریر کریں..."
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-portal-primary focus:ring-2 focus:ring-emerald-500/20 text-xl leading-loose font-nastaleeq focus:outline-none"
                />
              </div>

              {/* سبمٹ بٹن */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  ارسال کرنے کے بعد مضمون ایڈمن کے جائزہ میں جائے گا۔
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-portal-primary hover:bg-portal-primaryHover text-white font-extrabold text-xl shadow-md transition-all disabled:opacity-50 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                  <span>{loading ? 'ارسال ہو رہا ہے...' : 'مضمون جمع کروائیں'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
