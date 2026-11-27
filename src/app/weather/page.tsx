import React from 'react';
import type { Metadata } from 'next';
import { getLiveWeather, PAKISTAN_CITIES } from '@/lib/api/weather';
import WeatherClientView from './WeatherClientView';

export const revalidate = 600; // 10 منٹ کیشنگ

export const metadata: Metadata = {
  title: 'لائیو موسم | پاکستان اور آزاد کشمیر کا 7 روزہ موسم | دسترس',
  description: 'اسلام آباد، مظفرآباد، لاہور، کراچی، میرپور، راولاکوٹ سمیت پاکستان و آزاد کشمیر کے تمام بڑے شہروں کا لائیو درجہ حرارت، نمی، ہوا اور 7 روزہ مصدقہ موسمی پیشگوئی۔',
  keywords: ['موسم پاکستان', 'موسم آزاد کشمیر', 'مظفرآباد موسم', 'اسلام آباد موسم', 'درجہ حرارت', 'بارش کی پیشگوئی'],
};

export default async function WeatherPage({
  searchParams,
}: {
  searchParams?: { city?: string };
}) {
  const initialCity = searchParams?.city || 'Islamabad';
  const initialData = await getLiveWeather(initialCity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <WeatherClientView initialCity={initialCity} initialData={initialData} />
    </div>
  );
}
