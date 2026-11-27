import { createClient } from '@supabase/supabase-js';
import { 
  Article, 
  DirectoryContact, 
  University, 
  Admission, 
  Newspaper,
  NewsArticle 
} from './types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_CONTACTS, 
  INITIAL_UNIVERSITIES, 
  INITIAL_ADMISSIONS, 
  INITIAL_NEWSPAPERS,
  INITIAL_NEWS_ARTICLES 
} from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// کیا سپابیس کی جائز کیز موجود ہیں؟
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('demo-dastaras') &&
  !supabaseAnonKey.includes('your-anon-key') &&
  !supabaseAnonKey.includes('demo-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// براؤزر کے لیے لوکل اسٹوریج کیش تاکہ آف لائن یا بغیر کیز کے بھی سبمیشن اور ایڈمن کام کرے
const STORAGE_PREFIX = 'dastaras_portal_';

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// -------------------------------------------------------------
// مضامین (Articles) API سروسز
// -------------------------------------------------------------
export async function getArticles(status: 'approved' | 'all' = 'approved'): Promise<Article[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (status === 'approved') {
        query = query.eq('status', 'approved');
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Article[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local data', e);
    }
  }

  // Fallback to local storage or mock data
  const localArticles = getStorage<Article[]>('articles', INITIAL_ARTICLES);
  if (status === 'approved') {
    return localArticles.filter(a => a.status === 'approved');
  }
  return localArticles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as Article;
      }
    } catch (e) {
      console.warn('Supabase single fetch failed, fallback', e);
    }
  }

  const articles = getStorage<Article[]>('articles', INITIAL_ARTICLES);
  return articles.find(a => a.slug === slug) || null;
}

export async function submitArticle(article: Omit<Article, 'id' | 'views' | 'created_at' | 'status'>): Promise<{ success: boolean; message: string; article?: Article }> {
  const newArticle: Article = {
    ...article,
    id: 'art-' + Date.now(),
    views: 0,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('articles').insert([
        {
          title: newArticle.title,
          slug: newArticle.slug,
          author_name: newArticle.author_name,
          category: newArticle.category,
          image_url: newArticle.image_url,
          summary: newArticle.summary,
          content: newArticle.content,
          status: 'pending',
        }
      ]).select().single();

      if (!error && data) {
        return {
          success: true,
          message: 'آپ کا مضمون موصول ہو گیا ہے، ایڈمن کی منظوری کے بعد شائع کر دیا جائے گا۔',
          article: data as Article,
        };
      }
    } catch (e) {
      console.warn('Supabase article insert failed, using local storage fallback', e);
    }
  }

  // Local storage save
  const existing = getStorage<Article[]>('articles', INITIAL_ARTICLES);
  const updated = [newArticle, ...existing];
  setStorage('articles', updated);

  return {
    success: true,
    message: 'آپ کا مضمون موصول ہو گیا ہے، ایڈمن کی منظوری کے بعد شائع کر دیا جائے گا۔',
    article: newArticle,
  };
}

export async function updateArticleStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase status update failed', e);
    }
  }

  const articles = getStorage<Article[]>('articles', INITIAL_ARTICLES);
  const updated = articles.map(a => a.id === id ? { ...a, status } : a);
  setStorage('articles', updated);
  return true;
}

// -------------------------------------------------------------
// رابطہ ڈائریکٹری (Directory) سروسز
// -------------------------------------------------------------
export async function getDirectoryContacts(): Promise<DirectoryContact[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('directory_contacts').select('*');
      if (!error && data && data.length > 0) {
        return data as DirectoryContact[];
      }
    } catch (e) {
      console.warn('Supabase contacts fetch failed, fallback', e);
    }
  }
  return getStorage<DirectoryContact[]>('contacts', INITIAL_CONTACTS);
}

export async function addDirectoryContact(contact: Omit<DirectoryContact, 'id'>): Promise<DirectoryContact> {
  const newContact: DirectoryContact = {
    ...contact,
    id: 'c-' + Date.now(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('directory_contacts').insert([contact]).select().single();
      if (!error && data) return data as DirectoryContact;
    } catch (e) {
      console.warn('Supabase contact insert failed, fallback', e);
    }
  }

  const contacts = getStorage<DirectoryContact[]>('contacts', INITIAL_CONTACTS);
  const updated = [newContact, ...contacts];
  setStorage('contacts', updated);
  return newContact;
}

