import { Shrikhand_400Regular } from '@expo-google-fonts/shrikhand';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { focusManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { DefaultTheme, type ErrorBoundaryProps, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState, Platform, ScrollView, View } from 'react-native';
import { installFocusRing } from '@/ui/a11y';
import { OutOfBounds } from '@/ui/OutOfBounds';
import { Stripes } from '@/ui/Stripes';
import { color, font, space } from '@/ui/tokens';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent', card: color.fairwayDeep },
};

const DAY_MS = 24 * 60 * 60 * 1000;

// gcTime must outlast a gap between visits, or there is nothing left to persist.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, gcTime: DAY_MS } },
});

// The query cache is saved to AsyncStorage (localStorage on web) and restored on start.
// Bump `buster` whenever a cached data shape changes, so old copies are dropped.
const persistOptions = {
  persister: createAsyncStoragePersister({ storage: AsyncStorage, key: 'fore.queries' }),
  buster: '1',
  maxAge: 30 * DAY_MS,
};

// The hand-rolled cache before the persister used `fore.cache.*` keys; drop the leftovers.
void AsyncStorage.getAllKeys()
  .then((keys) => AsyncStorage.multiRemove(keys.filter((k) => k.startsWith('fore.cache.'))))
  .catch(() => undefined);

installFocusRing();

// Web refetches on tab focus by itself; native needs the app's foreground state.
if (Platform.OS !== 'web') {
  focusManager.setEventListener((setFocused) => {
    const sub = AppState.addEventListener('change', (s) => setFocused(s === 'active'));
    return () => sub.remove();
  });
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Shrikhand_400Regular,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <View style={{ flex: 1, backgroundColor: color.fairway }}>
        <Stripes />
        <StatusBar style="light" />
        {loaded ? (
          <ThemeProvider value={theme}>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: 'transparent' },
                headerStyle: { backgroundColor: color.fairwayDeep },
                headerTintColor: color.paper,
                headerTitleStyle: { fontFamily: font.display },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false, title: 'fore!' }} />
              <Stack.Screen
                name="course"
                options={{ presentation: 'modal', title: 'Change course' }}
              />
            </Stack>
          </ThemeProvider>
        ) : null}
      </View>
    </PersistQueryClientProvider>
  );
}

/**
 * Expo Router's route-level boundary: a render error anywhere below the root shows this
 * card instead of a blank page. It replaces the layout, so it brings its own background.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: color.fairway }}>
      <Stripes />
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          padding: space.lg,
          paddingTop: space.xxl,
          width: '100%',
          maxWidth: 640,
          alignSelf: 'center',
        }}
      >
        <OutOfBounds
          message={`Something on the course broke: ${error.message || 'an unknown error'}. Take a drop and play it again.`}
          onRetry={() => void retry()}
          retryLabel="Play it again"
        />
      </ScrollView>
    </View>
  );
}
