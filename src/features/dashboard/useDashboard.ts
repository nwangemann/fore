import { useQuery } from '@tanstack/react-query';
import type { Air } from '@/core/air/air';
import type { Alert } from '@/core/alerts/alerts';
import { archiveRange, normalFor, type Normal } from '@/core/climate/normals';
import type { Place } from '@/core/place/place';
import type { Units } from '@/core/units';
import type { Forecast } from '@/core/weather/forecast';
import { courseVariant, type CourseVariant } from '@/core/weather/variant';
import { fetchAlerts } from '@/services/nws';
import { fetchAir, fetchArchive, fetchForecast } from '@/services/openMeteo';
import { useSettings, useSettingsHydrated } from '@/state/settings';
import { previewVariant } from '@/ui/previewVariant';

export type Dashboard = {
  forecast: Forecast | null;
  air: Air | null;
  alerts: Alert[];
  /** True when the alert check itself failed, so "no alerts" is unknown. */
  alertsFailed: boolean;
  /** Seasonal normal per date (YYYY-MM-DD). Empty until the archive loads. */
  normals: Record<string, Normal | null>;
  /** Forecast failure; the other sources fail quietly. */
  error: string | null;
  loading: boolean;
  /** True while the forecast fetch is paused because the device is offline. */
  offline: boolean;
  updatedAt: Date | null;
  /** True while the forecast shown is from a previous visit and a refresh is under way. */
  fromCache: boolean;
  refresh: () => void;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_MS = 10 * 60 * 1000;
const live = { staleTime: STALE_MS, refetchInterval: STALE_MS };
/** Data updated before this load came from the persisted cache. */
const LOADED_AT = Date.now();

const placeKey = (place: Place) => `${place.latitude.toFixed(3)},${place.longitude.toFixed(3)}`;

/** The forecast query, shared by the dashboard and the course variant. */
function forecastQuery(place: Place, units: Units, enabled: boolean) {
  return {
    queryKey: ['forecast', placeKey(place), units],
    queryFn: () => fetchForecast(place, units),
    enabled,
    ...live,
  };
}

/**
 * The course variant for the home course's current sky, for the stripes in the root
 * layout. It shares the dashboard's forecast query, so it adds no request; `day` until
 * the forecast loads. The `?course=` preview parameter overrides it on web.
 */
export function useCourseVariant(): CourseVariant {
  const { place, units } = useSettings();
  const hydrated = useSettingsHydrated();
  const { data } = useQuery(forecastQuery(place, units, hydrated));
  if (previewVariant) return previewVariant;
  return data ? courseVariant(data.current.code, data.current.isDay) : 'day';
}

/**
 * Composes one query per source. Keys carry the place (and units for the forecast), so
 * switching place starts empty instead of showing the old place's data.
 */
export function useDashboard(place: Place, units: Units, enabled = true): Dashboard {
  const at = placeKey(place);
  const f = useQuery(forecastQuery(place, units, enabled));
  const a = useQuery({ queryKey: ['air', at], queryFn: () => fetchAir(place), enabled, ...live });
  const w = useQuery({
    queryKey: ['alerts', at],
    queryFn: () => fetchAlerts(place),
    enabled,
    ...live,
  });
  const days = f.data?.days ?? [];
  const range = days[0] ? archiveRange(days[0].date) : null;
  const n = useQuery({
    queryKey: ['archive', at, range?.start],
    queryFn: () => (range ? fetchArchive(place, range) : Promise.resolve([])),
    enabled: enabled && range !== null,
    staleTime: Infinity,
    gcTime: 30 * DAY_MS,
  });
  const records = n.data;
  const normals = records
    ? Object.fromEntries(days.map((d) => [d.date, normalFor(records, d.date)]))
    : {};

  return {
    forecast: f.data ?? null,
    air: a.data ?? null,
    alerts: w.data ?? [],
    alertsFailed: w.isError,
    normals,
    error: f.error ? f.error.message || 'The forecast went out of bounds' : null,
    loading: f.isFetching || (f.isPending && !f.error && f.fetchStatus !== 'paused'),
    offline: f.fetchStatus === 'paused',
    updatedAt: f.dataUpdatedAt ? new Date(f.dataUpdatedAt) : null,
    fromCache: f.isFetching && f.dataUpdatedAt > 0 && f.dataUpdatedAt < LOADED_AT,
    refresh: () => void Promise.all([f.refetch(), a.refetch(), w.refetch()]),
  };
}
