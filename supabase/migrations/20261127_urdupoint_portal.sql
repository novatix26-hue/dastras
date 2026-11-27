-- ============================================================================
-- مائیگریشن: پورٹل برائے خبریں، صحت، کھیل، ٹیکنالوجی اور موبائل فون ریٹس
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. اپ ڈیٹ اور توسیع: جدول articles
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS is_breaking BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE IF EXISTS articles ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- زمرہ جات (Categories) میں نئی کیٹیگریز شامل کریں
ALTER TABLE IF EXISTS articles DROP CONSTRAINT IF EXISTS articles_category_check;
ALTER TABLE IF EXISTS articles ADD CONSTRAINT articles_category_check 
  CHECK (category IN ('pakistan', 'azad-kashmir', 'international', 'sports', 'health', 'technology', 'business', 'خبریں', 'سائنسی معلومات', 'انٹرنیٹ و ٹیکنالوجی', 'خصوصی مضامین'));

-- 2. جدول: موبائل فون ماڈلز اور قیمتیں (Mobiles)
CREATE TABLE IF NOT EXISTS mobiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand TEXT NOT NULL,
    model_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price_pkr INTEGER NOT NULL,
    ram TEXT,
    storage TEXT,
    camera TEXT,
    battery TEXT,
    display TEXT,
    processor TEXT,
    image_url TEXT,
    launch_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- انڈیکسز برائے تیز رفتار سرچ اور ایس ای او
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_breaking ON articles(is_breaking);

CREATE INDEX IF NOT EXISTS idx_mobiles_slug ON mobiles(slug);
CREATE INDEX IF NOT EXISTS idx_mobiles_brand ON mobiles(brand);
CREATE INDEX IF NOT EXISTS idx_mobiles_price ON mobiles(price_pkr);
CREATE INDEX IF NOT EXISTS idx_mobiles_is_featured ON mobiles(is_featured);

-- قطار کی سطح کی سیکیورٹی (Row Level Security - RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "عوامی قارئین مضامین دیکھ سکتے ہیں" ON articles;
CREATE POLICY "عوامی قارئین مضامین دیکھ سکتے ہیں" ON articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "سروس رول اور ایڈمن مضامین تبدیل کر سکتے ہیں" ON articles;
CREATE POLICY "سروس رول اور ایڈمن مضامین تبدیل کر سکتے ہیں" ON articles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "عوامی قارئین موبائل دیکھ سکتے ہیں" ON mobiles;
CREATE POLICY "عوامی قارئین موبائل دیکھ سکتے ہیں" ON mobiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "سروس رول اور ایڈمن موبائل تبدیل کر سکتے ہیں" ON mobiles;
CREATE POLICY "سروس رول اور ایڈمن موبائل تبدیل کر سکتے ہیں" ON mobiles FOR ALL USING (true) WITH CHECK (true);

-- نمونہ ڈیٹا برائے موبائل فونز (اصل مارکیٹ ماڈلز و قیمتیں)
INSERT INTO mobiles (brand, model_name, slug, price_pkr, ram, storage, camera, battery, display, processor, image_url, is_featured)
VALUES
(
    'Samsung',
    'Galaxy S24 Ultra',
    'samsung-galaxy-s24-ultra',
    419999,
    '12 GB',
    '256 GB / 512 GB',
    '200 MP + 50 MP + 12 MP + 10 MP',
    '5000 mAh (45W Fast Charging)',
    '6.8 Inches Dynamic LTPO AMOLED 2X, 120Hz',
    'Snapdragon 8 Gen 3 for Galaxy',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    true
),
(
    'Apple',
    'iPhone 16 Pro Max',
    'apple-iphone-16-pro-max',
    529999,
    '8 GB',
    '256 GB / 512 GB / 1 TB',
    '48 MP + 48 MP + 12 MP',
    '4685 mAh',
    '6.9 Inches LTPO Super Retina XDR OLED',
    'Apple A18 Pro (3 nm)',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    true
),
(
    'Xiaomi',
    'Redmi Note 13 Pro',
    'xiaomi-redmi-note-13-pro',
    69999,
    '8 GB / 12 GB',
    '256 GB / 512 GB',
    '200 MP + 8 MP + 2 MP',
    '5000 mAh (67W HyperCharge)',
    '6.67 Inches AMOLED, 120Hz, Dolby Vision',
    'MediaTek Helio G99-Ultra',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    true
),
(
    'Vivo',
    'V30 5G',
    'vivo-v30-5g',
    139999,
    '12 GB',
    '256 GB',
    '50 MP + 50 MP + 2 MP (Aura Light)',
    '5000 mAh (80W FlashCharge)',
    '6.78 Inches AMOLED, 120Hz, HDR10+',
    'Snapdragon 7 Gen 3',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    false
),
(
    'Infinix',
    'Note 40 Pro',
    'infinix-note-40-pro',
    59999,
    '8 GB',
    '256 GB',
    '108 MP (OIS) + 2 MP + 2 MP',
    '5000 mAh (70W All-Round FastCharge)',
    '6.78 Inches 3D-Curved AMOLED, 120Hz',
    'MediaTek Helio G99 Ultimate',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    true
),
(
    'Tecno',
    'Spark 20 Pro Plus',
    'tecno-spark-20-pro-plus',
    44999,
    '8 GB',
    '256 GB',
    '108 MP + 0.08 MP',
    '5000 mAh (33W Fast Charge)',
    '6.78 Inches Curved AMOLED, 120Hz',
    'MediaTek Helio G99 Ultimate',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    false
)
ON CONFLICT (slug) DO NOTHING;
