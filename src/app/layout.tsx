import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'دسترس پورٹل | پاکستان اور آزاد کشمیر کا سب سے بڑا اردو نیوز و انفارمیشن پورٹل',
  description: 'پاکستان اور آزاد جموں و کشمیر کی بریکنگ نیوز، سیاست، کھیل، صحت، سائنس و ٹیکنالوجی، موبائل ریٹس، لائیو موسم اور اوقاتِ نماز کا مصدقہ اردو پلیٹ فارم۔',
  keywords: ['دسترس', 'اردو پورٹل', 'پاکستان نیوز', 'آزاد کشمیر', 'موبائل ریٹس', 'موسم پاکستان', 'اوقات نماز', 'اردو پوائنٹ'],
  authors: [{ name: 'دسترس ٹیم' }],
  metadataBase: new URL('https://dastaras.pk'),
  openGraph: {
    title: 'دسترس پورٹل - پاکستان اور آزاد کشمیر کا معتبر اردو پورٹل',
    description: 'پاکستان اور آزاد جموں و کشمیر سے لمحہ بہ لمحہ باوثوق بریکنگ نیوز، موبائل فون ریٹس اور لائیو یوٹیلیٹیز',
    type: 'website',
    locale: 'ur_PK',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ur" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-urdu-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
        <ToastProvider>
          <TopBar />
          <Navbar />
          <main className="flex-1 pb-16">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
