import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { Air } from '@/core/air/air';
import type { Alert } from '@/core/alerts/alerts';
import type { Normal } from '@/core/climate/normals';
import type { Place } from '@/core/place/place';
import type { Units } from '@/core/units';
import type { Forecast } from '@/core/weather/forecast';
import { readCache, writeCache } from '@/services/cache';
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
  /** True while showing the cached copy from a previous visit. */
  fromCache: boolean;
  refresh: () => void;
};

type Loaded = {
  key: string;
  forecast: Forecast | null;
  air: Air | null;
  alerts: Alert[];
  alertsFailed: boolean;
  error: string | null;
  updatedAt: string | null;
  fromCache: boolean;
};

const STALE_MS = 10 * 60 * 1000;
const empty = (key: string): Loaded => ({
  key,
  forecast: null,
  air: null,
  alerts: [],
  alertsFailed: false,
  error: null,
  updatedAt: null,
  fromCache: false,
});

async function fetchAll(place: Place, units: Units, key: string): Promise<Loaded> {
  const [f, a, w] = await Promise.allSettled([
    fetchForecast(place, units),
    fetchAir(place),
    fetchAlerts(place),
  ]);
  return {
    key,
    forecast: f.status === 'fulfilled' ? f.value : null,
    error:
      f.status === 'fulfilled'
        ? null
        : f.reason instanceof Error
          ? f.reason.message
          : 'The forecast went out of bounds',
    air: a.status === 'fulfilled' ? a.value : null,
    alerts: w.status === 'fulfilled' ? w.value : [],
    alertsFailed: w.status === 'rejected',
    updatedAt: new Date().toISOString(),
    fromCache: false,
  };
}

/**
 * Loads every source for a place in parallel and keeps it fresh. The last good result
 * is cached per place and units, so a new visit paints at once and then refreshes.
 */
export function useDashboard(place: Place, units: Units, enabled = true): Dashboard {
  const placeKey = `${place.latitude.toFixed(3)},${place.longitude.toFixed(3)}`;
  const key = `${placeKey},${units}`;
  const [data, setData] = useState<Loaded>(() => empty(key));
  const [normals, setNormals] = useState<{ key: string; value: Record<string, Normal | null> }>({
    key: '',
    value: {},
  });
  const [refreshing, setRefreshing] = useState(false);
  const run = useRef(0);
  const lastLoad = useRef(0);

  const load = useCallback(() => {
    const id = ++run.current;
    lastLoad.current = Date.now();
    return fetchAll(place, units, key).then((next) => {
      if (id !== run.current) return;
      setRefreshing(false);
      setData((prev) => {
        const kept = prev.key === key ? prev : empty(key);
        // A failed refresh keeps the last good forecast, still marked with its own time.
        if (!next.forecast && kept.forecast) return { ...kept, error: next.error };
        return next;
      });
      if (!next.forecast) return;
      void writeCache(`dash.${key}`, next);
      fetchNormals(
        place,
        next.forecast.days.map((d) => d.date),
      )
        .then((value) => setNormals({ key: placeKey, value }))
        .catch(() => {});
    });
  }, [place, units, key, placeKey]);

  useEffect(() => {
    if (!enabled) return;
    let live = true;
    readCache<Loaded>(`dash.${key}`).then((cached) => {
      if (!live || !cached?.forecast) return;
      setData((prev) =>
        prev.key === key && prev.forecast ? prev : { ...cached, key, fromCache: true },
      );
    });
    void load();
    const stale = () => Date.now() - lastLoad.current > STALE_MS;
    const timer = setInterval(() => stale() && void load(), 60 * 1000);
    const sub = AppState.addEventListener(
      'change',
      (s) => s === 'active' && stale() && void load(),
    );
    return () => {
      live = false;
      clearInterval(timer);
      sub.remove();
    };
  }, [load, key, enabled]);

  const refresh = () => {
    setRefreshing(true);
    void load();
  };

  // Data for a previous place or unit system is never shown.
  const shown = data.key === key ? data : empty(key);
  return {
    ...shown,
    updatedAt: shown.updatedAt ? new Date(shown.updatedAt) : null,
    normals: normals.key === placeKey ? normals.value : {},
    loading: refreshing || shown.fromCache || (!shown.forecast && !shown.error),
    refresh,
  };
}
