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

// ہجری مہینوں کے اردو نام
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

    // اگلی نماز کا حساب
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Fajr', time: t.Fajr },
      { name: 'Dhuhr', time: t.Dhuhr },
      { name: 'Asr', time: t.Asr },
      { name: 'Maghrib', time: t.Maghrib },
      { name: 'Isha', time: t.Isha },
    ];

    let next = prayers[0];
    let remainingMins = 0;

    for (const p of prayers) {
      const [h, m] = p.time.split(':').map(Number);
      const prayerMins = h * 60 + m;
      if (prayerMins > currentMins) {
        next = p;
        remainingMins = prayerMins - currentMins;
        break;
      }
    }

    if (remainingMins === 0) {
      // اگر عشاء بھی گزر چکی ہے تو کل کی فجر
      const [h, m] = t.Fajr.split(':').map(Number);
      remainingMins = 24 * 60 - currentMins + (h * 60 + m);
      next = prayers[0];
    }

    const remHours = Math.floor(remainingMins / 60);
    const remM = remainingMins % 60;
    const remainingTime = remHours > 0 ? `${remHours} گھنٹے ${remM} منٹ` : `${remM} منٹ`;

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
        nameUrdu: URDU_PRAYER_NAMES[next.name] || next.name,
        time: next.time,
        remainingTime,
      },
    };
  } catch (err) {
    console.error('Prayer times fetch error:', err);
    return null;
  }
}
