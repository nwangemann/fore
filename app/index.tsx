import { useEffect } from 'react';
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
import { FrontNine } from '@/features/forecast/FrontNine';
import { NowCard } from '@/features/forecast/NowCard';
import { Scorecard } from '@/features/forecast/Scorecard';
import { YardageBook } from '@/features/forecast/YardageBook';
import { currentPlace } from '@/services/location';
import { useSettings } from '@/state/settings';
import { Card } from '@/ui/Card';
import { color, font, space, WIDE } from '@/ui/tokens';

export default function Dashboard() {
  const { place, units, followMe, setPlace } = useSettings();
  const d = useDashboard(place, units);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= WIDE;

  useEffect(() => {
    if (!followMe) return;
    currentPlace()
      .then(setPlace)
      .catch(() => {});
  }, [followMe, setPlace]);

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
      <Header place={place} loading={d.loading} updatedAt={d.updatedAt} onRefresh={d.refresh} />
      <AlertBanner alerts={d.alerts} />
      {d.error && !d.forecast ? (
        <Card title="Out of bounds">
          <Text style={styles.error}>
            Couldn’t load the forecast: {d.error}. Tap Re-tee to try again.
          </Text>
        </Card>
      ) : null}
      {d.forecast ? (
        <View style={[styles.grid, wide && styles.gridWide]}>
          <View style={[styles.col, wide && { flex: 1.15 }]}>
            <NowCard forecast={d.forecast} units={units} />
            <FrontNine hours={d.forecast.hours} />
            <Scorecard days={d.forecast.days} units={units} />
          </View>
          <View style={[styles.col, wide && { flex: 1 }]}>
            <YardageBook forecast={d.forecast} units={units} />
            <AirCard air={d.air} />
          </View>
        </View>
      ) : !d.error ? (
        <Text style={styles.loading}>Teeing up the forecast…</Text>
      ) : null}
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
  error: { fontFamily: font.body, color: color.ink, fontSize: 15 },
});
