import { StyleSheet, Text, View } from 'react-native';
import { unitLabels, type Units } from '@/core/units';
import { condition, iconFor } from '@/core/weather/codes';
import type { Forecast } from '@/core/weather/forecast';
import { caddieNotes, scoreDay } from '@/core/weather/score';
import { deg } from '@/ui/format';
import { color, font, moodColor, radius, space } from '@/ui/tokens';

export function NowCard({ forecast, units }: { forecast: Forecast; units: Units }) {
  const { current } = forecast;
  const today = forecast.days[0];
  const sky = condition(current.code);
  const notes = caddieNotes(current, today, units);
  const score = today ? scoreDay(today, units) : null;
  return (
    <View style={[styles.card, { backgroundColor: moodColor[sky.mood] }]}>
      <View style={styles.top}>
        <Text style={styles.icon}>{iconFor(current.code, current.isDay)}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.temp}>
            {deg(current.temperature)}
            <Text style={styles.unit}>{unitLabels[units].temp.slice(1)}</Text>
          </Text>
          <Text style={styles.label}>{sky.label}</Text>
        </View>
        {score ? (
          <View style={styles.badge} accessibilityLabel={`Today scores ${score.label}`}>
            <Text style={styles.badgeKicker}>Today</Text>
            <Text style={styles.badgeText}>{score.label}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.quip}>“{sky.quip}”</Text>
      <View style={styles.facts}>
        <Fact label="Plays like" value={deg(current.feelsLike)} />
        {today ? <Fact label="High" value={deg(today.high)} /> : null}
        {today ? <Fact label="Low" value={deg(today.low)} /> : null}
        {today ? <Fact label="Rain" value={`${Math.round(today.precipChance)}%`} /> : null}
      </View>
      {notes.length ? (
        <View style={styles.notes}>
          <Text style={styles.notesHead}>Caddie says</Text>
          {notes.map((n) => (
            <Text key={n} style={styles.note}>
              • {n}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.xl, gap: space.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.lg, paddingTop: 44 },
  icon: { fontSize: 64 },
  temp: { fontFamily: font.display, fontSize: 84, lineHeight: 100, color: color.paper },
  unit: { fontFamily: font.bold, fontSize: 28 },
  label: { fontFamily: font.bold, fontSize: 20, color: color.paper },
  badge: {
    position: 'absolute',
    top: -space.sm,
    right: -space.sm,
    backgroundColor: color.paper,
    borderRadius: radius.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    alignItems: 'center',
    transform: [{ rotate: '4deg' }],
  },
  badgeKicker: {
    fontFamily: font.medium,
    fontSize: 11,
    color: color.pencil,
    textTransform: 'uppercase',
  },
  badgeText: { fontFamily: font.display, fontSize: 18, color: color.flag },
  quip: { fontFamily: font.medium, fontSize: 18, color: color.paper, fontStyle: 'italic' },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  fact: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    minWidth: 84,
  },
  factLabel: {
    fontFamily: font.medium,
    fontSize: 11,
    color: color.sand,
    textTransform: 'uppercase',
  },
  factValue: { fontFamily: font.bold, fontSize: 20, color: color.paper },
  notes: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: radius.sm,
    padding: space.md,
    gap: 2,
  },
  notesHead: { fontFamily: font.bold, color: color.sand, fontSize: 12, textTransform: 'uppercase' },
  note: { fontFamily: font.body, color: color.paper, fontSize: 14 },
});
