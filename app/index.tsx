import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AirCard } from '@/features/air/AirCard';
import { AlertBanner } from '@/features/alerts/AlertBanner';
import { Footer } from '@/features/dashboard/Footer';
import { Header } from '@/features/dashboard/Header';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { Round } from '@/features/forecast/Round';
import { NowCard } from '@/features/forecast/NowCard';
import { Scorecard } from '@/features/forecast/Scorecard';
import { YardageBook } from '@/features/forecast/YardageBook';
import { useSettings, useSettingsHydrated } from '@/state/settings';
import { OutOfBounds } from '@/ui/OutOfBounds';
import { color, font, space, WIDE } from '@/ui/tokens';

export default function Dashboard() {
  const { place, units } = useSettings();
  const hydrated = useSettingsHydrated();
  const d = useDashboard(place, units, hydrated);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= WIDE;

  return (
    <ScrollView
      contentContainerStyle={[styles.page, { paddingTop: insets.top + space.lg }]}
      refreshControl={
        <RefreshControl
          refreshing={d.loading && !!d.forecast}
          onRefresh={d.refresh}
          tintColor={color.paper}
        />
      }
    >
      <Header
        place={place}
        loading={d.loading}
        updatedAt={d.updatedAt}
        fromCache={d.fromCache}
        problem={d.offline ? 'offline' : d.error ? 'failed' : null}
        onRefresh={d.refresh}
      />
      <AlertBanner alerts={d.alerts} failed={d.alertsFailed} />
      {d.forecast ? (
        <View style={[styles.grid, wide && styles.gridWide]}>
          <View style={[styles.col, wide && { flex: 1.15 }]}>
            <NowCard
              forecast={d.forecast}
              units={units}
              normal={d.normals[d.forecast.days[0]?.date ?? ''] ?? null}
            />
            <Round hours={d.forecast.hours} />
            <Scorecard days={d.forecast.days} units={units} normals={d.normals} />
          </View>
          <View style={[styles.col, wide && { flex: 1 }]}>
            <YardageBook forecast={d.forecast} units={units} />
            <AirCard air={d.air} />
          </View>
        </View>
      ) : d.error ? (
        <OutOfBounds
          message={`Couldn’t load the forecast: ${d.error}. Give it another swing.`}
          onRetry={d.refresh}
        />
      ) : d.offline ? (
        <OutOfBounds
          message="You’re offline and there is no saved card for this course yet. It loads as soon as you’re back on the network."
          onRetry={d.refresh}
        />
      ) : (
        <Text style={styles.loading}>Teeing up the forecast…</Text>
      )}
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: space.lg,
    paddingBottom: space.xxl,
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
  },
  grid: { gap: space.lg },
  gridWide: { flexDirection: 'row', alignItems: 'flex-start' },
  col: { gap: space.lg, minWidth: 0 },
  loading: {
    fontFamily: font.display,
    fontSize: 24,
    color: color.paper,
    textAlign: 'center',
    marginTop: 60,
  },
});
