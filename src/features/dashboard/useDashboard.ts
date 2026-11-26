import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { Air } from '@/core/air/air';
import type { Alert } from '@/core/alerts/alerts';
import type { Place } from '@/core/place/place';
import type { Units } from '@/core/units';
import type { Forecast } from '@/core/weather/forecast';
import { fetchAlerts } from '@/services/nws';
import { fetchAir, fetchForecast } from '@/services/openMeteo';

export type Dashboard = {
  forecast: Forecast | null;
  air: Air | null;
  alerts: Alert[];
  /** Forecast failure; air and alerts fail quietly. */
  error: string | null;
  loading: boolean;
  updatedAt: Date | null;
  refresh: () => void;
};

type Loaded = Omit<Dashboard, 'loading' | 'refresh'> & { key: string };

const STALE_MS = 10 * 60 * 1000;
const empty = (key: string): Loaded => ({
  key,
  forecast: null,
  air: null,
  alerts: [],
  error: null,
  updatedAt: null,
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
    updatedAt: new Date(),
  };
}

/** Loads every source for a place in parallel and keeps it fresh. */
export function useDashboard(place: Place, units: Units): Dashboard {
  const key = `${place.latitude},${place.longitude},${units}`;
  const [data, setData] = useState<Loaded>(() => empty(key));
  const [refreshing, setRefreshing] = useState(false);
  const run = useRef(0);
  const lastLoad = useRef(0);

  const load = useCallback(() => {
    const id = ++run.current;
    lastLoad.current = Date.now();
    return fetchAll(place, units, key).then((next) => {
      if (id !== run.current) return;
      // A failed refresh keeps the last good forecast for the same place.
      setData((prev) => ({
        ...next,
        forecast: next.forecast ?? (prev.key === key ? prev.forecast : null),
      }));
      setRefreshing(false);
    });
  }, [place, units, key]);

  useEffect(() => {
    void load();
    const stale = () => Date.now() - lastLoad.current > STALE_MS;
    const timer = setInterval(() => stale() && void load(), 60 * 1000);
    const sub = AppState.addEventListener(
      'change',
      (s) => s === 'active' && stale() && void load(),
    );
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [load]);

  const refresh = () => {
    setRefreshing(true);
    void load();
  };

  // Data for a previous place or unit system is never shown.
  const shown = data.key === key ? data : empty(key);
  return { ...shown, loading: refreshing || data.key !== key, refresh };
}
