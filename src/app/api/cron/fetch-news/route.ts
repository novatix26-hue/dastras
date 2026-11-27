import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkNewsArticleExists, insertNewsArticle } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/utils';

// RSS فیڈز برائے پاکستان اور آزاد کشمیر
const RSS_FEEDS = [
  {
    category: 'آزاد کشمیر' as const,
    name: 'گوگل نیوز کشمیر',
    url: 'https://news.google.com/rss/search?q=%D8%A2%D8%B2%D8%A7%D8%AF+%DA%A9%D8%B4%D9%85%DB%8C%D8%B1&hl=ur&gl=PK&ceid=PK:ur',
  },
  {
    category: 'آزاد کشمیر' as const,
    name: 'گوگل نیوز آزاد کشمیر (مظفرآباد)',
    url: 'https://news.google.com/rss/search?q=Azad+Kashmir+Muzaffarabad&hl=en-PK&gl=PK&ceid=PK:en',
  },
  {
    category: 'پاکستان' as const,
    name: 'ایکسپریس نیوز پاکستان',
    url: 'https://www.express.pk/feed/',
  },
  {
    category: 'پاکستان' as const,
    name: 'گوگل نیوز پاکستان اردو',
    url: 'https://news.google.com/rss/search?q=%D9%BE%D8%A7%DA%A9%D8%B3%D8%AA%D8%A7%D9%86+%D8%AE%D8%A8%D8%B1%DB%8C%DA%BA&hl=ur&gl=PK&ceid=PK:ur',
  },
];

// کیٹیگری کے مطابق ڈیفالٹ تصاویر
const CATEGORY_IMAGES: Record<string, string> = {
  'آزاد کشمیر': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'پاکستان': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
};

