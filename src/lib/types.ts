export type ArticleCategory = 
  | 'خبریں'
  | 'سائنسی معلومات'
  | 'انٹرنیٹ و ٹیکنالوجی'
  | 'خصوصی مضامین';

export type ArticleStatus = 'pending' | 'approved' | 'rejected';

export interface Article {
  id: string;
  title: string;
  slug: string;
  author_name: string;
  category: ArticleCategory;
  image_url?: string | null;
  summary?: string | null;
  content: string;
  status: ArticleStatus;
  views: number;
  created_at: string;
  updated_at?: string;
}

export type DirectoryCategory = 
  | 'تھانے'
  | 'یونیورسٹیز'
  | 'سرکاری دفاتر'
  | 'ہسپتال و ایمرجنسی'
  | 'تعلیمی بورڈز';

export type DirectoryRegion = 
  | 'آزاد کشمیر'
  | 'گلگت بلتستان'
  | 'پنجاب'
  | 'سندھ'
  | 'خیبر پختونخوا'
  | 'بلوچستان'
  | 'اسلام آباد';

export interface DirectoryContact {
  id: string;
  title: string;
  category: DirectoryCategory;
  region: DirectoryRegion;
  city: string;
  phone: string;
  alternate_phone?: string | null;
  address?: string | null;
  emergency: boolean;
  created_at?: string;
}

export interface University {
  id: string;
  name: string;
  region: DirectoryRegion;
  city: string;
  sector: 'سرکاری' | 'نجی';
  website_url: string;
  admissions_url?: string | null;
  established_year?: number | null;
  created_at?: string;
}

export interface Admission {
  id: string;
  title: string;
  university_name: string;
  degree_level: string;
  deadline?: string | null;
  apply_url: string;
  description?: string | null;
  is_active: boolean;
  source_feed?: string | null;
  created_at?: string;
}

export interface Newspaper {
  id: string;
  name: string;
  language: 'اردو' | 'انگریزی';
  category: string;
  logo_url?: string | null;
  website_url: string;
  epaper_url?: string | null;
  description?: string | null;
  featured: boolean;
  created_at?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  category: 'پاکستان' | 'آزاد کشمیر' | 'دنیا' | 'معیشت';
  image_url?: string | null;
  source_name?: string | null;
  source_url: string;
  meta_description?: string | null;
  published_at: string;
  created_at?: string;
}

