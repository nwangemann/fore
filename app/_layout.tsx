import { Shrikhand_400Regular } from '@expo-google-fonts/shrikhand';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState, Platform, View } from 'react-native';
import { Stripes } from '@/ui/Stripes';
import { color, font } from '@/ui/tokens';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent', card: color.fairwayDeep },
};

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
