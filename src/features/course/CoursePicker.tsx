import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Place } from '@/core/place/place';
import type { Units } from '@/core/units';
import { currentPlace, LocationDenied } from '@/services/location';
import { searchPlaces } from '@/services/openMeteo';
import { useSettings } from '@/state/settings';
import { pressedState } from '@/ui/a11y';
import { Card } from '@/ui/Card';
import { Icon } from '@/ui/icons/Icon';
import { color, font, radius, space } from '@/ui/tokens';

/** Search for a course, use the device location, and pick units. */
export function CoursePicker() {
  const { place, units, recent, setPlace, setUnits } = useSettings();
  const [text, setText] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    const t = setTimeout(async () => {
      if (text.trim().length < 2) return setResults([]);
      setSearching(true);
      try {
        const r = await searchPlaces(text);
        if (live) setResults(r);
      } catch {
        if (live) setProblem('Search sliced into the trees. Try again.');
      } finally {
        if (live) setSearching(false);
      }
    }, 300);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [text]);

  const choose = (p: Place) => {
    setPlace(p);
    router.back();
  };

  const locate = async () => {
    setLocating(true);
    setProblem(null);
    try {
      choose(await currentPlace());
    } catch (e) {
      setProblem(
        e instanceof LocationDenied
          ? 'Location is off for fore!. Allow it in your browser or settings, or search instead.'
          : 'Couldn’t find you. Out of bounds? Try searching.',
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Card title="Change course" kicker={`now playing ${place.name}`}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Search a city or town"
          placeholderTextColor={color.pencil}
          style={styles.input}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search for a place"
        />
        {searching ? (
          <ActivityIndicator style={{ marginTop: space.md }} color={color.fairway} />
        ) : null}
        {results.map((p) => (
          <Row key={`${p.latitude},${p.longitude}`} place={p} onPress={() => choose(p)} />
        ))}
        {text.trim().length >= 2 && !searching && !results.length ? (
          <Text style={styles.muted}>Lost ball. No places match “{text.trim()}”.</Text>
        ) : null}
        <Pressable
          onPress={locate}
          style={styles.locate}
          role="button"
          aria-label="Use my location"
          aria-busy={locating}
        >
          {locating ? (
            <ActivityIndicator color={color.paper} />
          ) : (
            <Text style={styles.locateText}>Use my location</Text>
          )}
        </Pressable>
        {problem ? <Text style={styles.problem}>{problem}</Text> : null}
      </Card>

      {recent.length ? (
        <Card title="Recent rounds">
          {recent.map((p) => (
            <Row key={`${p.latitude},${p.longitude}`} place={p} onPress={() => choose(p)} />
          ))}
        </Card>
      ) : null}

      <Card title="Clubhouse rules">
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, { flex: 1 }]}>Units</Text>
          <View style={styles.segment} role="group" aria-label="Units">
            {(['imperial', 'metric'] as Units[]).map((u) => (
              <Pressable
                key={u}
                onPress={() => setUnits(u)}
                style={[
                  styles.segBtn,
                  u === 'imperial' ? styles.segFirst : styles.segLast,
                  units === u && styles.segOn,
                ]}
                role="button"
                {...pressedState(units === u)}
                aria-label={
                  u === 'imperial'
                    ? 'Fahrenheit and miles per hour'
                    : 'Celsius and kilometres per hour'
                }
              >
                <Text style={[styles.segText, units === u && styles.segTextOn]}>
                  {u === 'imperial' ? '°F · mph' : '°C · km/h'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

function Row({ place, onPress }: { place: Place; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.row}
      role="button"
      aria-label={place.detail ? `${place.name}, ${place.detail}` : place.name}
    >
      <Icon name="flag" size={32} style={styles.rowFlag} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName}>{place.name}</Text>
        <Text style={styles.muted}>{place.detail}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.lg, width: '100%', maxWidth: 640, alignSelf: 'center' },
  input: {
    fontFamily: font.medium,
    fontSize: 18,
    borderWidth: 2,
    borderColor: color.fairway,
    borderRadius: radius.sm,
    padding: space.md,
    color: color.ink,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderColor: color.paperEdge,
    minHeight: 44,
  },
  rowFlag: { marginHorizontal: -6 },
  rowName: { fontFamily: font.bold, fontSize: 16, color: color.ink },
  muted: { fontFamily: font.body, fontSize: 13, color: color.inkSoft, marginTop: 2 },
  locate: {
    marginTop: space.lg,
    backgroundColor: color.fairway,
    borderRadius: radius.lg,
    paddingVertical: space.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  locateText: { fontFamily: font.bold, color: color.paper, fontSize: 16 },
  problem: { fontFamily: font.medium, color: color.flag, marginTop: space.sm },
  setting: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
  settingLabel: { fontFamily: font.bold, fontSize: 16, color: color.ink },
  segment: {
    flexDirection: 'row',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.fairway,
  },
  segBtn: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  // Rounded ends instead of overflow: hidden on the group, which would clip the focus ring.
  segFirst: { borderTopLeftRadius: radius.sm - 1, borderBottomLeftRadius: radius.sm - 1 },
  segLast: { borderTopRightRadius: radius.sm - 1, borderBottomRightRadius: radius.sm - 1 },
  segOn: { backgroundColor: color.fairway },
  segText: { fontFamily: font.medium, color: color.fairway },
  segTextOn: { color: color.paper },
});
