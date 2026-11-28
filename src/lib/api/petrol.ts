export interface PetrolProduct {
  id: string;
  nameUrdu: string;
  nameEn: string;
  pricePerLiter: number;
  change: number; // مثلاً +1.5 یا -2.0
  previousPrice: number;
  unit: string;
  category: 'fuel' | 'gas';
}

export interface PetrolPricesData {
  items: PetrolProduct[];
  announcedBy: string;
  lastUpdated: string;
  lastUpdatedPkt: string;
  effectiveFrom: string;
}

// اوگرا (OGRA) و پی ایس او (PSO) کے موجودہ سرکاری نوٹیفائیڈ بیس لائن ریٹس
export const OFFICIAL_PETROL_PRICES: PetrolProduct[] = [
  {
    id: 'petrol',
    nameUrdu: 'پٹرول (سپر ۹۲)',
    nameEn: 'Motor Gasoline (Super Petrol)',
    pricePerLiter: 312.00,
    change: -1.00,
    previousPrice: 313.00,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
  {
    id: 'diesel',
    nameUrdu: 'ہائی اسپیڈ ڈیزل (HSD)',
    nameEn: 'High Speed Diesel',
    pricePerLiter: 346.00,
    change: -2.00,
    previousPrice: 348.00,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
  {
    id: 'lpg',
    nameUrdu: 'ایل پی جی (فی کلوگرام)',
    nameEn: 'LPG Gas (Per Kg)',
    pricePerLiter: 294.08,
    change: +2.10,
    previousPrice: 291.98,
    unit: 'روپے فی کلوگرام',
    category: 'gas',
  },
  {
    id: 'lpg_cylinder',
    nameUrdu: 'ایل پی جی گھریلو سلنڈر (11.8 کلو)',
    nameEn: 'LPG Domestic Cylinder (11.8 Kg)',
    pricePerLiter: 3470.09,
    change: +24.80,
    previousPrice: 3445.29,
    unit: 'روپے فی سلنڈر',
    category: 'gas',
  },
  {
    id: 'hobc',
    nameUrdu: 'ہائی اوکٹین (HOBC)',
    nameEn: 'High Octane (97 RON)',
    pricePerLiter: 399.00,
    change: 0.00,
    previousPrice: 399.00,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
  {
    id: 'kerosene',
    nameUrdu: 'مٹی کا تیل (Kerosene)',
    nameEn: 'Kerosene Oil',
    pricePerLiter: 273.22,
    change: -1.50,
    previousPrice: 274.72,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
  {
    id: 'ldo',
    nameUrdu: 'لائٹ ڈیزل آئل (LDO)',
    nameEn: 'Light Diesel Oil',
    pricePerLiter: 220.28,
    change: 0.00,
    previousPrice: 220.28,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
];

// قلیل مدتی میموری کیش (2 منٹ) تاکہ ایک ہی وقت آنے والی درخواستوں پر سرور بلاک نہ ہو
let cachedPricesData: PetrolPricesData | null = null;
let lastFetchTimestamp = 0;

/**
 * پاکستان اسٹینڈرڈ ٹائم (PKT) میں لائیو ٹائم اسٹیمپ فارمیٹنگ
 */
export function getLivePktTimestamp(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ur-PK', {
    timeZone: 'Asia/Karachi',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('ur-PK', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr}، ${timeStr} (پاکستان ٹائم PKT)`;
}

/**
 * پی ایس او (PSO) اور اوگرا (OGRA) ریگولیٹڈ ذرائع سے پٹرول، ڈیزل و ایل پی جی کی خودکار لائیو قیمتیں
 * کسی بھی پرانی یا فرضی کیشنگ کو روکنے کے لیے cache: 'no-store' استعمال کیا جاتا ہے۔
 */
export async function getLivePetrolPrices(forceFresh = false): Promise<PetrolPricesData> {
  const now = Date.now();
  if (!forceFresh && cachedPricesData && now - lastFetchTimestamp < 2 * 60 * 1000) {
    return cachedPricesData;
  }

  let items = [...OFFICIAL_PETROL_PRICES];
  let isLivePetrolFetched = false;
  let isLiveLpgFetched = false;

  try {
    // پی ایس او اور ایل پی جی دونوں ذرائع متوازی فیچ ہوں (cache: 'no-store' تاکہ کیش میں پرانی قیمتیں نہ رکیں)
    const [psoRes, lpgRes] = await Promise.allSettled([
      fetch('https://psopk.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DastarasBot/1.0',
        },
        signal: AbortSignal.timeout(4000),
        cache: 'no-store',
      }),
      fetch('https://lpggasprice.pk/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DastarasBot/1.0',
        },
        signal: AbortSignal.timeout(4000),
        cache: 'no-store',
      }),
    ]);

    // ۱. پی ایس او پٹرول و ڈیزل پارسنگ (PSO Live Rates)
    if (psoRes.status === 'fulfilled' && psoRes.value.ok) {
      try {
        const html = await psoRes.value.text();
        const premierMatch = html.match(/alt="Euro5 Premier"[^>]*>[\s\S]*?<p class="fptitle">Rs\.?\s*([0-9]+(?:\.[0-9]+)?)\s*\/Ltr<\/p>/i);
        const dieselMatch = html.match(/cetane5\.png"[\s\S]*?<p class="fptitle">Rs\.?\s*([0-9]+(?:\.[0-9]+)?)\s*\/Ltr<\/p>/i);
        const hobcMatch = html.match(/alt="Euro5 Octane \+"[\s\S]*?<p class="fptitle">Rs\.?\s*([0-9]+(?:\.[0-9]+)?)\s*\/Ltr<\/p>/i);

        const livePetrol = premierMatch ? parseFloat(premierMatch[1]) : 0;
        const liveDiesel = dieselMatch ? parseFloat(dieselMatch[1]) : 0;
        const liveHobc = hobcMatch ? parseFloat(hobcMatch[1]) : 0;

        if (livePetrol > 100 || liveDiesel > 100) {
          items = items.map((p) => {
            if (p.id === 'petrol' && livePetrol > 0) {
              return {
                ...p,
                pricePerLiter: livePetrol,
                change: livePetrol !== 312.00 ? Math.round((livePetrol - 312.00) * 100) / 100 : p.change,
              };
            }
            if (p.id === 'diesel' && liveDiesel > 0) {
              return {
                ...p,
                pricePerLiter: liveDiesel,
                change: liveDiesel !== 346.00 ? Math.round((liveDiesel - 346.00) * 100) / 100 : p.change,
              };
            }
            if (p.id === 'hobc' && liveHobc > 0) {
              return {
                ...p,
                pricePerLiter: liveHobc,
                change: liveHobc !== 399.00 ? Math.round((liveHobc - 399.00) * 100) / 100 : p.change,
              };
            }
            return p;
          });
          isLivePetrolFetched = true;
        }
      } catch (parseErr) {
        console.warn('PSO Parse error:', parseErr);
      }
    }

    // ۲. ایل پی جی اوگرا نوٹیفائیڈ قیمتوں کی پارسنگ (LPG Live Rates)
    if (lpgRes.status === 'fulfilled' && lpgRes.value.ok) {
      try {
        const lpgHtml = await lpgRes.value.text();

        // 1. فی کلوگرام قیمت
        const kgMatch = lpgHtml.match(/"priceSpecification"[\s\S]*?"price":\s*"([0-9.]+)"/i) ||
                        lpgHtml.match(/Rs\.?\s*([0-9]+(?:\.[0-9]+)?)\s*per\s*kg/i);
        const liveLpgKg = kgMatch ? parseFloat(kgMatch[1]) : 0;

        // 2. 11.8 کلو گھریلو سلنڈر قیمت
        const cylMatch = lpgHtml.match(/Rs\.?\s*([0-9,]+(?:\.[0-9]+)?)\s*for a domestic 11\.8kg cylinder/i) ||
                         lpgHtml.match(/domestic\s*11\.8\s*kg\s*cylinder[^\d]*Rs\.?\s*([0-9,]+(?:\.[0-9]+)?)/i);
        const liveLpgCyl = cylMatch 
          ? parseFloat(cylMatch[1].replace(/,/g, '')) 
          : (liveLpgKg > 0 ? Math.round(liveLpgKg * 11.8 * 100) / 100 : 0);

        if (liveLpgKg > 150) {
          items = items.map((p) => {
            if (p.id === 'lpg') {
              return {
                ...p,
                pricePerLiter: liveLpgKg,
                change: liveLpgKg !== 294.08 ? Math.round((liveLpgKg - 294.08) * 100) / 100 : p.change,
              };
            }
            if (p.id === 'lpg_cylinder' && liveLpgCyl > 1000) {
              return {
                ...p,
                pricePerLiter: liveLpgCyl,
                change: liveLpgCyl !== 3470.09 ? Math.round((liveLpgCyl - 3470.09) * 100) / 100 : p.change,
              };
            }
            return p;
          });
          isLiveLpgFetched = true;
        }
      } catch (lpgErr) {
        console.warn('LPG Parse error:', lpgErr);
      }
    }
  } catch (err) {
    console.warn('Fuel/LPG fetch failed, using official baseline:', err);
  }

  const livePktTimestamp = getLivePktTimestamp();

  const result: PetrolPricesData = {
    items,
    announcedBy: (isLivePetrolFetched || isLiveLpgFetched)
      ? 'اوگرا (OGRA) و پی ایس او (PSO) آن لائن لائیو مصدقہ نرخ'
      : 'اوگرا (OGRA) و وزارتِ پیٹرولیم، حکومتِ پاکستان',
    lastUpdated: livePktTimestamp,
    lastUpdatedPkt: livePktTimestamp,
    effectiveFrom: 'پاکستان، اسلام آباد، تمام صوبوں اور آزاد کشمیر کے لیے مصدقہ سرکاری نرخ',
  };

  cachedPricesData = result;
  lastFetchTimestamp = Date.now();

  return result;
}
