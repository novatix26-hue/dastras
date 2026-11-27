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
    category: 'health',
    urduCat: 'صحت',
    name: 'طبی و صحت رہنمائی',
    url: 'https://news.google.com/rss/search?q=%D8%B5%D8%AD%D8%AA+%D8%B7%D8%A8&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'technology',
    urduCat: 'ٹیکنالوجی',
    name: 'سائنس و ٹیکنالوجی',
    url: 'https://news.google.com/rss/search?q=%D9%B9%DB%8C%DA%A9%D9%86%D8%A7%D9%84%D9%88%D8%AC%DB%8C+%D8%B3%D8%A7%D8%A6%D9%86%D8%B3&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'sports',
    urduCat: 'کھیل',
    name: 'کھیل و کرکٹ',
    url: 'https://news.google.com/rss/search?q=%DA%A9%DA%BE%DB%8C%D9%84+%DA%A9%D8%B1%DA%A9%D9%B5&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'business',
    urduCat: 'کاروبار',
    name: 'معیشت و کاروبار',
    url: 'https://news.google.com/rss/search?q=%DA%A9%D8%A7%D8%B1%D9%88%D8%A8%D8%A7%D8%B1+%D9%85%D8%B9%DB%8C%D8%B4%D8%AA&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'weird',
    urduCat: 'عجیب و دلچسپ',
    name: 'عجیب و دلچسپ خبریں',
    url: 'https://news.google.com/rss/search?q=%D8%B9%D8%AC%DB%8C%D8%A8+%D9%88+%D8%BA%D8%B1%DB%8C%D8%A8&hl=ur&gl=PK&ceid=PK:ur',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
  }
];

async function run() {
  let savedCount = 0;
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        redirect: 'follow'
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });
      const items = parsed?.rss?.channel?.item;
      if (!items) continue;
      const list = Array.isArray(items) ? items : [items];
      
      for (const item of list.slice(0, 3)) {
        const title = stripHtml(item.title || '');
        const link = item.link || item.guid?._ || item.guid;
        const desc = stripHtml(item.description || title);
        if (!title || !link) continue;

        // check exists
        const { data: exist } = await supabase.from('articles').select('id').eq('source_url', link).limit(1);
        if (exist && exist.length > 0) continue;

        const slug = slugify(title);
        const content = `${title}\n\n${desc}\n\nاس پیش رفت کے حوالے سے مزید حقائق اور تصدیق شدہ تفصیلات سامنے آنے پر قارئین کو آگاہ رکھا جائے گا۔ متعلقہ انتظامیہ اور شعبہ جات کی جانب سے صورتحال کا بغور جائزہ لیا جا رہا ہے تاکہ عوام الناس کو بروقت معلومات فراہم کی جا سکیں۔`;

        const { data, error } = await supabase.from('articles').upsert({
          title,
          slug,
          author_name: feed.name,
          category: feed.category,
          image_url: feed.img,
          summary: desc.slice(0, 180) + '...',
          content,
          status: 'approved',
          source_name: feed.name,
          source_url: link,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          is_breaking: feed.isBreaking || false
        }, { onConflict: 'slug' }).select();

        if (!error && data) {
          savedCount++;
          console.log(`[${feed.urduCat}] محفوظ: ${title.slice(0, 35)}...`);
        } else if (error) {
          console.error('Save error:', error.message);
        }
      }
    } catch (e) {
      console.error(feed.name, e.message);
    }
  }
  console.log(`مجموعی طور پر ${savedCount} نئے مضامین اور خبریں کامیابی سے Supabase میں محفوظ ہو گئیں۔`);
}

run();
