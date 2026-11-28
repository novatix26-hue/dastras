import { Article } from './types';

/**
 * پاکستان اسٹینڈرڈ ٹائم (PKT) کی موجودہ تاریخ حاصل کریں (YYYY-MM-DD فارمیٹ میں)
 */
export function getCurrentPktDateString(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
}

/**
 * سال کے دن کا نمبر پاکستان ٹائم کے مطابق حاصل کریں (1 تا 366)
 */
export function getPktDayOfYear(dateStr?: string): number {
  const pktDate = dateStr || getCurrentPktDateString();
  const parts = pktDate.split('-').map(Number);
  const year = parts[0] || new Date().getFullYear();
  const month = parts[1] || 1;
  const day = parts[2] || 1;
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const currentDate = new Date(Date.UTC(year, month - 1, day));
  const diffTime = currentDate.getTime() - startOfYear.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * موجودہ تاریخ (PKT) کے لیے روزانہ کی کہانی خودکار طریقے سے منتخب کریں
 * رات ۱۲:۰۰ بجے (PKT) تاریخ بدلتے ہی اگلی کہانی خود بخود منتخب ہو جاتی ہے
 */
export function getDailyStory(stories: Article[], dateStr?: string): { story: Article | null; index: number } {
  if (!stories || stories.length === 0) {
    return { story: null, index: 0 };
  }
  const dayOfYear = getPktDayOfYear(dateStr);
  const index = Math.abs(dayOfYear % stories.length);
  return {
    story: stories[index] || stories[0],
    index,
  };
}

/**
 * پاکستان ٹائم کے مطابق اردو میں تاریخ کی خوبصورت پیشکش
 */
export function getPktFormattedDate(): string {
  return new Date().toLocaleDateString('ur-PK', {
    timeZone: 'Asia/Karachi',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
