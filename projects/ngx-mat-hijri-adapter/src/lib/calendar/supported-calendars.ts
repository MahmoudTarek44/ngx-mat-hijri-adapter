import { GregorianCalendar, IslamicUmalquraCalendar, type Calendar } from '@internationalized/date';

/** Calendar codes accepted by this package. */
export const CalendarCode = {
  gregorian: 'gregorian',
  umalqura: 'islamic-umalqura',
} as const;

export type SupportedCalendar = (typeof CalendarCode)[keyof typeof CalendarCode];

const calendars = {
  [CalendarCode.gregorian]: new GregorianCalendar(),
  [CalendarCode.umalqura]: new IslamicUmalquraCalendar(),
} as const satisfies Record<SupportedCalendar, Calendar>;

export function supportedCalendar(id: SupportedCalendar): Calendar {
  switch (id) {
    case CalendarCode.gregorian:
    case CalendarCode.umalqura:
      return calendars[id];
    default:
      return assertNever(id);
  }
}

function assertNever(id: never): never {
  throw new Error(`Unsupported calendar "${String(id)}".`);
}
