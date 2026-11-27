-- جدول ترتیبات و پاس ورڈ برائے ایڈمن
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_settings_all" ON admin_settings;
CREATE POLICY "admin_settings_all" ON admin_settings FOR ALL USING (true) WITH CHECK (true);

-- کالم author_name کی NOT NULL پابندی ختم کریں تاکہ فیچ نیوز میں کوئی رکاوٹ نہ آئے
ALTER TABLE IF EXISTS articles ALTER COLUMN author_name DROP NOT NULL;
ALTER TABLE IF EXISTS articles ALTER COLUMN author_name SET DEFAULT 'دسترس نیوز ڈیسک';
