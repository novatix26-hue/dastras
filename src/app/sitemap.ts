import { MetadataRoute } from 'next';
import { getArticles, getNewsArticles, getMobiles } from '@/lib/supabaseClient';

export const revalidate = 3600; // ہر 1 گھنٹے بعد سائٹ میپ خودکار تازہ ہوگا

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dastaras.pk';

  // 1. بنیادی جامد یو آر ایلز (Static Routes & Utilities)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/mobiles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/weather`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prayer-times`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/currency-rates`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/admissions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/newspapers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kids`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/petrol-prices`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. کیٹیگری یو آر ایلز (Category Routes)
  const categories = [
    'pakistan',
    'azad-kashmir',
    'international',
    'sports',
    'health',
    'technology',
    'business',
    'weird',
    'kids',
  ];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.9,
  }));

  // 3. موبائل فونز کے ڈائنامک یو آر ایلز (Mobile Product Pages)
  let mobileRoutes: MetadataRoute.Sitemap = [];
  try {
    const mobiles = await getMobiles();
    mobileRoutes = mobiles.map((mob) => ({
      url: `${baseUrl}/mobiles/${mob.slug}`,
      lastModified: mob.updated_at ? new Date(mob.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  } catch (e) {
    console.error('Error generating sitemap mobile routes:', e);
  }

  // 4. تمام مضامین و خبروں کے ڈائنامک یو آر ایلز (Articles)
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getArticles({ status: 'approved', limit: 200 });
    articleRoutes = articles.map((art) => ({
      url: `${baseUrl}/articles/${art.slug}`,
      lastModified: art.published_at ? new Date(art.published_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (e) {
    console.error('Error generating sitemap article routes:', e);
  }

  return [...staticRoutes, ...categoryRoutes, ...mobileRoutes, ...articleRoutes];
}
