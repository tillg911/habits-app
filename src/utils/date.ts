import { format, parseISO, subDays, isToday, isYesterday, startOfDay } from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';

export function getTodayString(): string {
  return format(new Date(), DATE_FORMAT);
}

export function getYesterdayString(): string {
  return format(subDays(new Date(), 1), DATE_FORMAT);
}

export function formatDateString(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function parseDateString(dateString: string): Date {
  return parseISO(dateString);
}

export function subtractDays(dateString: string, days: number): string {
  const date = parseISO(dateString);
  return format(subDays(date, days), DATE_FORMAT);
}

export function isDateToday(dateString: string): boolean {
  return isToday(parseISO(dateString));
}

export function isDateYesterday(dateString: string): boolean {
  return isYesterday(parseISO(dateString));
}

export function getDayOfWeek(dateString: string): number {
  return parseISO(dateString).getDay();
}

export function getStartOfDay(date: Date = new Date()): Date {
  return startOfDay(date);
}

export function createISOTimestamp(): string {
  return new Date().toISOString();
}
