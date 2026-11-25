import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'دسترس | پاکستان اور کشمیر کا معتبر معلوماتی و تعلیمی پورٹل',
  description: 'پاکستان اور آزاد جموں و کشمیر کے لیے خبریں، رابطہ ڈائریکٹری، جامعات، داخلہ اشتہارات اور قومی اخبارات کا مستند اردو مرکز۔',
  keywords: ['دسترس', 'پاکستان ڈائریکٹری', 'کشمیر ڈائریکٹری', 'اردو خبریں', 'پاکستانی اخبارات', 'جامعات', 'داخلے'],
  authors: [{ name: 'دسترس ٹیم' }],
  metadataBase: new URL('https://dastaras.pk'),
  openGraph: {
    title: 'دسترس - پاکستان اور کشمیر کا اسمارٹ اردو پورٹل',
    description: 'پاکستان اور کشمیر کے لیے معلومات، تعلیم اور رابطوں کا معتبر مرکز',
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
      <body className="font-nastaleeq bg-portal-bg text-portal-slate min-h-screen flex flex-col selection:bg-portal-primaryLight selection:text-portal-primary">
        <ToastProvider>
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

