// تمام ۱۱۴ سورتوں کی مصدقہ فہرست مع اردو نام، معانی، اور مکی/مدنی نوعیت

export interface SurahMeta {
  number: number;
  name: string; // عربی رسم الخط مثلاً سُورَةُ ٱلْفَاتِحَةِ
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeUrdu: 'مکی' | 'مدنی';
  urduName: string; // عام اردو نام مثلاً سورۃ الفاتحہ
  urduMeaning: string; // اردو مفہوم
}

export interface AyahItem {
  number: number; // عالمی آیت نمبر (1 to 6236)
  numberInSurah: number; // سورت میں آیت نمبر
  text: string; // عربی متن
  translation: string; // اردو ترجمہ (مولانا فتح محمد جالندھری)
  audioUrl: string; // آڈیو لنک
  juz: number; // پارہ نمبر
  page: number; // صفحہ نمبر
  sajdah?: boolean;
}

export interface SurahDetail {
  meta: SurahMeta;
  ayahs: AyahItem[];
}

export interface QariOption {
  id: string;
  nameUrdu: string;
  nameEn: string;
  identifier: string;
}

export const QARI_OPTIONS: QariOption[] = [
  {
    id: 'alafasy',
    nameUrdu: 'شیخ مشاری راشد العفاسی',
    nameEn: 'Mishary Rashid Alafasy',
    identifier: 'ar.alafasy',
  },
  {
    id: 'sudais',
    nameUrdu: 'شیخ عبد الرحمن السدیس (امامِ کعبہ)',
    nameEn: 'Abdur-Rahman As-Sudais',
    identifier: 'ar.abdurrahmaansudais',
  },
  {
    id: 'abdulbasit',
    nameUrdu: 'شیخ عبد الباسط عبد الصمد (مرتل)',
    nameEn: 'Abdul Basit Murattal',
    identifier: 'ar.abdulbasitmurattal',
  },
];