// -------------------------------------------------------------
// جامعات (Universities) سروسز
// -------------------------------------------------------------
export async function getUniversities(): Promise<University[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('universities').select('*');
      if (!error && data && data.length > 0) {
        return data as University[];
      }
    } catch (e) {
      console.warn('Supabase universities fetch failed, fallback', e);
    }
  }
  return getStorage<University[]>('universities', INITIAL_UNIVERSITIES);
}

// -------------------------------------------------------------
// داخلہ اشتہارات (Admissions) سروسز
// -------------------------------------------------------------
export async function getAdmissions(): Promise<Admission[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('admissions').select('*').eq('is_active', true).order('deadline', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Admission[];
      }
    } catch (e) {
      console.warn('Supabase admissions fetch failed, fallback', e);
    }
  }
  return getStorage<Admission[]>('admissions', INITIAL_ADMISSIONS);
}

export async function addAdmission(adm: Omit<Admission, 'id'>): Promise<Admission> {
  const newAdm: Admission = {
    ...adm,
    id: 'adm-' + Date.now(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('admissions').insert([adm]).select().single();
      if (!error && data) return data as Admission;
    } catch (e) {
      console.warn('Supabase admission insert failed, fallback', e);
    }
  }

  const admissions = getStorage<Admission[]>('admissions', INITIAL_ADMISSIONS);
  const updated = [newAdm, ...admissions];
  setStorage('admissions', updated);
  return newAdm;
}

// -------------------------------------------------------------
// اخبارات (Newspapers) سروسز
// -------------------------------------------------------------
export async function getNewspapers(): Promise<Newspaper[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('newspapers').select('*');
      if (!error && data && data.length > 0) {
        return data as Newspaper[];
      }
    } catch (e) {
      console.warn('Supabase newspapers fetch failed, fallback', e);
    }
  }
  return getStorage<Newspaper[]>('newspapers', INITIAL_NEWSPAPERS);
}

// -------------------------------------------------------------
// تازہ ترین بریکنگ نیوز (Breaking News) سروسز
// -------------------------------------------------------------
export async function getNewsArticles(category?: string, limit: number = 30): Promise<NewsArticle[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (category && category !== 'تمام') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as NewsArticle[];
      }
    } catch (e) {
      console.warn('Supabase news_articles fetch failed, fallback', e);
    }
  }

  const allNews = getStorage<NewsArticle[]>('news_articles', INITIAL_NEWS_ARTICLES);
  if (category && category !== 'تمام') {
    return allNews.filter((n) => n.category === category).slice(0, limit);
  }
  return allNews.slice(0, limit);
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as NewsArticle;
      }
    } catch (e) {
      console.warn('Supabase news single fetch failed, fallback', e);
    }
  }

  const allNews = getStorage<NewsArticle[]>('news_articles', INITIAL_NEWS_ARTICLES);
  return allNews.find((n) => n.slug === slug) || null;
}

export async function checkNewsArticleExists(sourceUrl: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('news_articles')
        .select('id')
        .eq('source_url', sourceUrl)
        .limit(1);

      return Boolean(data && data.length > 0);
    } catch (e) {
      console.warn('Supabase checkNewsArticleExists failed', e);
    }
  }

  const allNews = getStorage<NewsArticle[]>('news_articles', INITIAL_NEWS_ARTICLES);
  return allNews.some((n) => n.source_url === sourceUrl);
}

export async function insertNewsArticle(
  article: Omit<NewsArticle, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: NewsArticle; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .insert([article])
        .select()
        .single();

      if (!error && data) {
        return { success: true, data: data as NewsArticle };
      }
      return { success: false, error: error?.message };
    } catch (e: any) {
      return { success: false, error: e?.message };
    }
  }

  const newArt: NewsArticle = {
    ...article,
    id: 'news-' + Date.now(),
    created_at: new Date().toISOString(),
  };

  const existing = getStorage<NewsArticle[]>('news_articles', INITIAL_NEWS_ARTICLES);
  setStorage('news_articles', [newArt, ...existing]);
  return { success: true, data: newArt };
}

