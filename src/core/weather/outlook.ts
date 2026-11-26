import type { Normal } from '../climate/normals';
import type { Units } from '../units';
import { condition } from './codes';
import type { Day, Hour, Slot } from './forecast';
import { deltaFromC, toC, toKmh, toMm } from './score';

/** "4 am"/"Noon" style label for an hour number 0–23. */
function hourName(h: number): string {
  const x = ((h % 24) + 24) % 24;
  if (x === 0) return 'midnight';
  if (x === 12) return 'noon';
  return `${x % 12} ${x < 12 ? 'am' : 'pm'}`;
}

const hourOf = (time: string) => Number(time.slice(11, 13));

/** "4–9 am", "10 am–2 pm", "11 pm–3 am". `endHour` is exclusive. */
export function rangeLabel(startHour: number, endHour: number): string {
  const a = hourName(startHour);
  const b = hourName(endHour);
  const plain = (x: string) => x.endsWith(' am') || x.endsWith(' pm');
  return plain(a) && plain(b) && a.slice(-2) === b.slice(-2)
    ? `${a.slice(0, -3)}–${b}`
    : `${a}–${b}`;
}

const isWet = (h: Hour, units: Units) =>
  h.precipChance >= 50 || (h.precipChance >= 30 && toMm(h.precipitation, units) >= 0.2);

function wetWord(hours: Hour[]): string {
  const moods = hours.map((h) => condition(h.code).mood);
  if (moods.includes('storm')) return 'Storms';
  if (moods.filter((m) => m === 'snow').length > hours.length / 2) return 'Snow';
  return 'Rain';
}

/** Rain timing for the next `window` hours as one or two short sentences. */
export function rainOutlook(hours: Hour[], units: Units, window = 18): string {
  const next = hours.slice(0, window);
  const spans: Hour[][] = [];
  let run: Hour[] = [];
  for (const h of next) {
    if (isWet(h, units)) run.push(h);
    else if (run.length) {
      spans.push(run);
      run = [];
    }
  }
  if (run.length) spans.push(run);
  if (!spans.length) return `Dry for the next ${window} hours.`;

  const parts = spans.slice(0, 2).map((span, i) => {
    const first = span[0]!;
    const last = span[span.length - 1]!;
    const word = wetWord(span);
    const end = hourOf(last.time) + 1;
    let text =
      first === next[0]
        ? `${word} until ${hourName(end)}`
        : `${i ? 'then again' : word} ${rangeLabel(hourOf(first.time), end)}`;
    if (span.length >= 3) {
      const peak = span.reduce((a, b) => (b.precipitation > a.precipitation ? b : a));
      if (peak.precipitation > 0) text += `, heaviest around ${hourName(hourOf(peak.time))}`;
    }
    return text;
  });
  const lastSpan = spans[Math.min(spans.length, 2) - 1]!;
  const tail = lastSpan[lastSpan.length - 1] !== next[next.length - 1] ? ' Dry after.' : '';
  const sentence = parts.join(', ');
  return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.${tail}`;
}

/** Next-two-hours line from 15-minute steps, or null when nothing changes. */
export function nowcastLine(slots: Slot[], snowing = false): string | null {
  if (slots.length < 2) return null;
  const wet = slots.map((s) => s.precipitation > 0);
  const word = snowing ? 'Snow' : 'Rain';
  if (wet[0]) {
    const dry = wet.indexOf(false);
    return dry === -1
      ? `${word} for at least the next 2 hours.`
      : `${word} easing in about ${dry * 15} min.`;
  }
  const start = wet.indexOf(true);
  return start === -1 ? null : `${word} starting in about ${start * 15} min.`;
}

export type BagItem = { label: string };

/** What to take out the door for the next 12 hours. */
export function inTheBag(hours: Hour[], today: Day | undefined, units: Units): BagItem[] {
  const next = hours.slice(0, 12);
  if (!next.length) return [];
  const coldest = Math.min(...next.map((h) => toC(h.feelsLike, units)));
  const items: BagItem[] = [];
  if (coldest < 0) items.push({ label: 'Winter coat' });
  else if (coldest < 10) items.push({ label: 'Warm layer' });
  else if (coldest < 16) items.push({ label: 'Light jacket' });
  if (next.some((h) => isWet(h, units))) items.push({ label: 'Umbrella' });
  if (today && today.uvMax >= 5 && next.some((h) => h.isDay)) items.push({ label: 'Sunscreen' });
  return items;
}

export type TeeTime = { label: string; when: 'today' | 'tomorrow'; soggy: boolean };

/**
 * The best two daylight hours left today, or tomorrow once today's light is gone.
 * Dry beats calm beats comfortable (about 20 °C feels-like).
 */
export function bestTeeTime(hours: Hour[], units: Units, days: Day[] = []): TeeTime | null {
  const cost = (h: Hour) =>
    h.precipChance / 10 +
    Math.max(0, toKmh(h.windSpeed, units) - 15) / 5 +
    Math.abs(toC(h.feelsLike, units) - 20) / 3;
  const firstDate = hours[0]?.time.slice(0, 10);
  for (const when of ['today', 'tomorrow'] as const) {
    const day = hours.filter((h) => (when === 'today') === (h.time.slice(0, 10) === firstDate));
    const date = day[0]?.time.slice(0, 10);
    const sun = days.find((d) => d.date === date);
    // A whole hour of play must fit between sunrise and sunset.
    const light = day.filter((h) => {
      if (h.time.slice(0, 10) !== date) return false;
      if (!sun?.sunrise || !sun.sunset) return h.isDay;
      const end = `${date}T${String(hourOf(h.time) + 1).padStart(2, '0')}:00`;
      return h.time >= sun.sunrise.slice(0, 13) + ':00' && end <= sun.sunset;
    });
    let best: { i: number; c: number } | null = null;
    for (let i = 0; i + 1 < light.length; i++) {
      const a = light[i]!;
      const b = light[i + 1]!;
      if (hourOf(b.time) !== hourOf(a.time) + 1) continue;
      const c = cost(a) + cost(b);
      if (!best || c < best.c) best = { i, c };
    }
    if (best) {
      const a = light[best.i]!;
      const b = light[best.i + 1]!;
      return {
        label: rangeLabel(hourOf(a.time), hourOf(b.time) + 1),
        when,
        soggy: a.precipChance >= 60 && b.precipChance >= 60,
      };
    }
  }
  return null;
}

/** "6° warmer than yesterday" from the same hour yesterday. */
export function versusYesterday(now: number, then: Hour | null, units: Units): string | null {
  if (!then) return null;
  const diff = Math.round(now - then.temperature);
  const small = units === 'imperial' ? 2 : 1;
  if (Math.abs(diff) < small) return 'About the same as yesterday';
  return `${Math.abs(diff)}° ${diff > 0 ? 'warmer' : 'cooler'} than yesterday`;
}

/** "7° above normal" for today's high against the seasonal normal. */
export function versusNormal(high: number, normal: Normal | null, units: Units): string | null {
  if (!normal) return null;
  const diff = Math.round(deltaFromC(toC(high, units) - normal.high, units));
  const small = units === 'imperial' ? 2 : 1;
  if (Math.abs(diff) < small) return 'A normal high for the season';
  return `High ${Math.abs(diff)}° ${diff > 0 ? 'above' : 'below'} normal`;
}