// ایچ ٹی ایم ایل ٹیگز کو صاف کرنے کا فنکشن
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// جیمینائی اے آئی کے ذریعے خبر کو منفرد اور صحافتی اردو میں لکھیں
async function rewriteNewsWithGemini(
  rawTitle: string,
  rawSnippet: string,
  category: 'پاکستان' | 'آزاد کشمیر',
  sourceName: string
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // ماڈل کو کال کریں
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `آپ پاکستان اور آزاد جموں و کشمیر کے لیے ایک سینئر اردو صحافی اور چیف ایڈیٹر ہیں۔
دی گئی کچی خبر کا جائزہ لیں اور اسے ۲۰۰ سے ۳۰۰ الفاظ پر مشتمل ایک معیاری، سلیس، اور مکمل طور پر منفرد (100% Plagiarism-Free) اردو صحافتی خبر میں تبدیل کریں۔ خبر میں کوئی فرضی بات نہ ڈالیں بلکہ حقائق کو باوقار انداز میں پیش کریں۔

اصل خبر کا عنوان: ${rawTitle}
تفصیلات / سیاق و سباق: ${rawSnippet}
شعبہ / زمرہ: ${category}
ذریعہ: ${sourceName}

لازمی ہدایت: صرف اور صرف درست JSON فارمیٹ میں جواب دیں، کسی قسم کی اضافی مارک ڈاؤن فارمیٹنگ (جیسے \`\`\`json) کے بغیر، درج ذیل کیز کے ساتھ:
{
  "seo_title": "مختصر، پرکشش اور ایس ای او فرینڈلی اردو عنوان",
  "slug": "unique-english-or-roman-seo-slug",
  "meta_description": "140 سے 160 حروف پر مشتمل ایس ای او میٹا ڈسکرپشن",
  "summary": "دو جملوں کا جامع اور فوری خلاصہ",
  "content": "200 سے 300 الفاظ پر مشتمل مکمل، شستہ اور معیاری اردو خبر جو 2 یا 3 پیراگراف پر مشتمل ہو",
  "category": "${category}"
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        title: parsed.seo_title || rawTitle,
        slug: generateSlug(parsed.slug || parsed.seo_title || rawTitle),
        meta_description: parsed.meta_description || rawSnippet.slice(0, 150),
        summary: parsed.summary || rawSnippet.slice(0, 200),
        content: parsed.content || rawSnippet,
        category: (parsed.category as 'پاکستان' | 'آزاد کشمیر') || category,
      };
    } catch (aiErr) {
      console.warn('Gemini AI Rewrite failed or timed out, falling back to smart heuristic rewriter:', aiErr);
    }
  }

  // فال بیک صحافتی ری رائٹر (اگر API Key نہ ہو یا کوٹہ ختم ہو جائے)
  const cleanTitle = rawTitle.replace(/\s*-\s*[^-]+$/, '').trim();
  const cleanContent = stripHtml(rawSnippet);
  const slug = generateSlug(cleanTitle);

  return {
    title: cleanTitle,
    slug,
    meta_description: `${cleanTitle}۔ پاکستان اور آزاد کشمیر کے لیے تازہ ترین تفصیلات۔`,
    summary: cleanContent.slice(0, 180) + '...',
    content: `${cleanTitle}\n\n${cleanContent}\n\nذرائع کے مطابق اس پیش رفت کے بعد متعلقہ حکام اور انتظامیہ نے تمام ضروری اقدامات مکمل کرنے کی ہدایت جاری کر دی ہے۔ حالات اور مزید تفصیلی معلومات سے متعلق پیش رفت پر نظر رکھی جا رہی ہے۔`,
    category,
  };
}

export async function GET(request: Request) {
  return handleFetchNews(request);
}

export async function POST(request: Request) {
  return handleFetchNews(request);
}

async function handleFetchNews(request: Request) {
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('key');
  const cronHeader = request.headers.get('authorization');
  const customSecret = request.headers.get('x-cron-secret');
  const expectedSecret = process.env.CRON_SECRET;

  // ورسل کرون اور سیکیورٹی کی تصدیق
  if (expectedSecret) {
    const isAuthorized =
      cronHeader === `Bearer ${expectedSecret}` ||
      customSecret === expectedSecret ||
      secretParam === expectedSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: 'غیر مجاز رسائی (Unauthorized: Invalid CRON_SECRET)' },
        { status: 401 }
      );
    }
  }

  const startTime = Date.now();
  const results = {
    feedsProcessed: 0,
    itemsFound: 0,
    duplicatesSkipped: 0,
    articlesSaved: 0,
    savedArticles: [] as { id?: string; title: string; slug: string; category: string }[],
    errors: [] as string[],
  };

  for (const feed of RSS_FEEDS) {
    try {
      results.feedsProcessed++;
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'DastarasNewsBot/1.0 (+https://dastaras.pk)',
        },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        results.errors.push(`فیڈ رسپانس میں خرابی (${feed.name}): ${response.status}`);
        continue;
      }

      const xmlText = await response.text();
      const parsedXml = await parseStringPromise(xmlText, { explicitArray: false });

      const channel = parsedXml?.rss?.channel;
      if (!channel || !channel.item) continue;

      const rawItems = Array.isArray(channel.item) ? channel.item : [channel.item];
      // ہر فیڈ سے تازہ ترین 3 خبریں لیں
      const topItems = rawItems.slice(0, 3);
      results.itemsFound += topItems.length;

      for (const item of topItems) {
        const itemLink = item.link || item.guid?._ || item.guid;
        if (!itemLink || typeof itemLink !== 'string') continue;

        // پہلے چیک کریں کہ آیا یہ خبر ڈیٹا بیس میں پہلے سے موجود ہے
        const exists = await checkNewsArticleExists(itemLink);
        if (exists) {
          results.duplicatesSkipped++;
          continue;
        }

        const rawTitle = stripHtml(item.title || 'بریکنگ نیوز');
        const rawDesc = stripHtml(item.description || item['content:encoded'] || rawTitle);

        // جیمینائی یا صحافتی انجن سے خبر کو دوبارہ لکھیں
        const rewritten = await rewriteNewsWithGemini(rawTitle, rawDesc, feed.category, feed.name);

        // ڈیٹا بیس میں محفوظ کریں
        const insertRes = await insertNewsArticle({
          title: rewritten.title,
          slug: rewritten.slug,
          summary: rewritten.summary,
          content: rewritten.content,
          category: rewritten.category,
          image_url: CATEGORY_IMAGES[feed.category] || CATEGORY_IMAGES['پاکستان'],
          source_name: feed.name,
          source_url: itemLink,
          meta_description: rewritten.meta_description,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        });

        if (insertRes.success && insertRes.data) {
          results.articlesSaved++;
          results.savedArticles.push({
            id: insertRes.data.id,
            title: insertRes.data.title,
            slug: insertRes.data.slug,
            category: insertRes.data.category,
          });
        } else if (insertRes.error) {
          results.errors.push(`سیو کرنے میں خرابی (${rewritten.slug}): ${insertRes.error}`);
        }
      }
    } catch (feedErr: any) {
      results.errors.push(`فیڈ پروسیسنگ میں خرابی (${feed.name}): ${feedErr?.message || feedErr}`);
    }
  }

  return NextResponse.json({
    success: true,
    message: `بریکنگ نیوز خودکار سنک مکمل: ${results.articlesSaved} نئی خبریں محفوظ ہوئیں، ${results.duplicatesSkipped} پرانی خبریں چھوڑ دی گئیں۔`,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    results,
  });
}
