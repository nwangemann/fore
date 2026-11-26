import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_PLACE, type Place } from '@/core/place/place';
import type { Units } from '@/core/units';

type Settings = {
  /** The home course: what the dashboard shows on every open. */
  place: Place;
  units: Units;
  /** When on, the dashboard re-reads the device location on each open. */
  followMe: boolean;
  /** Recently picked places, newest first. */
  recent: Place[];
  setPlace: (place: Place) => void;
  setUnits: (units: Units) => void;
  setFollowMe: (on: boolean) => void;
};

const same = (a: Place, b: Place) =>
  Math.abs(a.latitude - b.latitude) < 0.01 && Math.abs(a.longitude - b.longitude) < 0.01;

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      place: DEFAULT_PLACE,
      units: 'imperial',
      followMe: false,
      recent: [],
      setPlace: (place) =>
        set((s) => ({
          place,
          recent: [place, ...s.recent.filter((p) => !same(p, place))].slice(0, 5),
        })),
      setUnits: (units) => set({ units }),
      setFollowMe: (followMe) => set({ followMe }),
    }),
    { name: 'fore.settings', version: 1, storage: createJSONStorage(() => AsyncStorage) },
  ),
);
