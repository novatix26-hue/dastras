const { createClient } = require('@supabase/supabase-js');
const xml2js = require('xml2js');

const url = 'https://xplbrohvzkruroghomaq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbGJyb2h2emtydXJvZ2hvbWFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjg5NTEwNywiZXhwIjoyMTA4NDcxMTA3fQ.Nl07HN_5knS_GJ3Uc51svp2nbcP29uB0JsqQ6rf9-WM';
const supabase = createClient(url, key);

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') + '-' + Math.floor(1000 + Math.random() * 9000);
}

function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim();
}

const FEEDS = [
  {
    category: 'pakistan',
    urduCat: 'پاکستان',
    name: 'ایکسپریس پاکستان',
    url: 'https://www.express.pk/feed/',
    img: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    isBreaking: true
  },
  {
    category: 'azad-kashmir',
    urduCat: 'آزاد کشمیر',
    name: 'گوگل نیوز آزاد کشمیر',
    url: 'https://news.google.com/rss/search?q=%D8%A2%D8%B2%D8%A7%D8%AF+%DA%A9%D8%B4%D9%85%DB%8C%D8%B1&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    isBreaking: true
  },
  {
    category: 'international',
    urduCat: 'عالمی',
    name: 'عالمی خبریں',
    url: 'https://news.google.com/rss/search?q=%D8%B9%D8%A7%D9%84%D9%85%DB%8C+%D8%AE%D8%A8%D8%B1%DB%8C%DA%BA+when:24h&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    isBreaking: true
  },
  {
    category: 'business',
    urduCat: 'کاروبار',
    name: 'معیشت و کاروبار',
    url: 'https://news.google.com/rss/search?q=%D9%BE%D8%A7%DA%A9%D8%B3%D8%AA%D8%A7%D9%86+%D9%85%D8%B9%DB%8C%D8%B4%D8%AA+%DA%A9%D8%A7%D8%B1%D9%88%D8%A8%D8%A7%D8%B1+when:24h&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'sports',
    urduCat: 'کھیل',
    name: 'کھیل و کرکٹ',
    url: 'https://news.google.com/rss/search?q=%DA%A9%DA%BE%DB%8C%D9%84+%DA%A9%D8%B1%DA%A9%D9%B5+when:24h&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1200&q=80'
  }
];

async function run() {
  console.log('Fetching live real-time news from verified RSS feeds...');
  let savedCount = 0;

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        redirect: 'follow'
      });
      if (!res.ok) continue;

      const xml = await res.text();
      const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });
      const items = parsed?.rss?.channel?.item;
      if (!items) continue;

      const list = Array.isArray(items) ? items : [items];

      for (const item of list.slice(0, 4)) {
        const title = stripHtml(item.title || '');
        const link = item.link || item.guid?._ || item.guid;
        if (!title || !link) continue;

        // Check if exists
        const { data: exists } = await supabase
          .from('articles')
          .select('id')
          .eq('source_url', link)
          .maybeSingle();

        if (exists) continue;

        const snippet = stripHtml(item.description || title);
        const slug = slugify(title);
        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

        const fullContent = `${title}

${snippet}

متعلقہ ذرائع اور نیوز ڈیسک کے مطابق اس اہم پیش رفت پر تفصیلی رپورٹ جاری کر دی گئی ہے۔ متعلقہ حکام کا کہنا ہے کہ تمام متعلقہ معاملات کا باریک بینی سے جائزہ لیا جا رہا ہے تاکہ حقائق قارئین کے سامنے لائے جا سکیں۔

مزید تازہ ترین تفصیلات موصول ہوتے ہی پورٹل پر فوری طور پر اپڈیٹ کر دی جائیں گی۔`;

        const { error } = await supabase.from('articles').insert({
          title,
          slug,
          summary: snippet.slice(0, 200) + '...',
          content: fullContent,
          category: feed.category,
          image_url: feed.img,
          source_name: feed.name,
          source_url: link,
          meta_description: `${title}۔ ${feed.urduCat} کی تازہ ترین باوثوق خبریں اور تفصیلات۔`,
          keywords: [feed.urduCat, 'پاکستان', 'بریکنگ نیوز', 'دسترس'],
          published_at: pubDate,
          created_at: pubDate,
          is_breaking: feed.isBreaking ?? false,
          author_name: feed.name || 'دسترس نیوز ڈیسک',
          status: 'approved'
        });

        if (!error) {
          savedCount++;
          console.log(`[${feed.urduCat}] محفوظ: ${title.slice(0, 50)}...`);
        }
      }
    } catch (e) {
      console.error(`Feed error (${feed.name}):`, e.message);
    }
  }

  console.log(`\nمجموعی طور پر ${savedCount} نئی اور تازہ ترین خبریں Supabase میں محفوظ ہو گئیں۔`);
}

run().catch(console.error);
