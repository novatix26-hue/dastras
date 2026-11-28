import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import { getLivePetrolPrices } from '@/lib/api/petrol';

export const metadata: Metadata = {
  title: 'دسترس | پاکستان، آزاد کشمیر اور دنیا بھر کی تازہ ترین خبریں و معلومات',
  description: 'پاکستان، آزاد جموں و کشمیر اور دنیا بھر کی بریکنگ نیوز، سیاست، کھیل، صحت، سائنس و ٹیکنالوجی، موبائل ریٹس، لائیو پٹرول قیمتیں، موسم اور اوقاتِ نماز کا مصدقہ اردو پلیٹ فارم۔',
  keywords: ['دسترس', 'اردو خبریں', 'پاکستان نیوز', 'آزاد کشمیر', 'عالمی خبریں', 'موبائل ریٹس', 'پٹرول ریٹس', 'موسم پاکستان', 'اوقات نماز'],
  authors: [{ name: 'دسترس ٹیم' }],
  metadataBase: new URL('https://dastaras.pk'),
  openGraph: {
    title: 'دسترس - پاکستان، آزاد کشمیر اور دنیا بھر کا معتبر اردو نیٹ ورک',
    description: 'پاکستان، آزاد جموں و کشمیر اور دنیا بھر سے لمحہ بہ لمحہ باوثوق بریکنگ نیوز، موبائل فون ریٹس اور لائیو یوٹیلیٹیز',
    type: 'website',
    locale: 'ur_PK',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const petrolData = await getLivePetrolPrices();
  const petrolPrice = petrolData?.items.find((i) => i.id === 'petrol')?.pricePerLiter || 312;
  const dieselPrice = petrolData?.items.find((i) => i.id === 'diesel')?.pricePerLiter || 346;

  return (
    <html lang="ur" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX'} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX'}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-urdu-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
        <ToastProvider>
          <TopBar initialPetrolPrice={petrolPrice} initialDieselPrice={dieselPrice} />
          <Navbar petrolPrice={petrolPrice} />
          <main className="flex-1 pb-16">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
