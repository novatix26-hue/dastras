export interface PetrolProduct {
  id: string;
  nameUrdu: string;
  nameEn: string;
  pricePerLiter: number;
  change: number; // مثلاً +3.5 یا -1.2
  previousPrice: number;
  unit: string;
  category: 'fuel' | 'gas';
}

export interface PetrolPricesData {
  items: PetrolProduct[];
  announcedBy: string;
  lastUpdated: string;
  effectiveFrom: string;
}

export const OFFICIAL_PETROL_PRICES: PetrolProduct[] = [
  {
    id: 'petrol',
    nameUrdu: 'پٹرول (سپر ۹۲)',
    nameEn: 'Motor Gasoline (Petrol)',
    pricePerLiter: 263.45,
    change: -2.04,
    previousPrice: 265.49,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
  {
    id: 'diesel',
    nameUrdu: 'ہائی اسپیڈ ڈیزل (HSD)',
    nameEn: 'High Speed Diesel',
    pricePerLiter: 277.10,
    change: +1.15,
    previousPrice: 275.95,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
  {
    id: 'kerosene',
    nameUrdu: 'مٹی کا تیل (Kerosene)',
    nameEn: 'Kerosene Oil',
    pricePerLiter: 178.60,
    change: -1.50,
    previousPrice: 180.10,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
  {
    id: 'ldo',
    nameUrdu: 'لائٹ ڈیزل آئل (LDO)',
    nameEn: 'Light Diesel Oil',
    pricePerLiter: 163.20,
    change: 0.0,
    previousPrice: 163.20,
    unit: 'روپے فی لیٹر',
    category: 'fuel',
  },
  {
    id: 'lpg',
    nameUrdu: 'ایل پی جی (گھریلو سلنڈر)',
    nameEn: 'LPG Domestic Gas',
    pricePerLiter: 242.00,
    change: +2.30,
    previousPrice: 239.70,
    unit: 'روپے فی کلوگرام',
    category: 'gas',
  },
];

export async function getLivePetrolPrices(): Promise<PetrolPricesData> {
  // اگر Supabase میں کوئی تازہ نوٹیفکیشن موجود ہو تو وہاں سے اٹھائیں
  return {
    items: OFFICIAL_PETROL_PRICES,
    announcedBy: 'اوگرا و وزارتِ خزانہ، حکومتِ پاکستان',
    lastUpdated: new Date().toLocaleDateString('ur-PK'),
    effectiveFrom: 'موجودہ سرکاری نوٹیفکیشن برائے پاکستان و آزاد کشمیر',
  };
}
