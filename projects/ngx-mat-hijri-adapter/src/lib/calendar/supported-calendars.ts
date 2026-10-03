import { GregorianCalendar, IslamicUmalquraCalendar, type Calendar } from '@internationalized/date';

export type SupportedCalendar = 'gregorian' | 'islamic-umalqura';

const calendars = {
  gregorian: new GregorianCalendar(),
  'islamic-umalqura': new IslamicUmalquraCalendar(),
} as const satisfies Record<SupportedCalendar, Calendar>;

export function supportedCalendar(id: SupportedCalendar): Calendar {
  switch (id) {
    case 'gregorian':
    case 'islamic-umalqura':
      return calendars[id];
    default:
      return assertNever(id);
  }
}

function assertNever(id: never): never {
  throw new Error(`Unsupported calendar "${String(id)}".`);
}
