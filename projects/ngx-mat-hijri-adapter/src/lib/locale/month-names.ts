const ENGLISH_LONG = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qadah',
  'Dhu al-Hijjah',
] as const;

const ENGLISH_SHORT = [
  'Muh',
  'Saf',
  'Rab I',
  'Rab II',
  'Jum I',
  'Jum II',
  'Raj',
  'Sha',
  'Ram',
  'Shaw',
  'Qid',
  'Hij',
] as const;

const ARABIC_LONG = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
] as const;

const ENGLISH_NARROW = [
  'Muh',
  'Saf',
  'R1',
  'R2',
  'J1',
  'J2',
  'Raj',
  'Shb',
  'Ram',
  'Shw',
  'Qid',
  'Hij',
] as const;

const ALIASES: readonly (readonly [string, number])[] = [
  ['ذي الحجة', 12],
  ['ذي الحجه', 12],
  ["rabi' al-awwal", 3],
  ['rabi’ al-awwal', 3],
  ['dhul hijjah', 12],
  ['dhul-hijjah', 12],
  ["dhu'l-hijjah", 12],
  ['thul hijjah', 12],
  ['ramadhan', 9],
  ["sha'ban", 8],
];

const monthNumbers = new Map<string, number>();

for (const names of [
  ENGLISH_LONG,
  ENGLISH_SHORT,
  ENGLISH_NARROW,
  ARABIC_LONG,
  arabicShort((value) => String(value)),
  arabicShort(easternDigit),
]) {
  names.forEach((name, index) => monthNumbers.set(normalizeMonthLabel(name), index + 1));
}

for (const [label, month] of ALIASES) {
  monthNumbers.set(normalizeMonthLabel(label), month);
}

function arabicShort(digit: (value: number) => string): string[] {
  return [
    'محرم',
    'صفر',
    `ربيع ${digit(1)}`,
    `ربيع ${digit(2)}`,
    `جمادى ${digit(1)}`,
    `جمادى ${digit(2)}`,
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ];
}

function easternDigit(value: number): string {
  return String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)] ?? digit);
}

function localeDigit(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { useGrouping: false }).format(value);
}

export function umalquraMonthNames(locale: string, style: 'long' | 'short' | 'narrow'): string[] {
  const arabic = usesArabicMonthNames(locale);

  if (style === 'long') {
    return [...(arabic ? ARABIC_LONG : ENGLISH_LONG)];
  }

  if (style === 'short') {
    return arabic ? arabicShort((value) => localeDigit(value, locale)) : [...ENGLISH_SHORT];
  }

  if (arabic) {
    return Array.from({ length: 12 }, (_, index) => localeDigit(index + 1, locale));
  }

  return [...ENGLISH_NARROW];
}

/** Month number from a fixed Umm al-Qura name, or null when the label is not one of those names. */
export function umalquraMonthNumber(label: string): number | null {
  return monthNumbers.get(normalizeMonthLabel(label)) ?? null;
}

export function usesArabicMonthNames(locale: string): boolean {
  return locale.toLowerCase().replaceAll('_', '-').startsWith('ar');
}

export function normalizeMonthLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ').toLowerCase();
}
