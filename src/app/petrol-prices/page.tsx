import React from 'react';
import type { Metadata } from 'next';
import { getLivePetrolPrices } from '@/lib/api/petrol';
import PetrolClientView from './PetrolClientView';

export const revalidate = 600; // 10 منٹ کیشنگ

export const metadata: Metadata = {
  title: 'پاکستان میں پٹرول اور ڈیزل کی تازہ ترین قیمتیں | اوگرا نوٹیفکیشن | دسترس',
  description: 'پاکستان اور آزاد کشمیر میں پٹرول، ہائی اسپیڈ ڈیزل، لائٹ ڈیزل، مٹی کے تیل اور ایل پی جی کے سرکاری تازہ ترین نرخ اور فیول کیلکولیٹر۔',
  keywords: ['پٹرول کی قیمت پاکستان', 'ڈیزل ریٹ', 'اوگرا نوٹیفکیشن', 'پٹرول ریٹ آج', 'fuel price pakistan'],
};

export default async function PetrolPricesPage() {
  const data = await getLivePetrolPrices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PetrolClientView initialData={data} />
    </div>
  );
}
