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

const ARABIC_SHORT = [
  'محرم',
  'صفر',
  'ربيع ١',
  'ربيع ٢',
  'جمادى ١',
  'جمادى ٢',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
] as const;

const monthNumbers = new Map<string, number>();

for (const names of [ENGLISH_LONG, ENGLISH_SHORT, ARABIC_LONG, ARABIC_SHORT]) {
  names.forEach((name, index) => monthNumbers.set(normalizeMonthLabel(name), index + 1));
}

export function umalquraMonthNames(locale: string, style: 'long' | 'short' | 'narrow'): string[] {
  const arabic = usesArabicMonthNames(locale);

  if (style === 'long') {
    return [...(arabic ? ARABIC_LONG : ENGLISH_LONG)];
  }

  if (style === 'short') {
    return [...(arabic ? ARABIC_SHORT : ENGLISH_SHORT)];
  }

  const source = arabic ? ARABIC_SHORT : ENGLISH_SHORT;
  return source.map((name) => Array.from(name)[0] ?? name);
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
