import { MetadataRoute } from 'next';
import { getArticles, getNewsArticles } from '@/lib/supabaseClient';

export const revalidate = 3600; // ہر 1 گھنٹے بعد سائٹ میپ خودکار تازہ ہوگا

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dastaras.pk';

  // 1. بنیادی جامد یو آر ایلز (Static Routes)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/admissions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/newspapers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. تمام تازہ ترین بریکنگ نیوز کے ڈائنامک یو آر ایلز (Dynamic News URLs)
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const newsArticles = await getNewsArticles(undefined, 100);
    newsRoutes = newsArticles.map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: item.published_at ? new Date(item.published_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (e) {
    console.error('Error generating sitemap news routes:', e);
  }

  // 3. معلوماتی و تحقیقی مضامین کے ڈائنامک یو آر ایلز (Dynamic Article URLs)
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getArticles('approved');
    articleRoutes = articles.map((art) => ({
      url: `${baseUrl}/articles/${art.slug}`,
      lastModified: art.created_at ? new Date(art.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  } catch (e) {
    console.error('Error generating sitemap article routes:', e);
  }

  return [...staticRoutes, ...newsRoutes, ...articleRoutes];
}
