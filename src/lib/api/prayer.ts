export interface PrayerTimingsData {
  city: string;
  urduCity: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijriDate: string;
  gregorianDate: string;
  nextPrayer: {
    nameUrdu: string;
    time: string;
    remainingTime: string;
  };
}

const URDU_PRAYER_NAMES: Record<string, string> = {
  Fajr: 'فجر',
  Sunrise: 'طلوع آفتاب',
  Dhuhr: 'ظہر',
  Asr: 'عصر',
  Maghrib: 'مغرب',
  Isha: 'عشاء',
};

// 24 گھنٹے کے وقت کو 12 گھنٹے کے معیاری اردو وقت میں تبدیل کریں
export function formatUrdu12hTime(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h < 12 ? 'صبح' : h === 12 ? 'دوپہر' : h < 17 ? 'سہ پہر' : h < 20 ? 'شام' : 'رات';
  const h12 = h % 12 || 12;
  const hStr = h12 < 10 ? `0${h12}` : `${h12}`;
  const mStr = m < 10 ? `0${m}` : `${m}`;
  return `${toUrduNumbers(hStr)}:${toUrduNumbers(mStr)} ${period}`;
}

export function calculateNextPrayer(t: Record<string, string>): {
  nameUrdu: string;
  nameEn: string;
  time: string;
  time12h: string;
  remainingTime: string;
} {
  // پاکستان کا اصل مقامی وقت (Asia/Karachi UTC+5)
  const pktString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
  const now = new Date(pktString);
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Fajr', nameUrdu: 'فجر', time: t.Fajr },
    { name: 'Dhuhr', nameUrdu: 'ظہر', time: t.Dhuhr },
    { name: 'Asr', nameUrdu: 'عصر', time: t.Asr },
    { name: 'Maghrib', nameUrdu: 'مغرب', time: t.Maghrib },
    { name: 'Isha', nameUrdu: 'عشاء', time: t.Isha },
  ];

  let next = prayers[0];
  let remainingMins = 0;
  let isTomorrow = false;

  for (const p of prayers) {
    const [h, m] = p.time.split(':').map(Number);
    const prayerMins = h * 60 + m;
    if (prayerMins > currentMins) {
      next = p;
      remainingMins = prayerMins - currentMins;
      break;
    }
  }

  // اگر عشاء بھی گزر چکی ہو تو اگلی نماز کل صبح کی فجر ہوگی
  if (remainingMins === 0) {
    const [h, m] = t.Fajr.split(':').map(Number);
    remainingMins = (24 * 60 - currentMins) + (h * 60 + m);
    next = prayers[0];
    isTomorrow = true;
  }

  const remHours = Math.floor(remainingMins / 60);
  const remM = remainingMins % 60;
  const remainingTime = remHours > 0 
    ? `${toUrduNumbers(remHours)} گھنٹے ${toUrduNumbers(remM)} منٹ` 
    : `${toUrduNumbers(remM)} منٹ`;

  return {
    nameUrdu: isTomorrow ? `${next.nameUrdu} (کل صبح)` : next.nameUrdu,
    nameEn: next.name,
    time: next.time,
    time12h: formatUrdu12hTime(next.time),
    remainingTime,
  };
}
const HIJRI_MONTHS_URDU: Record<string, string> = {
  'Muharram': 'محرم الحرام',
  'Safar': 'صفر المظفر',
  'Rabi\' al-awwal': 'ربیع الاول',
  'Rabi\' al-thani': 'ربیع الثانی',
  'Jumada al-awwal': 'جمادی الاول',
  'Jumada al-thani': 'جمادی الثانی',
  'Rajab': 'رجب المرجب',
  'Sha\'ban': 'شعبان المعظم',
  'Ramadan': 'رمضان المبارک',
  'Shawwal': 'شوال المکرم',
  'Dhu al-Qi\'dah': 'ذی القعدہ',
  'Dhu al-Hijjah': 'ذی الحجہ',
};

// انگریزی ہندسوں کو اردو میں تبدیل کریں
export function toUrduNumbers(str: string | number): string {
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (d) => urduDigits[+d]);
}

export async function getLivePrayerTimings(city: string = 'Islamabad'): Promise<PrayerTimingsData | null> {
  try {
    // طریقہ: 1 (جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن، کراچی) اور اسکول: 1 (حنفی فقہ)
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Pakistan&method=1&school=1`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // 1 گھنٹہ کیشنگ
    if (!res.ok) return null;

    const json = await res.json();
    const data = json.data;
    const t = data.timings;
    const hijri = data.date.hijri;
    const greg = data.date.gregorian;

    // ہجری تاریخ کی تشکیل
    const monthUrdu = HIJRI_MONTHS_URDU[hijri.month.en] || hijri.month.ar;
    const hijriDate = `${toUrduNumbers(hijri.day)} ${monthUrdu} ${toUrduNumbers(hijri.year)} ہجری`;
    const gregorianDate = `${toUrduNumbers(greg.day)} ${greg.month.en} ${toUrduNumbers(greg.year)}`;

    // پاکستان کے معیاری وقت (PKT) کے مطابق اگلی نماز کا درست حساب
    const nextPrayer = calculateNextPrayer(t);

    return {
      city,
      urduCity: city === 'Islamabad' ? 'اسلام آباد' : city === 'Muzaffarabad' ? 'مظفرآباد' : city,
      fajr: t.Fajr,
      sunrise: t.Sunrise,
      dhuhr: t.Dhuhr,
      asr: t.Asr,
      maghrib: t.Maghrib,
      isha: t.Isha,
      hijriDate,
      gregorianDate,
      nextPrayer: {
        nameUrdu: nextPrayer.nameUrdu,
        time: nextPrayer.time,
        remainingTime: nextPrayer.remainingTime,
      },
    };
  } catch (err) {
    console.error('Prayer times fetch error:', err);
    return null;
  }
}
