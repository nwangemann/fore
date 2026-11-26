import { useQuery } from '@tanstack/react-query';
import type { Air } from '@/core/air/air';
import type { Alert } from '@/core/alerts/alerts';
import type { Normal } from '@/core/climate/normals';
import type { Place } from '@/core/place/place';
import type { Units } from '@/core/units';
import type { Forecast } from '@/core/weather/forecast';
import { fetchAlerts } from '@/services/nws';
import { fetchAir, fetchForecast, fetchNormals } from '@/services/openMeteo';

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
  updatedAt: Date | null;
  /** True while showing the cached copy from a previous visit (restored in step 3.2). */
  fromCache: boolean;
  refresh: () => void;
};

const STALE_MS = 10 * 60 * 1000;
const live = { staleTime: STALE_MS, refetchInterval: STALE_MS };

/**
 * Composes one query per source. Keys carry the place (and units for the forecast), so
 * switching place starts empty instead of showing the old place's data.
 */
export function useDashboard(place: Place, units: Units, enabled = true): Dashboard {
  const at = `${place.latitude.toFixed(3)},${place.longitude.toFixed(3)}`;
  const f = useQuery({
    queryKey: ['forecast', at, units],
    queryFn: () => fetchForecast(place, units),
    enabled,
    ...live,
  });
  const a = useQuery({ queryKey: ['air', at], queryFn: () => fetchAir(place), enabled, ...live });
  const w = useQuery({
    queryKey: ['alerts', at],
    queryFn: () => fetchAlerts(place),
    enabled,
    ...live,
  });
  const dates = f.data?.days.map((d) => d.date) ?? [];
  const n = useQuery({
    queryKey: ['normals', at, dates[0]],
    queryFn: () => fetchNormals(place, dates),
    enabled: enabled && dates.length > 0,
    staleTime: Infinity,
  });

  return {
    forecast: f.data ?? null,
    air: a.data ?? null,
    alerts: w.data ?? [],
    alertsFailed: w.isError,
    normals: n.data ?? {},
    error: f.error ? f.error.message || 'The forecast went out of bounds' : null,
    loading: f.isFetching || (f.isPending && !f.error),
    updatedAt: f.dataUpdatedAt ? new Date(f.dataUpdatedAt) : null,
    fromCache: false,
    refresh: () => void Promise.all([f.refetch(), a.refetch(), w.refetch()]),
  };
}
