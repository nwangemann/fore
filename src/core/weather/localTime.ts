/**
 * Open-Meteo returns wall-clock times at the place ("2026-11-25T20:00") with no offset.
 * These helpers read them as text so the device's own time zone never shifts them.
 */

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** "2026-11-25T20:30" → "2026-11-25T20:00" */
export function hourKey(localTime: string): string {
  return `${localTime.slice(0, 13)}:00`;
}

/** "2026-11-25T20:00" → "8 pm"; "…T12:00" → "Noon". */
export function hourLabel(localTime: string): string {
  const h = Number(localTime.slice(11, 13));
  if (h === 0) return 'Midnight';
  if (h === 12) return 'Noon';
  return `${h % 12} ${h < 12 ? 'am' : 'pm'}`;
}

/** "2026-11-25T07:04" → "7:04 am" */
export function clockLabel(localTime: string): string {
  const h = Number(localTime.slice(11, 13));
  const m = localTime.slice(14, 16);
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${h < 12 ? 'am' : 'pm'}`;
}

/** "2026-11-25" → "Wed" */
export function weekdayLabel(localDate: string): string {
  const [y, m, d] = localDate.split('-').map(Number);
  const day = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).getUTCDay();
  return weekdays[day] ?? '';
}

/** Minutes between two local times on any dates, e.g. sunrise to sunset. */
export function minutesBetween(from: string, to: string): number {
  const toMs = (t: string) =>
    Date.UTC(
      Number(t.slice(0, 4)),
      Number(t.slice(5, 7)) - 1,
      Number(t.slice(8, 10)),
      Number(t.slice(11, 13)),
      Number(t.slice(14, 16)),
    );
  return Math.round((toMs(to) - toMs(from)) / 60000);
}
