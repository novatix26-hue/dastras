import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// تاریخ کو خوبصورت اردو الفاظ میں تبدیل کریں
export function formatUrduDate(dateString?: string | null): string {
  if (!dateString) return "حال ہی میں";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "حال ہی میں";

    const monthsUrdu = [
      "جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون",
      "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"
    ];

    const day = d.getDate();
    const month = monthsUrdu[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return "حال ہی میں";
  }
}

// انگریزی ہندسوں کو اردو ہندسوں میں تبدیل کریں (اختیاری)
export function toUrduDigits(num: number | string): string {
  const urduDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/[0-9]/g, (w) => urduDigits[+w]);
}

// عنوان سے سلگ تیار کریں
export function generateSlug(title: string): string {
  const clean = title
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${clean}-${Date.now().toString().slice(-4)}`;
}
