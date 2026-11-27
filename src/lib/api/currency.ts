export interface CurrencyRateItem {
  code: string;
  nameUrdu: string;
  flag: string;
  rateAgainstPKR: number; // 1 فارن کرنسی = کتنے پاکستانی روپے
  inverseRate: number;    // 1 روپیہ = کتنی فارن کرنسی
}

export interface LiveCurrencyData {
  baseCurrency: string;
  rates: CurrencyRateItem[];
  lastUpdated: string;
}

const CURRENCIES_CONFIG: Record<string, { nameUrdu: string; flag: string }> = {
  USD: { nameUrdu: 'امریکی ڈالر', flag: '🇺🇸' },
  SAR: { nameUrdu: 'سعودی ریال', flag: '🇸🇦' },
  AED: { nameUrdu: 'یو اے ای درہم', flag: '🇦🇪' },
  GBP: { nameUrdu: 'برطانوی پاؤنڈ', flag: '🇬🇧' },
  EUR: { nameUrdu: 'یورو', flag: '🇪🇺' },
  CAD: { nameUrdu: 'کینیڈین ڈالر', flag: '🇨🇦' },
  AUD: { nameUrdu: 'آسٹریلین ڈالر', flag: '🇦🇺' },
  CNY: { nameUrdu: 'چینی یوآن', flag: '🇨🇳' },
  KWD: { nameUrdu: 'کویتی دینار', flag: '🇰🇼' },
  QAR: { nameUrdu: 'قطری ریال', flag: '🇶🇦' },
  OMR: { nameUrdu: 'عمانی ریال', flag: '🇴🇲' },
};

export async function getLiveCurrencyRates(): Promise<LiveCurrencyData | null> {
  try {
    const url = 'https://open.er-api.com/v6/latest/USD';
    const res = await fetch(url, { next: { revalidate: 300 } }); // 5 منٹ کیشنگ
    if (!res.ok) return null;

    const data = await res.json();
    const usdToPkr = data.rates['PKR'] || 278.0;

    const rates: CurrencyRateItem[] = Object.keys(CURRENCIES_CONFIG).map((code) => {
      const cfg = CURRENCIES_CONFIG[code];
      const usdToForeign = data.rates[code] || 1.0;
      // 1 Foreign = (usdToPkr / usdToForeign) PKR
      const rateAgainstPKR = Math.round((usdToPkr / usdToForeign) * 100) / 100;
      const inverseRate = Math.round((1 / rateAgainstPKR) * 10000) / 10000;

      return {
        code,
        nameUrdu: cfg.nameUrdu,
        flag: cfg.flag,
        rateAgainstPKR,
        inverseRate,
      };
    });

    return {
      baseCurrency: 'PKR',
      rates,
      lastUpdated: new Date(data.time_last_update_utc || Date.now()).toLocaleDateString('ur-PK'),
    };
  } catch (err) {
    console.error('Currency rates error:', err);
    return null;
  }
}
