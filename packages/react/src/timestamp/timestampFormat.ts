export type NormalizedTimestamp = {
  date: Date;
  dateTime: string;
  milliseconds: number;
};

export type AbsoluteTimestampFormat = 'date' | 'time' | 'datetime';

export const timestampPresets = {
  date: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  time: {
    hour: 'numeric',
    minute: '2-digit',
  },
  datetime: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  },
} satisfies Record<AbsoluteTimestampFormat, Intl.DateTimeFormatOptions>;

const OFFSET_TIMESTAMP =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})$/;

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function isCompleteOffsetTimestamp(value: string) {
  const match = OFFSET_TIMESTAMP.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const offset = match[8]!;

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month) ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return false;
  }

  if (offset !== 'Z') {
    const offsetHours = Number(offset.slice(1, 3));
    const offsetMinutes = Number(offset.slice(4, 6));
    if (offsetHours > 23 || offsetMinutes > 59) {
      return false;
    }
  }

  return true;
}

export function normalizeTimestampValue(value: unknown): NormalizedTimestamp | null {
  let milliseconds: number;

  if (value instanceof Date) {
    milliseconds = new Date(value.getTime()).getTime();
  } else if (typeof value === 'number') {
    milliseconds = value;
  } else if (typeof value === 'string' && isCompleteOffsetTimestamp(value)) {
    milliseconds = Date.parse(value);
  } else {
    return null;
  }

  if (!Number.isFinite(milliseconds)) {
    return null;
  }

  const date = new Date(milliseconds);
  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  try {
    return {
      date,
      dateTime: date.toISOString(),
      milliseconds,
    };
  } catch {
    return null;
  }
}

function hasValidLocaleAndTimeZone(locale: unknown, timeZone: unknown) {
  if (
    typeof locale !== 'string' ||
    locale.trim() === '' ||
    typeof timeZone !== 'string' ||
    timeZone.trim() === ''
  ) {
    return false;
  }

  try {
    const formatter = new Intl.DateTimeFormat(locale, { timeZone });
    void formatter;
    return true;
  } catch {
    return false;
  }
}

export function formatAbsoluteTimestamp(
  value: NormalizedTimestamp,
  locale: unknown,
  timeZone: unknown,
  format: unknown,
  formatOptions: unknown,
) {
  if (
    !hasValidLocaleAndTimeZone(locale, timeZone) ||
    (format !== 'date' && format !== 'time' && format !== 'datetime') ||
    (formatOptions !== undefined &&
      (typeof formatOptions !== 'object' || formatOptions === null || Array.isArray(formatOptions)))
  ) {
    return null;
  }

  try {
    const options = {
      ...timestampPresets[format],
      ...(formatOptions as Intl.DateTimeFormatOptions | undefined),
      timeZone: timeZone as string,
    };
    return new Intl.DateTimeFormat(locale as string, options).format(value.date);
  } catch {
    return null;
  }
}

type RelativeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

const relativeUnits: ReadonlyArray<{
  unit: RelativeUnit;
  milliseconds: number;
  upperBound: number;
}> = [
  { unit: 'second', milliseconds: 1_000, upperBound: 60_000 },
  { unit: 'minute', milliseconds: 60_000, upperBound: 3_600_000 },
  { unit: 'hour', milliseconds: 3_600_000, upperBound: 86_400_000 },
  { unit: 'day', milliseconds: 86_400_000, upperBound: 604_800_000 },
  { unit: 'week', milliseconds: 604_800_000, upperBound: 2_592_000_000 },
  { unit: 'month', milliseconds: 2_592_000_000, upperBound: 31_536_000_000 },
  { unit: 'year', milliseconds: 31_536_000_000, upperBound: Number.POSITIVE_INFINITY },
];

function roundHalfAwayFromZero(value: number) {
  return Math.sign(value) * Math.floor(Math.abs(value) + 0.5);
}

export function formatRelativeTimestamp(
  targetMilliseconds: number,
  nowMilliseconds: number,
  formatter: Intl.RelativeTimeFormat,
) {
  if (!Number.isFinite(targetMilliseconds) || !Number.isFinite(nowMilliseconds)) {
    return null;
  }

  const delta = targetMilliseconds - nowMilliseconds;
  const absoluteDelta = Math.abs(delta);
  const selected =
    relativeUnits.find(({ upperBound }) => absoluteDelta < upperBound) ??
    relativeUnits[relativeUnits.length - 1]!;
  const value = roundHalfAwayFromZero(delta / selected.milliseconds);

  try {
    return formatter.format(value, selected.unit);
  } catch {
    return null;
  }
}

export function createRelativeTimestampFormatter(locale: unknown, timeZone: unknown) {
  if (!hasValidLocaleAndTimeZone(locale, timeZone)) {
    return null;
  }

  try {
    return new Intl.RelativeTimeFormat(locale as string, {
      numeric: 'auto',
      style: 'long',
    });
  } catch {
    return null;
  }
}

export function normalizeRefreshInterval(value: unknown) {
  if (value === undefined) {
    return 60_000;
  }
  if (value === 0) {
    return 0;
  }
  return typeof value === 'number' && Number.isFinite(value) && value >= 1_000 ? value : null;
}
