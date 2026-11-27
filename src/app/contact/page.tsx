import React from 'react';
import type { Metadata } from 'next';
import ContactClientView from './ContactClientView';

export const metadata: Metadata = {
  title: 'ہم سے رابطہ (Contact Us) | دسترس',
  description: 'دسترس کے ادارتی دفتر، نیوز ڈیسک، اشتہارات اور پریس ریلیز کے لیے دفتری رابطے۔',
};

export default function ContactPage() {
  return <ContactClientView />;
}
