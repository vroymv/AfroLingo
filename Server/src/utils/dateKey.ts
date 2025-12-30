export const DEFAULT_TIMEZONE = "UTC";

export function getDateKeyInTimeZone(date: Date, timeZone?: string): string {
  const tz =
    timeZone && timeZone.trim().length > 0 ? timeZone : DEFAULT_TIMEZONE;

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // en-CA outputs YYYY-MM-DD
  return formatter.format(date);
}

export function dateFromDateKey(dateKey: string): Date {
  // Interpret YYYY-MM-DD as a pure calendar date.
  // We convert to a UTC Date at 00:00Z to keep a stable mapping.
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export function addDaysToDateKey(dateKey: string, days: number): string {
  const base = dateFromDateKey(dateKey);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().split("T")[0];
}

function getTimeZoneOffsetMillis(dateUtc: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = dtf.formatToParts(dateUtc);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  const asUtcMillis = Date.UTC(year, month - 1, day, hour, minute, second);
  return asUtcMillis - dateUtc.getTime();
}

function utcInstantForLocalMidnight(dateKey: string, timeZone: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  const desiredLocalAsUtcMillis = Date.UTC(y, m - 1, d, 0, 0, 0, 0);

  // Iterate because the offset depends on the UTC instant (DST transitions).
  let guessUtcMillis = desiredLocalAsUtcMillis;
  for (let i = 0; i < 3; i++) {
    const offsetMillis = getTimeZoneOffsetMillis(
      new Date(guessUtcMillis),
      timeZone
    );
    const nextGuessUtcMillis = desiredLocalAsUtcMillis - offsetMillis;
    if (Math.abs(nextGuessUtcMillis - guessUtcMillis) < 1000) {
      guessUtcMillis = nextGuessUtcMillis;
      break;
    }
    guessUtcMillis = nextGuessUtcMillis;
  }

  return new Date(guessUtcMillis);
}

export function getUtcRangeForDateKeyInTimeZone(
  dateKey: string,
  timeZone?: string
): { startUtc: Date; endUtc: Date } {
  const tz =
    timeZone && timeZone.trim().length > 0 ? timeZone : DEFAULT_TIMEZONE;

  const startUtc = utcInstantForLocalMidnight(dateKey, tz);
  const nextKey = addDaysToDateKey(dateKey, 1);
  const endUtc = utcInstantForLocalMidnight(nextKey, tz);

  return { startUtc, endUtc };
}
