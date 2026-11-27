import React from 'react';
import type { Metadata } from 'next';
import { getLivePrayerTimings } from '@/lib/api/prayer';
import PrayerClientView from './PrayerClientView';

export const revalidate = 1800; // 30 منٹ کیشنگ

export const metadata: Metadata = {
  title: 'اوقاتِ نماز | پاکستان اور آزاد کشمیر کے مصدقہ نماز کے اوقات | دسترس',
  description: 'جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن کراچی (حنفی طریقہ) کے مطابق اسلام آباد، مظفرآباد، لاہور، کراچی، میرپور کے فجر، طلوع، ظہر، عصر، مغرب اور عشاء کے درست اوقات۔',
  keywords: ['نماز کے اوقات', 'فجر کا وقت', 'مغرب کا وقت', 'حنفی نماز اوقات', 'اسلام آباد نماز', 'مظفرآباد اوقات نماز'],
};

export default async function PrayerTimesPage({
  searchParams,
}: {
  searchParams?: { city?: string };
}) {
  const initialCity = searchParams?.city || 'Islamabad';
  const initialData = await getLivePrayerTimings(initialCity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PrayerClientView initialCity={initialCity} initialData={initialData} />
    </div>
  );
}
