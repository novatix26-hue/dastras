-- توسیع برائے زمرہ جات: عجیب و غریب اور بچوں کی دنیا
ALTER TABLE IF EXISTS articles DROP CONSTRAINT IF EXISTS articles_category_check;
ALTER TABLE IF EXISTS articles ADD CONSTRAINT articles_category_check 
  CHECK (category IN ('pakistan', 'azad-kashmir', 'international', 'sports', 'health', 'technology', 'business', 'weird', 'kids', 'خبریں', 'سائنسی معلومات', 'انٹرنیٹ و ٹیکنالوجی', 'خصوصی مضامین'));

ALTER TABLE IF EXISTS articles ALTER COLUMN author_name DROP NOT NULL;
ALTER TABLE IF EXISTS articles ALTER COLUMN author_name SET DEFAULT 'دسترس ایڈیٹوریل';