// قرآن مجید کی تمام ۱۱۴ سورتوں کا مکمل مستند ڈیٹا
export const ALL_SURAHS_DATA: SurahMeta[] = [
  { number: 1, name: 'سُورَةُ ٱلْفَاتِحَةِ', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الفاتحہ', urduMeaning: 'آغاز، دیباچہ' },
  { number: 2, name: 'سُورَةُ البَقَرَةِ', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ البقرۃ', urduMeaning: 'گائے' },
  { number: 3, name: 'سُورَةُ آلِ عِمْرَانَ', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imraan', numberOfAyahs: 200, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ آل عمران', urduMeaning: 'عمران کا خاندان' },
  { number: 4, name: 'سُورَةُ النِّسَاءِ', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ النساء', urduMeaning: 'خواتین' },
  { number: 5, name: 'سُورَةُ المَائِدَةِ', englishName: 'Al-Maaida', englishNameTranslation: 'The Table', numberOfAyahs: 120, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ المائدہ', urduMeaning: 'دسترخوان' },
  { number: 6, name: 'سُورَةُ الأَنْعَامِ', englishName: 'Al-An\'aam', englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الانعام', urduMeaning: 'مویشی' },
  { number: 7, name: 'سُورَةُ الأَعْرَافِ', englishName: 'Al-A\'raaf', englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الاعراف', urduMeaning: 'بلندی والی جگہ' },
  { number: 8, name: 'سُورَةُ الأَنْفَالِ', englishName: 'Al-Anfaal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الانفال', urduMeaning: 'مالِ غنیمت' },
  { number: 9, name: 'سُورَةُ التَّوْبَةِ', englishName: 'At-Tawba', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ التوبہ', urduMeaning: 'توبہ و معافی' },
  { number: 10, name: 'سُورَةُ يُونُسَ', englishName: 'Yunus', englishNameTranslation: 'Jonas', numberOfAyahs: 109, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ یونس', urduMeaning: 'حضرت یونس علیہ السلام' },
  { number: 11, name: 'سُورَةُ هُودٍ', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ ہود', urduMeaning: 'حضرت ہود علیہ السلام' },
  { number: 12, name: 'سُورَةُ يُوسُفَ', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ یوسف', urduMeaning: 'حضرت یوسف علیہ السلام (احسن القصص)' },
  { number: 13, name: 'سُورَةُ الرَّعْدِ', englishName: 'Ar-Ra\'d', englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الرعد', urduMeaning: 'بجلی کی کڑک' },
  { number: 14, name: 'سُورَةُ إِبْرَاهِيمَ', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ ابراہیم', urduMeaning: 'حضرت ابراہیم علیہ السلام' },
  { number: 15, name: 'سُورَةُ الحِجْرِ', englishName: 'Al-Hijr', englishNameTranslation: 'The Rock', numberOfAyahs: 99, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الحجر', urduMeaning: 'پتھریلی چٹان' },
  { number: 16, name: 'سُورَةُ النَّحْلِ', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', numberOfAyahs: 128, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ النحل', urduMeaning: 'شہد کی مکھی' },
  { number: 17, name: 'سُورَةُ الإِسْرَاءِ', englishName: 'Al-Israa', englishNameTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الاسراء (بنی اسرائیل)', urduMeaning: 'رات کا سفرِ معراج' },
  { number: 18, name: 'سُورَةُ الكَهْفِ', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الکہف', urduMeaning: 'غار والے' },
  { number: 19, name: 'سُورَةُ مَرْيَمَ', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ مریم', urduMeaning: 'حضرت مریم علیہا السلام' },
  { number: 20, name: 'سُورَةُ طه', englishName: 'Taa-Haa', englishNameTranslation: 'Taa-Haa', numberOfAyahs: 135, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ طٰہٰ', urduMeaning: 'طٰہٰ' },
  { number: 21, name: 'سُورَةُ الأَنْبِيَاءِ', englishName: 'Al-Anbiyaa', englishNameTranslation: 'The Prophets', numberOfAyahs: 112, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الانبیاء', urduMeaning: 'انبیاء کرام' },
  { number: 22, name: 'سُورَةُ الحَجِّ', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', numberOfAyahs: 78, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الحج', urduMeaning: 'حجِ بیت اللہ' },
  { number: 23, name: 'سُورَةُ المُؤْمِنُونَ', englishName: 'Al-Muminoon', englishNameTranslation: 'The Believers', numberOfAyahs: 118, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ المؤمنون', urduMeaning: 'ایمان والے' },
  { number: 24, name: 'سُورَةُ النُّورِ', englishName: 'An-Noor', englishNameTranslation: 'The Light', numberOfAyahs: 64, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ النور', urduMeaning: 'روشنی، نور' },
  { number: 25, name: 'سُورَةُ الفُرْقَانِ', englishName: 'Al-Furqaan', englishNameTranslation: 'The Criterion', numberOfAyahs: 77, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الفرقان', urduMeaning: 'حق و باطل میں فرق' },
  { number: 26, name: 'سُورَةُ الشُّعَرَاءِ', englishName: 'Ash-Shu\'araa', englishNameTranslation: 'The Poets', numberOfAyahs: 227, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الشعراء', urduMeaning: 'شعراء' },
  { number: 27, name: 'سُورَةُ النَّمْلِ', englishName: 'An-Naml', englishNameTranslation: 'The Ant', numberOfAyahs: 93, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ النمل', urduMeaning: 'چیونٹی' },
  { number: 28, name: 'سُورَةُ القَصَصِ', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', numberOfAyahs: 88, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ القصص', urduMeaning: 'واقعات و کہانیاں' },
  { number: 29, name: 'سُورَةُ العَنْكَبُوتِ', englishName: 'Al-Ankaboot', englishNameTranslation: 'The Spider', numberOfAyahs: 69, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ العنکبوت', urduMeaning: 'مکڑی' },
  { number: 30, name: 'سُورَةُ الرُّومِ', englishName: 'Ar-Room', englishNameTranslation: 'The Romans', numberOfAyahs: 60, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الروم', urduMeaning: 'اہلِ روم' },
  { number: 31, name: 'سُورَةُ لُقْمَانَ', englishName: 'Luqman', englishNameTranslation: 'Luqman', numberOfAyahs: 34, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ لقمان', urduMeaning: 'حضرت لقمان حکیم' },
  { number: 32, name: 'سُورَةُ السَّجْدَةِ', englishName: 'As-Sajda', englishNameTranslation: 'The Prostration', numberOfAyahs: 30, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ السجدہ', urduMeaning: 'سجدہ' },
  { number: 33, name: 'سُورَةُ الأَحْزَابِ', englishName: 'Al-Ahzaab', englishNameTranslation: 'The Clans', numberOfAyahs: 73, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الاحزاب', urduMeaning: 'فوجیں، لشکر' },
  { number: 34, name: 'سُورَةُ سَبَإٍ', englishName: 'Saba', englishNameTranslation: 'Sheba', numberOfAyahs: 54, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ سبا', urduMeaning: 'اہلِ سبا' },
  { number: 35, name: 'سُورَةُ فَاطِرٍ', englishName: 'Faatir', englishNameTranslation: 'The Originator', numberOfAyahs: 45, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ فاطر', urduMeaning: 'پیدا کرنے والا' },
  { number: 36, name: 'سُورَةُ يس', englishName: 'Yaseen', englishNameTranslation: 'Yaseen', numberOfAyahs: 83, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ یٰس (قلبِ قرآن)', urduMeaning: 'یٰسین' },
  { number: 37, name: 'سُورَةُ الصَّافَّاتِ', englishName: 'As-Saaffaat', englishNameTranslation: 'Those drawn up in ranks', numberOfAyahs: 182, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الصافات', urduMeaning: 'صف باندھنے والے' },
  { number: 38, name: 'سُورَةُ ص', englishName: 'Saad', englishNameTranslation: 'The letter Saad', numberOfAyahs: 88, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ ص', urduMeaning: 'حرف ص' },
  { number: 39, name: 'سُورَةُ الزُّمَرِ', englishName: 'Az-Zumar', englishNameTranslation: 'The Groups', numberOfAyahs: 75, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الزمر', urduMeaning: 'گروہ، جماعتیں' },
  { number: 40, name: 'سُورَةُ غَافِرٍ', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', numberOfAyahs: 85, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ غافر (المؤمن)', urduMeaning: 'معاف کرنے والا' },
  { number: 41, name: 'سُورَةُ فُصِّلَتْ', englishName: 'Fussilat', englishNameTranslation: 'Explained in detail', numberOfAyahs: 54, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ فصلت', urduMeaning: 'کھول کر بیان کی گئی' },
  { number: 42, name: 'سُورَةُ الشُّورَىٰ', englishName: 'Ash-Shura', englishNameTranslation: 'Consultation', numberOfAyahs: 53, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الشوریٰ', urduMeaning: 'باہمی مشورہ' },
  { number: 43, name: 'سُورَةُ الزُّخْرُفِ', englishName: 'Az-Zukhruf', englishNameTranslation: 'Ornaments of gold', numberOfAyahs: 89, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الزخرف', urduMeaning: 'سونے کی زینت' },
  { number: 44, name: 'سُورَةُ الدُّخَانِ', englishName: 'Ad-Dukhaan', englishNameTranslation: 'The Smoke', numberOfAyahs: 59, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الدخان', urduMeaning: 'دھواں' },
  { number: 45, name: 'سُورَةُ الجَاثِيَةِ', englishName: 'Al-Jaathiya', englishNameTranslation: 'Crouching', numberOfAyahs: 37, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الجاثیہ', urduMeaning: 'گھٹنوں کے بل گری ہوئی' },
  { number: 46, name: 'سُورَةُ الأَحْقَافِ', englishName: 'Al-Ahqaaf', englishNameTranslation: 'The Dunes', numberOfAyahs: 35, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الاحقاف', urduMeaning: 'ریت کے ٹیلے' },
  { number: 47, name: 'سُورَةُ مُحَمَّدٍ', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', numberOfAyahs: 38, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ محمد ﷺ', urduMeaning: 'حضرت محمد مصطفیٰ ﷺ' },
  { number: 48, name: 'سُورَةُ الفَتْحِ', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', numberOfAyahs: 29, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الفتح', urduMeaning: 'کھلی فتح و نصرت' },
  { number: 49, name: 'سُورَةُ الحُجُرَاتِ', englishName: 'Al-Hujuraat', englishNameTranslation: 'The Inner Apartments', numberOfAyahs: 18, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الحجرات', urduMeaning: 'حجرے، آدابِ نبوی' },
  { number: 50, name: 'سُورَةُ ق', englishName: 'Qaaf', englishNameTranslation: 'The letter Qaaf', numberOfAyahs: 45, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ ق', urduMeaning: 'حرف ق' },
  { number: 51, name: 'سُورَةُ الذَّارِيَاتِ', englishName: 'Adh-Dhaariyat', englishNameTranslation: 'The Winnowing Winds', numberOfAyahs: 60, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الذاریات', urduMeaning: 'بکھیرنے والی ہوائیں' },
  { number: 52, name: 'سُورَةُ الطُّورِ', englishName: 'At-Toor', englishNameTranslation: 'The Mount', numberOfAyahs: 49, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الطور', urduMeaning: 'طورِ سینا' },
  { number: 53, name: 'سُورَةُ النَّجْمِ', englishName: 'An-Najm', englishNameTranslation: 'The Star', numberOfAyahs: 62, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ النجم', urduMeaning: 'ستارہ' },
  { number: 54, name: 'سُورَةُ القَمَرِ', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', numberOfAyahs: 55, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ القمر', urduMeaning: 'چاند (شق القمر)' },
  { number: 55, name: 'سُورَةُ الرَّحْمَٰنِ', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الرحمٰن (عروس القرآن)', urduMeaning: 'بے پایاں رحمت والا' },
  { number: 56, name: 'سُورَةُ الوَاقِعَةِ', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الواقعہ', urduMeaning: 'پیش آنے والی قیامت' },
  { number: 57, name: 'سُورَةُ الحَدِيدِ', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron', numberOfAyahs: 29, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الحدید', urduMeaning: 'لوہا' },
  { number: 58, name: 'سُورَةُ المُجَادِلَةِ', englishName: 'Al-Mujaadila', englishNameTranslation: 'The Pleading Woman', numberOfAyahs: 22, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ المجادلہ', urduMeaning: 'تکرار کرنے والی عورت' },
  { number: 59, name: 'سُورَةُ الحَشْرِ', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', numberOfAyahs: 24, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الحشر', urduMeaning: 'اکٹھا کرنا' },
  { number: 60, name: 'سُورَةُ المُمْتَحَنَةِ', englishName: 'Al-Mumtahana', englishNameTranslation: 'She that is to be examined', numberOfAyahs: 13, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الممتحنہ', urduMeaning: 'آزمائی گئی عورت' },
  { number: 61, name: 'سُورَةُ الصَّفِّ', englishName: 'As-Saff', englishNameTranslation: 'The Ranks', numberOfAyahs: 14, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الصف', urduMeaning: 'صف بندی' },
  { number: 62, name: 'سُورَةُ الجُمُعَةِ', englishName: 'Al-Jumu\'a', englishNameTranslation: 'Friday', numberOfAyahs: 11, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الجمعہ', urduMeaning: 'نمازِ جمعہ' },
  { number: 63, name: 'سُورَةُ المُنَافِقُونَ', englishName: 'Al-Munaafiqoon', englishNameTranslation: 'The Hypocrites', numberOfAyahs: 11, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ المنافقون', urduMeaning: 'منافقین' },
  { number: 64, name: 'سُورَةُ التَّغَابُنِ', englishName: 'At-Taghaabun', englishNameTranslation: 'Mutual Disillusion', numberOfAyahs: 18, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ التغابن', urduMeaning: 'ہار جیت کا دن' },
  { number: 65, name: 'سُورَةُ الطَّلَاقِ', englishName: 'At-Talaaq', englishNameTranslation: 'Divorce', numberOfAyahs: 12, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الطلاق', urduMeaning: 'طلاق کے احکام' },
  { number: 66, name: 'سُورَةُ التَّحْرِيمِ', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition', numberOfAyahs: 12, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ التحریم', urduMeaning: 'حرام ٹھہرانا' },
  { number: 67, name: 'سُورَةُ المُلْكِ', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الملک (نجات دینے والی)', urduMeaning: 'بادشاہی و حاکمیت' },
  { number: 68, name: 'سُورَةُ القَلَمِ', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', numberOfAyahs: 52, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ القلم', urduMeaning: 'قلم' },
  { number: 69, name: 'سُورَةُ الحَاقَّةِ', englishName: 'Al-Haaqqa', englishNameTranslation: 'The Reality', numberOfAyahs: 52, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الحاقہ', urduMeaning: 'برحق قیامت' },
  { number: 70, name: 'سُورَةُ المَعَارِجِ', englishName: 'Al-Ma\'aarij', englishNameTranslation: 'The Ascending Stairways', numberOfAyahs: 44, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ المعارج', urduMeaning: 'عروج کے راستے' },
  { number: 71, name: 'سُورَةُ نُوحٍ', englishName: 'Nooh', englishNameTranslation: 'Noah', numberOfAyahs: 28, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ نوح', urduMeaning: 'حضرت نوح علیہ السلام' },
  { number: 72, name: 'سُورَةُ الجِنِّ', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', numberOfAyahs: 28, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الجن', urduMeaning: 'جنات' },
  { number: 73, name: 'سُورَةُ المُزَّمِّلِ', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', numberOfAyahs: 20, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ المزمل', urduMeaning: 'کملی اوڑھنے والے' },
  { number: 74, name: 'سُورَةُ المُدَّثِّرِ', englishName: 'Al-Muddaththir', englishNameTranslation: 'The Cloaked One', numberOfAyahs: 56, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ المدثر', urduMeaning: 'چادر لپیٹنے والے' },
  { number: 75, name: 'سُورَةُ القِيَامَةِ', englishName: 'Al-Qiyaama', englishNameTranslation: 'The Resurrection', numberOfAyahs: 40, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ القیامہ', urduMeaning: 'قیامت کا دن' },
  { number: 76, name: 'سُورَةُ الإِنْسَانِ', englishName: 'Al-Insaan', englishNameTranslation: 'Man', numberOfAyahs: 31, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الدھر (الانسان)', urduMeaning: 'انسان کی تخلیق' },
  { number: 77, name: 'سُورَةُ المُرْسَلَاتِ', englishName: 'Al-Mursalaat', englishNameTranslation: 'The Emissaries', numberOfAyahs: 50, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ المرسلات', urduMeaning: 'بھیجی جانے والی ہوائیں' },
  { number: 78, name: 'سُورَةُ النَّبَإِ', englishName: 'An-Naba', englishNameTranslation: 'The Announcement', numberOfAyahs: 40, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ النباء (عمّ)', urduMeaning: 'بڑی اہم خبر' },
  { number: 79, name: 'سُورَةُ النَّازِعَاتِ', englishName: 'An-Naazi\'aat', englishNameTranslation: 'Those who drag forth', numberOfAyahs: 46, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ النازعات', urduMeaning: 'کھینچنے والے فرشتے' },
  { number: 80, name: 'سُورَةُ عَبَسَ', englishName: 'Abasa', englishNameTranslation: 'He frowned', numberOfAyahs: 42, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ عبس', urduMeaning: 'تیوری چڑھائی' },
  { number: 81, name: 'سُورَةُ التَّكْوِيرِ', englishName: 'At-Takwir', englishNameTranslation: 'The Overthrowing', numberOfAyahs: 29, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ التکویر', urduMeaning: 'لپیٹ دیا جانا' },
  { number: 82, name: 'سُورَةُ الإِنْفِطَارِ', englishName: 'Al-Infitaar', englishNameTranslation: 'The Cleaving', numberOfAyahs: 19, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الانفطار', urduMeaning: 'پھٹ پڑنا' },
  { number: 83, name: 'سُورَةُ المُطَفِّفِينَ', englishName: 'Al-Mutaffifin', englishNameTranslation: 'Defrauding', numberOfAyahs: 36, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ المطففین', urduMeaning: 'ناپ تول میں کمی کرنے والے' },
  { number: 84, name: 'سُورَةُ الإِنْشِقَاقِ', englishName: 'Al-Inshiqaaq', englishNameTranslation: 'The Splitting Open', numberOfAyahs: 25, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الانشقاق', urduMeaning: 'ٹکڑے ٹکڑے ہونا' },
  { number: 85, name: 'سُورَةُ البُرُوجِ', englishName: 'Al-Burooj', englishNameTranslation: 'The Constellations', numberOfAyahs: 22, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ البروج', urduMeaning: 'آسمانی قلعے و برج' },
  { number: 86, name: 'سُورَةُ الطَّارِقِ', englishName: 'At-Taariq', englishNameTranslation: 'The Morning Star', numberOfAyahs: 17, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الطارق', urduMeaning: 'رات کو آنے والا ستارہ' },
  { number: 87, name: 'سُورَةُ الأَعْلَىٰ', englishName: 'Al-A\'laa', englishNameTranslation: 'The Most High', numberOfAyahs: 19, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الاعلیٰ', urduMeaning: 'سب سے بلند' },
  { number: 88, name: 'سُورَةُ الغَاشِيَةِ', englishName: 'Al-Ghaashiya', englishNameTranslation: 'The Overwhelming', numberOfAyahs: 26, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الغاشیہ', urduMeaning: 'چھا جانے والی مصیبت' },
  { number: 89, name: 'سُورَةُ الفَجْرِ', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', numberOfAyahs: 30, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الفجر', urduMeaning: 'صبح کی پو پھٹنا' },
  { number: 90, name: 'سُورَةُ البَلَدِ', englishName: 'Al-Balad', englishNameTranslation: 'The City', numberOfAyahs: 20, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ البلد', urduMeaning: 'مقدس شہر (مکہ مکرمہ)' },
  { number: 91, name: 'سُورَةُ الشَّمْسِ', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', numberOfAyahs: 15, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الشمس', urduMeaning: 'سورج' },
  { number: 92, name: 'سُورَةُ اللَّيْلِ', englishName: 'Al-Lail', englishNameTranslation: 'The Night', numberOfAyahs: 21, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ اللیل', urduMeaning: 'رات' },
  { number: 93, name: 'سُورَةُ الضُّحَىٰ', englishName: 'Ad-Dhuhaa', englishNameTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الضحیٰ', urduMeaning: 'دن کی روشنی، چاشت' },
  { number: 94, name: 'سُورَةُ الشَّرْحِ', englishName: 'Ash-Sharh', englishNameTranslation: 'The Consolation', numberOfAyahs: 8, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الم نشرح', urduMeaning: 'سینہ کشادہ کرنا' },
  { number: 95, name: 'سُورَةُ التِّينِ', englishName: 'At-Teen', englishNameTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ التین', urduMeaning: 'انجیر' },
  { number: 96, name: 'سُورَةُ العَلَقِ', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ العلق (پہلی وحی: اقْرَأْ)', urduMeaning: 'جما ہوا خون' },
  { number: 97, name: 'سُورَةُ القَدْرِ', englishName: 'Al-Qadr', englishNameTranslation: 'The Power, Fate', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ القدر', urduMeaning: 'شبِ قدر، عظمت والی رات' },
  { number: 98, name: 'سُورَةُ البَيِّنَةِ', englishName: 'Al-Bayyina', englishNameTranslation: 'The Clear Proof', numberOfAyahs: 8, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ البینہ', urduMeaning: 'کھلی اور واضح دلیل' },
  { number: 99, name: 'سُورَةُ الزَّلْزَلَةِ', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ الزلزال', urduMeaning: 'زلزلہ' },
  { number: 100, name: 'سُورَةُ العَادِيَاتِ', englishName: 'Al-Aadiyaat', englishNameTranslation: 'The Courser', numberOfAyahs: 11, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ العادیات', urduMeaning: 'دوڑنے والے تیز گھوڑے' },
  { number: 101, name: 'سُورَةُ القَارِعَةِ', englishName: 'Al-Qaari\'a', englishNameTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ القارعہ', urduMeaning: 'کھڑکھڑانے والی قیامت' },
  { number: 102, name: 'سُورَةُ التَّكَاثُرِ', englishName: 'At-Takaathur', englishNameTranslation: 'Competition', numberOfAyahs: 8, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ التکاثر', urduMeaning: 'مال و دولت کی کثرت کی ہوس' },
  { number: 103, name: 'سُورَةُ العَصْرِ', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day', numberOfAyahs: 3, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ العصر', urduMeaning: 'زمانہ، وقت' },
  { number: 104, name: 'سُورَةُ الهُمَزَةِ', englishName: 'Al-Humaza', englishNameTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الہمزہ', urduMeaning: 'عیب جوئی کرنے والا' },
  { number: 105, name: 'سُورَةُ الفِيلِ', englishName: 'Al-Feel', englishNameTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الفیل', urduMeaning: 'ہاتھی والے (اصحاب الفیل)' },
  { number: 106, name: 'سُورَةُ قُرَيْشٍ', englishName: 'Quraish', englishNameTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ قریش', urduMeaning: 'قبیلہ قریش' },
  { number: 107, name: 'سُورَةُ المَاعُونِ', englishName: 'Al-Maa\'oon', englishNameTranslation: 'Almsgiving', numberOfAyahs: 7, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الماعون', urduMeaning: 'عام برتنے کی چیزیں' },
  { number: 108, name: 'سُورَةُ الكَوْثَرِ', englishName: 'Al-Kawthar', englishNameTranslation: 'Abundance', numberOfAyahs: 3, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الکوثر', urduMeaning: 'حوضِ کوثر، خیرِ کثیر' },
  { number: 109, name: 'سُورَةُ الكَافِرُونَ', englishName: 'Al-Kaafiroon', englishNameTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الکافرون', urduMeaning: 'کافر لوگ' },
  { number: 110, name: 'سُورَةُ النَّصْرِ', englishName: 'An-Nasr', englishNameTranslation: 'Divine Support', numberOfAyahs: 3, revelationType: 'Medinan', revelationTypeUrdu: 'مدنی', urduName: 'سورۃ النصر', urduMeaning: 'اللہ کی مدد و نصرت' },
  { number: 111, name: 'سُورَةُ المَسَدِ', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fibre', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ المسد (لہب)', urduMeaning: 'کھجور کی رسی' },
  { number: 112, name: 'سُورَةُ الإِخْلَاصِ', englishName: 'Al-Ikhlaas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الاخلاص (ثلثِ قرآن)', urduMeaning: 'خالص توحید' },
  { number: 113, name: 'سُورَةُ الفَلَقِ', englishName: 'Al-Falaq', englishNameTranslation: 'The Dawn', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الفلق', urduMeaning: 'صبح کا وقت' },
  { number: 114, name: 'سُورَةُ النَّاسِ', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan', revelationTypeUrdu: 'مکی', urduName: 'سورۃ الناس', urduMeaning: 'تمام انسان' },
];

/**
 * تمام ۱۱۴ سورتوں کی فہرست
 */
export async function getAllSurahs(): Promise<SurahMeta[]> {
  return ALL_SURAHS_DATA;
}

/**
 * مخصوص سورت کی آیات مع عربی متن، اردو ترجمہ اور آڈیو تلاوت
 */
export async function getSurahDetail(surahNumber: number, qariIdentifier: string = 'ar.alafasy'): Promise<SurahDetail | null> {
  const meta = ALL_SURAHS_DATA.find((s) => s.number === surahNumber);
  if (!meta) return null;

  try {
    // عربی متن اور مولانا فتح محمد جالندھری کا اردو ترجمہ بیک وقت حاصل کریں
    const textRes = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ur.jalandhry`,
      {
        next: { revalidate: 86400 }, // ۲۴ گھنٹے کیشنگ
      }
    );

    if (!textRes.ok) throw new Error(`Text API error ${textRes.status}`);
    const textData = await textRes.json();

    const arabicAyahs = textData.data?.[0]?.ayahs || [];
    const urduAyahs = textData.data?.[1]?.ayahs || [];

    // سورت کے لیے منتخب قاری کی آڈیو لسٹ
    let audioAyahs: any[] = [];
    try {
      const audioRes = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/${qariIdentifier}`,
        { next: { revalidate: 86400 } }
      );
      if (audioRes.ok) {
        const audioData = await audioRes.json();
        audioAyahs = audioData.data?.ayahs || [];
      }
    } catch (e) {
      console.warn('Audio fetch failed, continuing without audio stream:', e);
    }

    const ayahs: AyahItem[] = arabicAyahs.map((ar: any, idx: number) => {
      let rawText = ar.text || '';
      
      // اگر سورت نمبر ۱ (فاتحہ) اور سورت نمبر ۹ (توبہ) کے علاوہ کوئی سورت ہو، اور پہلی آیت میں بسم اللہ موجود ہو،
      // تو بسم اللہ کو الگ کر کے ہیڈر میں دکھائیں تاکہ آیت نمبر ۱ کا اصل متن واضح رہے
      if (surahNumber !== 1 && surahNumber !== 9 && idx === 0) {
        const bismillahRegex = /^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/;
        rawText = rawText.replace(bismillahRegex, '');
      }

      return {
        number: ar.number,
        numberInSurah: ar.numberInSurah,
        text: rawText,
        translation: urduAyahs[idx]?.text || '',
        audioUrl: audioAyahs[idx]?.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ar.number}.mp3`,
        juz: ar.juz || 1,
        page: ar.page || 1,
        sajdah: Boolean(ar.sajdah),
      };
    });

    return {
      meta,
      ayahs,
    };
  } catch (error) {
    console.error(`Error loading surah ${surahNumber}:`, error);
    return null;
  }
}
