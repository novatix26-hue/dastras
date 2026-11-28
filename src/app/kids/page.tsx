import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from '@/lib/supabaseClient';
import KidsClientView from './KidsClientView';

export const metadata: Metadata = {
  title: 'بچوں کی دنیا | روزانہ خوبصورت، سبق آموز کہانیاں اور تصویری جھلکیاں | دسترس',
  description: 'بچوں کے لیے روزانہ کی خوبصورت، دلچسپ اور سبق آموز اخلاقی کہانیاں، تصویری جھلکیاں، اخلاقی اسباق اور بچوں کے معلوماتی مضامین۔',
  keywords: [
    'بچوں کی کہانیاں',
    'آج کی کہانی',
    'سبق آموز کہانیاں',
    'اخلاقی کہانیاں',
    'بچوں کی دنیا',
    'اردو کہانیاں',
    'تصویری کہانیاں',
    'دسترس'
  ],
};

export const dynamic = 'force-dynamic';
export const revalidate = 0; // لائیو اور تاریخ بدلتے ہی فوری رینڈرنگ

export default async function KidsPage() {
  const stories = await getArticles({
    category: 'kids',
    limit: 30,
    status: 'approved',
  });

  return <KidsClientView initialStories={stories} />;
}
