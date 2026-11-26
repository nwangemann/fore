import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Place } from '@/core/place/place';
import { Icon } from '@/ui/icons/Icon';
import { color, font, radius, space } from '@/ui/tokens';

type Props = {
  place: Place;
  loading: boolean;
  updatedAt: Date | null;
  fromCache: boolean;
  /** Why the card shown may be old: the refresh failed, or the device is offline. */
  problem: 'failed' | 'offline' | null;
  onRefresh: () => void;
};

export function Header({ place, loading, updatedAt, fromCache, problem, onRefresh }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.brand}>
        <Text style={styles.logo} accessibilityRole="header">
          fore!
        </Text>
        <Text style={styles.tag}>your daily fore-cast</Text>
      </View>
      <View style={styles.row}>
        <Link href="/course" asChild>
          <Pressable style={styles.pill} accessibilityLabel={`Change course, now ${place.name}`}>
            <Icon name="flag" size={36} style={styles.flag} />
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.place} numberOfLines={1}>
                {place.name}
              </Text>
              {place.detail ? (
                <Text style={styles.detail} numberOfLines={1}>
                  {place.detail}
                </Text>
              ) : null}
            </View>
            <Text style={styles.change}>Change course</Text>
          </Pressable>
        </Link>
        <Pressable onPress={onRefresh} style={styles.retee} accessibilityLabel="Refresh forecast">
          {loading ? (
            <ActivityIndicator color={color.ink} />
          ) : (
            <Text style={styles.reteeText}>Re-tee ↻</Text>
          )}
        </Pressable>
      </View>
      {updatedAt ? (
        <Text style={styles.updated}>
          {fromCache ? 'From your last visit, signed ' : 'Card signed '}
          {signedLabel(updatedAt)}
          {fromCache ? ' · updating…' : ''}
          {problem && !loading ? ` · ${PROBLEM[problem]}` : ''}
        </Text>
      ) : null}
    </View>
  );
}

const PROBLEM = { failed: 'couldn’t refresh, Re-tee to retry', offline: 'offline' } as const;

/** "7:57 PM" today, "Tue 7:57 PM" on another day. */
function signedLabel(at: Date): string {
  const time = at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (at.toDateString() === new Date().toDateString()) return time;
  return `${at.toLocaleDateString([], { weekday: 'short' })} ${time}`;
}

const styles = StyleSheet.create({
  wrap: { gap: space.md, marginBottom: space.lg },
  brand: { flexDirection: 'row', alignItems: 'baseline', gap: space.md, flexWrap: 'wrap' },
  logo: {
    fontFamily: font.display,
    fontSize: 64,
    lineHeight: 80,
    color: color.paper,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
  },
  tag: { fontFamily: font.medium, color: color.sand, fontSize: 16, letterSpacing: 0.5 },
  row: { flexDirection: 'row', gap: space.sm, alignItems: 'stretch' },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: color.paper,
    borderRadius: radius.lg,
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    minHeight: 52,
  },
  flag: { marginHorizontal: -6 },
  place: { fontFamily: font.bold, fontSize: 18, color: color.ink },
  detail: { fontFamily: font.body, fontSize: 13, color: color.inkSoft },
  change: {
    marginLeft: 'auto',
    fontFamily: font.medium,
    fontSize: 13,
    color: color.fairway,
    textDecorationLine: 'underline',
  },
  retee: {
    backgroundColor: color.sand,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    justifyContent: 'center',
    minWidth: 96,
    alignItems: 'center',
  },
  reteeText: { fontFamily: font.bold, color: color.ink, fontSize: 15 },
  updated: { fontFamily: font.medium, color: color.sand, fontSize: 13 },
});
