import React from 'react';
import type { Metadata } from 'next';
import { getAllSurahs } from '@/lib/api/quran';
import QuranIndexClient from './QuranIndexClient';

export const metadata: Metadata = {
  title: 'قرآن مجید آن لائن | تلاوت، اردو ترجمہ اور خوبصورت قراءت | دسترس',
  description: 'قرآن پاک کی ۱۱۴ سورتوں کی آن لائن تلاوت، واضح اعراب والا آسان قرآنی رسم الخط، مولانا فتح محمد جالندھری کا بامحاورہ اردو ترجمہ اور مشاری راشد العفاسی و دیگر قراء کی تلاوت۔',
  keywords: ['قرآن مجید', 'آن لائن تلاوت قرآن', 'قرآن اردو ترجمہ', 'سورۃ یٰسین', 'سورۃ الرحمن', 'quran urdu', 'quran recitation online'],
};

export default async function QuranPage() {
  const surahs = await getAllSurahs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <QuranIndexClient initialSurahs={surahs} />
    </div>
  );
}
