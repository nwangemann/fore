import AsyncStorage from '@react-native-async-storage/async-storage';

/** Small JSON cache in AsyncStorage (localStorage on web). Failures are ignored. */
export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const text = await AsyncStorage.getItem(`fore.cache.${key}`);
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

export async function writeCache(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(`fore.cache.${key}`, JSON.stringify(value));
  } catch {
    // A full or unavailable store only costs us the cache.
  }
}
