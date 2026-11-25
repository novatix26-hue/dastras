-- ============================================================================
-- پورٹل دسترس (Dastaras) - مکمل ڈیٹا بیس اسکیما برائے پاکستان اور کشمیر
-- ============================================================================

-- ایکسٹینشنز برائے UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. جدول: مضامین و خبریں (Articles)
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    author_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('خبریں', 'سائنسی معلومات', 'انٹرنیٹ و ٹیکنالوجی', 'خصوصی مضامین')),
    image_url TEXT,
    summary TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول: رابطہ ڈائریکٹری (Directory Contacts)
CREATE TABLE IF NOT EXISTS directory_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('تھانے', 'یونیورسٹیز', 'سرکاری دفاتر', 'ہسپتال و ایمرجنسی', 'تعلیمی بورڈز')),
    region TEXT NOT NULL CHECK (region IN ('آزاد کشمیر', 'گلگت بلتستان', 'پنجاب', 'سندھ', 'خیبر پختونخوا', 'بلوچستان', 'اسلام آباد')),
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    alternate_phone TEXT,
    address TEXT,
    emergency BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول: جامعات (Universities)
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('آزاد کشمیر', 'گلگت بلتستان', 'پنجاب', 'سندھ', 'خیبر پختونخوا', 'بلوچستان', 'اسلام آباد')),
    city TEXT NOT NULL,
    sector TEXT NOT NULL DEFAULT 'سرکاری' CHECK (sector IN ('سرکاری', 'نجی')),
    website_url TEXT NOT NULL,
    admissions_url TEXT,
    established_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول: داخلہ اشتہارات (Admissions)
CREATE TABLE IF NOT EXISTS admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    university_name TEXT NOT NULL,
    degree_level TEXT NOT NULL,
    deadline DATE,
    apply_url TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    source_feed TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. جدول: پاکستانی اخبارات (Newspapers)
CREATE TABLE IF NOT EXISTS newspapers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'اردو' CHECK (language IN ('اردو', 'انگریزی')),
    category TEXT NOT NULL DEFAULT 'قومی اخبار',
    logo_url TEXT,
    website_url TEXT NOT NULL,
    epaper_url TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- انڈیکسز برائے تیز رفتار سرچ
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_directory_region ON directory_contacts(region);
CREATE INDEX IF NOT EXISTS idx_directory_category ON directory_contacts(category);
CREATE INDEX IF NOT EXISTS idx_directory_city ON directory_contacts(city);
CREATE INDEX IF NOT EXISTS idx_universities_region ON universities(region);
CREATE INDEX IF NOT EXISTS idx_admissions_deadline ON admissions(deadline);

