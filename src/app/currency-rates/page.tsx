import React from 'react';
import type { Metadata } from 'next';
import { getLiveCurrencyRates } from '@/lib/api/currency';
import CurrencyClientView from './CurrencyClientView';

export const revalidate = 1800; // 30 منٹ کیشنگ

export const metadata: Metadata = {
  title: 'لائیو فارن کرنسی ریٹس اور کنورٹر | ڈالر، ریال، درہم برائے پاکستانی روپیہ | دسترس',
  description: 'امریکی ڈالر (USD)، سعودی ریال (SAR)، یو اے ای درہم (AED)، برطانوی پاؤنڈ اور یورو کے لائیو اوپن مارکیٹ ریٹس اور براہِ راست پاکستانی روپیہ کنورٹر۔',
  keywords: ['ڈالر کا ریٹ', 'سعودی ریال ریٹ', 'درہم ریٹ', 'فارن کرنسی پاکستان', 'کرنسی کنورٹر'],
};

export default async function CurrencyRatesPage() {
  const currencyData = await getLiveCurrencyRates();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CurrencyClientView initialData={currencyData} />
    </div>
  );
}
