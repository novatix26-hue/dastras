import React from 'react';
import type { Metadata } from 'next';
import { getMobiles } from '@/lib/supabaseClient';
import MobilesClientView from './MobilesClientView';

export const revalidate = 120; // 2 منٹ کیشنگ

export const metadata: Metadata = {
  title: 'موبائل فونز کی تازہ ترین قیمتیں اور ماڈلز پاکستان میں | دسترس',
  description: 'سام سنگ، ایپل آئی فون، شیاؤمی، ویوو، اوپو، انفینکس، ٹیکنو اور ریئل می کے تمام اسمارٹ فونز کی مصدقہ مارکیٹ قیمتیں اور تفصیلی تکنیکی خصوصیات۔',
  keywords: ['موبائل فون قیمت پاکستان', 'سام سنگ موبائل ریٹ', 'آئی فون قیمت', 'شیاؤمی قیمت', 'موبائل ریٹس دسترس'],
};

export default async function MobilesPage({
  searchParams,
}: {
  searchParams?: { brand?: string; search?: string };
}) {
  const brand = searchParams?.brand;
  const search = searchParams?.search;

  const mobiles = await getMobiles({
    brand: brand === 'All' || brand === 'تمام' ? undefined : brand,
    search,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <MobilesClientView initialMobiles={mobiles} initialBrand={brand || 'تمام'} />
    </div>
  );
}