-- قطار کی سطح کی سیکیورٹی (Row Level Security - RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newspapers ENABLE ROW LEVEL SECURITY;

-- پبلک پڑھنے کی پالیسیاں
DROP POLICY IF EXISTS "عوامی قارئین منظور شدہ مضامین دیکھ سکتے ہیں" ON articles;
CREATE POLICY "عوامی قارئین منظور شدہ مضامین دیکھ سکتے ہیں" ON articles 
    FOR SELECT USING (status = 'approved' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "کوئی بھی شخص نیا مضمون جمع کروا سکتا ہے" ON articles;
CREATE POLICY "کوئی بھی شخص نیا مضمون جمع کروا سکتا ہے" ON articles 
    FOR INSERT WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "ایڈمن مضامین میں ردوبدل کر سکتے ہیں" ON articles;
CREATE POLICY "ایڈمن مضامین میں ردوبدل کر سکتے ہیں" ON articles 
    FOR ALL USING (auth.role() = 'authenticated');

-- رابطہ ڈائریکٹری پالیسیاں
DROP POLICY IF EXISTS "عوامی قارئین ڈائریکٹری دیکھ سکتے ہیں" ON directory_contacts;
CREATE POLICY "عوامی قارئین ڈائریکٹری دیکھ سکتے ہیں" ON directory_contacts 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "صرف ایڈمن ڈائریکٹری تبدیل کر سکتے ہیں" ON directory_contacts;
CREATE POLICY "صرف ایڈمن ڈائریکٹری تبدیل کر سکتے ہیں" ON directory_contacts 
    FOR ALL USING (auth.role() = 'authenticated');

-- یونیورسٹیز پالیسیاں
DROP POLICY IF EXISTS "عوامی قارئین جامعات دیکھ سکتے ہیں" ON universities;
CREATE POLICY "عوامی قارئین جامعات دیکھ سکتے ہیں" ON universities 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "صرف ایڈمن جامعات کا ڈیٹا تبدیل کر سکتے ہیں" ON universities;
CREATE POLICY "صرف ایڈمن جامعات کا ڈیٹا تبدیل کر سکتے ہیں" ON universities 
    FOR ALL USING (auth.role() = 'authenticated');

-- داخلہ اشتہارات پالیسیاں
DROP POLICY IF EXISTS "عوامی قارئین داخلے دیکھ سکتے ہیں" ON admissions;
CREATE POLICY "عوامی قارئین داخلے دیکھ سکتے ہیں" ON admissions 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "ایڈمن اور سروس رول داخلے اپ ڈیٹ کر سکتے ہیں" ON admissions;
CREATE POLICY "ایڈمن اور سروس رول داخلے اپ ڈیٹ کر سکتے ہیں" ON admissions 
    FOR ALL USING (auth.role() = 'authenticated');

-- اخبارات پالیسیاں
DROP POLICY IF EXISTS "عوامی قارئین اخبارات دیکھ سکتے ہیں" ON newspapers;
CREATE POLICY "عوامی قارئین اخبارات دیکھ سکتے ہیں" ON newspapers 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "صرف ایڈمن اخبارات تبدیل کر سکتے ہیں" ON newspapers;
CREATE POLICY "صرف ایڈمن اخبارات تبدیل کر سکتے ہیں" ON newspapers 
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- تفصیلی اردو نمونہ ڈیٹا (SEEDS)
-- ============================================================================

-- اخبارات کا اندراج
INSERT INTO newspapers (name, language, category, website_url, epaper_url, description, featured) VALUES
('روزنامہ جنگ', 'اردو', 'قومی روزنامہ', 'https://jang.com.pk', 'https://e.jang.com.pk', 'پاکستان کا سب سے بڑا اور کثیر الاشاعت اردو اخبار', true),
('روزنامہ ایکسپریس', 'اردو', 'قومی روزنامہ', 'https://www.express.pk', 'https://www.express.com.pk/epaper', 'تازہ ترین سیاسی، سماجی اور بین الاقوامی خبریں', true),
('روزنامہ نوائے وقت', 'اردو', 'نظریاتی و قومی', 'https://www.nawaiwaqt.com.pk', 'https://www.nawaiwaqt.com.pk/epaper', 'پاکستان کی نظریاتی اساس اور قومی ترجمان', true),
('روزنامہ دنیا', 'اردو', 'قومی روزنامہ', 'https://dunya.com.pk', 'https://e.dunya.com.pk', 'ملکی و غیر ملکی خبروں کا معتبر نام', true),
('روزنامہ مشرق', 'اردو', 'علاقائی و قومی', 'https://mashriqtv.pk', 'https://epaper.mashriqtv.pk', 'خیبر پختونخوا اور آزاد کشمیر کا مقبول اخبار', false),
('روزنامہ اوصاف', 'اردو', 'کشمیر و قومی', 'https://dailyausaf.com', 'https://epaper.dailyausaf.com', 'آزاد کشمیر اور اسلام آباد کی مستند خبریں', true),
('ڈان (Dawn)', 'انگریزی', 'قومی انگریزی روزنامہ', 'https://www.dawn.com', 'https://epaper.dawn.com', 'پاکستان کا سب سے باوقار اور قدیم انگریزی اخبار', true),
('دی نیوز (The News)', 'انگریزی', 'قومی روزنامہ', 'https://www.thenews.com.pk', 'https://e.thenews.com.pk', 'بین الاقوامی و قومی حالات پر تجزیاتی مضامین', false),
('دی نیشن (The Nation)', 'انگریزی', 'قومی روزنامہ', 'https://nation.com.pk', 'https://nation.com.pk/epaper', 'قومی امور پر مستند اداریے اور خبریں', false)
ON CONFLICT DO NOTHING;

-- جامعات کا اندراج
INSERT INTO universities (name, region, city, sector, website_url, admissions_url, established_year) VALUES
('جامعہ کشمیر (University of Azad Jammu & Kashmir)', 'آزاد کشمیر', 'مظفرآباد', 'سرکاری', 'https://ajku.edu.pk', 'https://ajku.edu.pk/admissions', 1980),
('میرپور یونیورسٹی آف سائنس اینڈ ٹیکنالوجی (MUST)', 'آزاد کشمیر', 'میرپور', 'سرکاری', 'https://must.edu.pk', 'https://must.edu.pk/admissions', 2008),
('جامعہ پونچھ راولاکوٹ', 'آزاد کشمیر', 'راولاکوٹ', 'سرکاری', 'https://upr.edu.pk', 'https://upr.edu.pk/admissions', 2012),
('قراقرم انٹرنیشنل یونیورسٹی', 'گلگت بلتستان', 'گلگت', 'سرکاری', 'https://kiu.edu.pk', 'https://kiu.edu.pk/admission', 2002),
('قائد اعظم یونیورسٹی', 'اسلام آباد', 'اسلام آباد', 'سرکاری', 'https://qau.edu.pk', 'https://qau.edu.pk/admissions', 1967),
('نیشنل یونیورسٹی آف سائنسز اینڈ ٹیکنالوجی (NUST)', 'اسلام آباد', 'اسلام آباد', 'سرکاری', 'https://nust.edu.pk', 'https://nust.edu.pk/admissions', 1991),
('نیشنل یونیورسٹی آف ماڈرن لینگویجز (NUML)', 'اسلام آباد', 'اسلام آباد', 'سرکاری', 'https://numl.edu.pk', 'https://numl.edu.pk/admissions', 2000),
('پنجاب یونیورسٹی', 'پنجاب', 'لاہور', 'سرکاری', 'https://pu.edu.pk', 'https://pu.edu.pk/admissions', 1882),
('لاہور یونیورسٹی آف مینجمنٹ سائنسز (LUMS)', 'پنجاب', 'لاہور', 'نجی', 'https://lums.edu.pk', 'https://admission.lums.edu.pk', 1985),
('جامعہ کراچی', 'سندھ', 'کراچی', 'سرکاری', 'https://uok.edu.pk', 'https://uok.edu.pk/admissions', 1951),
('جامعہ پشاور', 'خیبر پختونخوا', 'پشاور', 'سرکاری', 'https://uop.edu.pk', 'https://uop.edu.pk/admissions', 1950),
('جامعہ بلوچستان', 'بلوچستان', 'کوئٹہ', 'سرکاری', 'https://uob.edu.pk', 'https://uob.edu.pk/admissions', 1970)
ON CONFLICT DO NOTHING;

-- رابطہ ڈائریکٹری کا نمونہ ڈیٹا
INSERT INTO directory_contacts (title, category, region, city, phone, alternate_phone, address, emergency) VALUES
-- آزاد کشمیر
('سنٹرل پولیس کنٹرول روم مظفرآباد', 'تھانے', 'آزاد کشمیر', 'مظفرآباد', '05822-920000', '15', 'پولیس ہیڈ کوارٹر، کچہری روڈ مظفرآباد', true),
('تھانہ سٹی میرپور آزاد کشمیر', 'تھانے', 'آزاد کشمیر', 'میرپور', '05827-920015', '15', 'آلائڈ چوک، میرپور آزاد کشمیر', true),
('شیخ خلیفہ بن زائد ہسپتال (سی ایم ایچ)', 'ہسپتال و ایمرجنسی', 'آزاد کشمیر', 'مظفرآباد', '05822-921001', '05822-921002', 'مظفرآباد بائی پاس روڈ', true),
('ریسکیو 1122 آزاد کشمیر', 'ہسپتال و ایمرجنسی', 'آزاد کشمیر', 'مظفرآباد', '1122', '05822-920122', 'ضلعی ایمرجنسی سروس سینٹر، مظفرآباد', true),
('آزاد جموں و کشمیر تعلیمی بورڈ میرپور', 'تعلیمی بورڈز', 'آزاد کشمیر', 'میرپور', '05827-960038', '05827-960039', 'سیکٹر ایف ون، میرپور آزاد کشمیر', false),
('ڈپٹی کمشنر آفس راولاکوٹ', 'سرکاری دفاتر', 'آزاد کشمیر', 'راولاکوٹ', '05824-920001', NULL, 'ضلعی کچہری، راولاکوٹ', false),

-- گلگت بلتستان
('سنٹرل پولیس کنٹرول گلگت', 'تھانے', 'گلگت بلتستان', 'گلگت', '05811-920222', '15', 'پولیس لائنز، جوتیال گلگت', true),
('ڈی ایچ کیو ہسپتال گلگت', 'ہسپتال و ایمرجنسی', 'گلگت بلتستان', 'گلگت', '05811-920253', NULL, 'مین شاہراہ، گلگت', true),
('ریسکیو 1122 گلگت', 'ہسپتال و ایمرجنسی', 'گلگت بلتستان', 'گلگت', '1122', NULL, 'ایمرجنسی رسپانس سینٹر، گلگت', true),
('قراقرم تعلیمی بورڈ گلگت', 'تعلیمی بورڈز', 'گلگت بلتستان', 'گلگت', '05811-920627', NULL, 'کنور، شاہراہ قراقرم، گلگت', false),

-- اسلام آباد
('اسلام آباد کیپٹل پولیس کنٹرول', 'تھانے', 'اسلام آباد', 'اسلام آباد', '051-9258371', '15', 'سیکٹر جی الیون فور، اسلام آباد', true),
('پمز ہسپتال ایمرجنسی (PIMS)', 'ہسپتال و ایمرجنسی', 'اسلام آباد', 'اسلام آباد', '051-9261170', '051-9261171', 'سیکٹر جی ایٹ تھری، اسلام آباد', true),
('وفاقی تعلیمی بورڈ (FBISE)', 'تعلیمی بورڈز', 'اسلام آباد', 'اسلام آباد', '051-9269555', '051-9269559', 'سیکٹر ایچ ایٹ فور، اسلام آباد', false),
('نادرا ہیڈ کوارٹرز اسلام آباد', 'سرکاری دفاتر', 'اسلام آباد', 'اسلام آباد', '051-111786100', '1777', 'شاہراہ جمہوریت، جی فائیو ٹو، اسلام آباد', false),

-- پنجاب
('تھانہ پرانی انارکلی لاہور', 'تھانے', 'پنجاب', 'لاہور', '042-99210101', '15', 'انارکلی چوک، مال روڈ لاہور', true),
('میو ہسپتال ایمرجنسی لاہور', 'ہسپتال و ایمرجنسی', 'پنجاب', 'لاہور', '042-99211100', '042-99211105', 'نیلا گنبد، انارکلی لاہور', true),
('پنجاب ایمرجنسی سروس ریسکیو 1122 ہیڈکوارٹرز', 'ہسپتال و ایمرجنسی', 'پنجاب', 'لاہور', '1122', '042-99231701', 'فیروز پور روڈ لاہور', true),
('لاہور بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن', 'تعلیمی بورڈز', 'پنجاب', 'لاہور', '042-99200192', NULL, '86 معین الدین چشتی روڈ، لاہور', false),

-- خیبر پختونخوا
('ریسکیو 1122 پشاور ہیڈ آفس', 'ہسپتال و ایمرجنسی', 'خیبر پختونخوا', 'پشاور', '1122', '091-2264224', 'خیبر بازار پشاور', true),
('لیڈی ریڈنگ ہسپتال پشاور', 'ہسپتال و ایمرجنسی', 'خیبر پختونخوا', 'پشاور', '091-9211430', NULL, 'سویک سوسائٹی، جی ٹی روڈ پشاور', true),
('پشاور تعلیمی بورڈ (BISE)', 'تعلیمی بورڈز', 'خیبر پختونخوا', 'پشاور', '091-9216263', NULL, 'جامعہ روڈ پشاور', false),

-- سندھ
('سندھ پولیس ہیلپ لائن کراچی', 'تھانے', 'سندھ', 'کراچی', '021-99212652', '15', 'سینٹرل پولیس آفس، آئی آئی چندریگر روڈ کراچی', true),
('جناح پوسٹ گریجویٹ میڈیکل سینٹر (JPMC)', 'ہسپتال و ایمرجنسی', 'سندھ', 'کراچی', '021-99201300', NULL, 'رفیقی ایچ جے روڈ، صدر کراچی', true),
('سندھ بورڈ آف سیکنڈری ایجوکیشن کراچی', 'تعلیمی بورڈز', 'سندھ', 'کراچی', '021-99260256', NULL, 'بلاک فائیو، ناظم آباد کراچی', false),

-- بلوچستان
('کوئٹہ پولیس کنٹرول روم', 'تھانے', 'بلوچستان', 'کوئٹہ', '081-9201490', '15', 'پولیس لائنز کوئٹہ', true),
('سول ہسپتال کوئٹہ ایمرجنسی', 'ہسپتال و ایمرجنسی', 'بلوچستان', 'کوئٹہ', '081-9202016', NULL, 'جناح روڈ کوئٹہ', true),
('بلوچستان تعلیمی بورڈ کوئٹہ', 'تعلیمی بورڈز', 'بلوچستان', 'کوئٹہ', '081-9202353', NULL, 'سریاب روڈ کوئٹہ', false)
ON CONFLICT DO NOTHING;

-- نمونہ مضامین
INSERT INTO articles (title, slug, author_name, category, image_url, summary, content, status, views) VALUES
(
    'مصنوعی ذہانت اور جدید پاکستان: نوجوانوں کے لیے نئے ڈیجیٹل امکانات',
    'artificial-intelligence-modern-pakistan-youth-opportunities',
    'انجینئر کامران ہاشمی',
    'انٹرنیٹ و ٹیکنالوجی',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    'آج کے ڈیجیٹل دور میں مصنوعی ذہانت ہر شعبہ زندگی کو تبدیل کر رہی ہے۔ پاکستانی نوجوان کیسے اس انقلاب سے مالی و علمی خودمختاری حاصل کر سکتے ہیں؟',
    'گزشتہ دو دہائیوں کے دوران دنیا نے ٹیکنالوجی کے میدان میں جو تیز رفتار ترقی دیکھی ہے اس کی مثال انسانی تاریخ میں نہیں ملتی۔ چیٹ جی پی ٹی، مشین لرننگ، اور جنریٹو ماڈلز نے جہاں پیداواری صلاحیت کو کئی گنا بڑھا دیا ہے، وہیں پاکستان اور آزاد کشمیر کے نوجوانوں کے لیے بھی بے پناہ مواقع کے دروازے کھول دیے ہیں۔\n\nاگر ہمارے طلبہ روایتی شعبوں سے نکل کر کلاؤڈ کمپیوٹنگ، نیچرل لینگویج پروسیسنگ اور پراپمٹ انجینئرنگ پر توجہ مرکوز کریں تو نہ صرف ملک میں زر مبادلہ کے ذخائر میں اضافہ ہو سکتا ہے بلکہ ہم عالمی سطح پر فری لانسنگ مارکیٹ میں سب سے آگے کھڑے ہو سکتے ہیں۔ ضرورت اس امر کی ہے کہ جامعات اور تعلیمی ادارے عملی صلاحیتوں پر مبنی نصاب کو فوری نافذ کریں۔',
    'approved',
    1420
),
(
    'سائنس اور کائنات: جیمز ویب اسپیس ٹیلی اسکوپ کے حیران کن انکشافات',
    'james-webb-space-telescope-universe-discoveries',
    'ڈاکٹر طارق محمود قریشی',
    'سائنسی معلومات',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'ناسا کی جیمز ویب ٹیلی اسکوپ نے ابتدائی کہکشاؤں اور کائنات کے رازوں سے پردہ اٹھا کر فلکیات کے مسلمہ اصولوں کو نئے رخ پر ڈال دیا ہے۔',
    'کائنات کا آغاز کیسے ہوا اور کیا ہم اس لامحدود وسعت میں اکیلے ہیں؟ یہ وہ سوالات ہیں جو ہمیشہ سے انسانی فکر کو جھنجھوڑتے رہے ہیں۔ جیمز ویب اسپیس ٹیلی اسکوپ نے کائنات کی تاریخ کے اولین زمانوں کی تصویریں بھیج کر سائنسدانوں کو دنگ کر دیا ہے۔\n\nان تصاویر میں نظر آنے والی کہکشائیں اس قدر روشن اور منظم ہیں کہ ماہرین فلکیات اب اپنے سابقہ سائنسی تخمینوں پر نظر ثانی کرنے پر مجبور ہو گئے ہیں۔ اس تحقیق نے ہمیں یہ سبق دیا ہے کہ تجسس اور کھوج ہی انسانی شعور کا اصل حسن ہے۔',
    'approved',
    980
),
(
    'آزاد کشمیر اور گلگت بلتستان میں ماحول دوست سیاحت کے روشن امکانات',
    'eco-friendly-tourism-azad-kashmir-gilgit-baltistan',
    'سید عدیل شاہ بخاری',
    'خصوصی مضامین',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'وادی نیلم، گنگا چوٹی اور ہنزہ کے قدرتی حسن کو محفوظ رکھتے ہوئے مقامی معیشت کو مستحکم بنانے کی جامع حکمت عملی۔',
    'خطہ کشمیر اور گلگت بلتستان کا بے مثال جغرافیہ اور برف پوش پہاڑ دنیا بھر کے سیاحوں کو اپنی طرف کھینچتے ہیں۔ تاہم حالیہ برسوں میں بڑھتی ہوئی بے ہنگم سیاحت نے مقامی ماحولیاتی توازن کو شدید خطرات سے دوچار کر دیا ہے۔\n\nاگر ہم سوئٹزرلینڈ یا ناروے کے ماڈل کی طرز پر ویسٹ مینجمنٹ، ماحول دوست ہوم اسٹے، اور سیاحتی ضوابط نافذ کریں تو مقامی آبادی کے لیے روزگار کے پائیدار مواقع پیدا ہوں گے اور آنے والی نسلوں کے لیے یہ جنت نظیر وادیاں محفوظ رہ سکیں گی۔',
    'approved',
    1150
),
(
    'پاکستان میں ڈیجیٹل ادائیگیوں کا انقلاب: راست اور جدید بینکنگ',
    'digital-payments-revolution-pakistan-raast',
    'مریم نواز خان',
    'خبریں',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    'اسٹیٹ بینک آف پاکستان کا فوری ادائیگی نظام "راست" کیش لیس اکانومی کی جانب ایک انقلابی پیش رفت ثابت ہو رہا ہے۔',
    'پاکستان میں بینکنگ اور فنانشل ٹیکنالوجی کے شعبے میں حالیہ برسوں کے دوران نمایاں تبدیلی رونما ہوئی ہے۔ اسٹیٹ بینک کے فوری ادائیگیوں کے نظام "راست" نے عام آدمی اور چھوٹے تاجروں کو منٹوں میں رقم کی مفت منتقلی کی سہولت فراہم کی ہے۔\n\nاب شناختی کارڈ یا موبائل نمبر ہی اکاؤنٹ نمبر کے طور پر کام کرتا ہے جس کی بدولت ملک کے دور دراز علاقوں اور دیہاتوں تک بھی مالیاتی خدمات کی رسائی ممکن ہو چکی ہے۔',
    'approved',
    830
)
ON CONFLICT (slug) DO NOTHING;

-- تازہ ترین داخلے نمونہ ڈیٹا
INSERT INTO admissions (title, university_name, degree_level, deadline, apply_url, description, is_active) VALUES
('بہار 2025: بی ایس اور ایم ایس پروگرامز میں داخلے جاری ہیں', 'جامعہ کشمیر (University of Azad Jammu & Kashmir)', 'بی ایس و ایم ایس', '2025-03-31', 'https://ajku.edu.pk/admissions', 'کمپیوٹر سائنس، باٹنی، ریاضی اور انگریزی ادب میں نشستوں کے لیے آن لائن فارم جمع کروائیں۔', true),
('سافٹ ویئر انجینئرنگ و الیکٹریکل انجینئرنگ داخلہ مہم', 'میرپور یونیورسٹی آف سائنس اینڈ ٹیکنالوجی (MUST)', 'بی ایس انجینئرنگ', '2025-04-15', 'https://must.edu.pk/admissions', 'پی ای سی سے منظور شدہ چار سالہ ڈگری پروگرامز برائے انجینئرنگ اور ٹیکنالوجی۔', true),
('انڈرگریجویٹ داخلے 2025-26', 'نیشنل یونیورسٹی آف سائنسز اینڈ ٹیکنالوجی (NUST)', 'بی ایس پروگرامز', '2025-04-30', 'https://nust.edu.pk/admissions', 'این ای ٹی ٹیسٹ کی رجسٹریشن کا آغاز۔ ملک بھر کے ٹیسٹ سینٹرز پر امتحانات۔', true),
('ایم فل اور پی ایچ ڈی اسپیشل داخلہ سیشن', 'قائد اعظم یونیورسٹی اسلام آباد', 'ایم فل و پی ایچ ڈی', '2025-03-25', 'https://qau.edu.pk/admissions', 'نیچرل سائنسز اور سوشل سائنسز ڈیپارٹمنٹس میں اعلیٰ تعلیمی وظائف کے ساتھ داخلے۔', true)
ON CONFLICT DO NOTHING;
