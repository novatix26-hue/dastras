import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSurahDetail, ALL_SURAHS_DATA } from '@/lib/api/quran';
import SurahReaderClient from './SurahReaderClient';

interface SurahPageProps {
  params: {
    surahId: string;
  };
}

export async function generateMetadata({ params }: SurahPageProps): Promise<Metadata> {
  const surahNumber = parseInt(params.surahId, 10);
  const meta = ALL_SURAHS_DATA.find((s) => s.number === surahNumber);

  if (!meta) {
    return {
      title: 'سورت دستیاب نہیں | قرآن مجید | دسترس',
    };
  }

  return {
    title: `${meta.urduName} آن لائن تلاوت و سلیس اردو ترجمہ | قرآن مجید | دسترس`,
    description: `${meta.urduName} (${meta.revelationTypeUrdu} سورت، ${meta.numberOfAyahs} آیات) کی آن لائن تلاوت، واضح اعراب والا آسان رسم الخط، مولانا فتح محمد جالندھری کا اردو ترجمہ اور آڈیو تلاوت۔`,
    keywords: [
      meta.urduName,
      meta.name,
      meta.englishName,
      'تلاوت قرآن',
      'قرآن اردو ترجمہ',
      'quran recitation',
    ],
  };
}

export default async function SurahPage({ params }: SurahPageProps) {
  const surahNumber = parseInt(params.surahId, 10);

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound();
  }

  const surah = await getSurahDetail(surahNumber);

  if (!surah) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <SurahReaderClient surah={surah} />
    </div>
  );
}
