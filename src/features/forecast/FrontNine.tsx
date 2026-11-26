import { Fragment } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { iconFor } from '@/core/weather/codes';
import type { Hour } from '@/core/weather/forecast';
import { hourLabel } from '@/core/weather/localTime';
import { Card } from '@/ui/Card';
import { deg } from '@/ui/format';
import { color, font, radius, space } from '@/ui/tokens';

/** The next 18 hours, split at "the turn" like a round of golf. */
export function FrontNine({ hours }: { hours: Hour[] }) {
  const round = hours.slice(0, 18);
  return (
    <Card title="The front nine" kicker="next 18 hours">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {round.map((h, i) => (
          <Fragment key={h.time}>
            {i === 9 ? (
              <View style={styles.turn}>
                <Text style={styles.turnText}>THE TURN</Text>
              </View>
            ) : null}
            <View style={[styles.hole, i === 0 && styles.now]}>
              <Text style={styles.num}>{i + 1}</Text>
              <Text style={styles.time}>{i === 0 ? 'Now' : hourLabel(h.time)}</Text>
              <Text style={styles.icon}>{iconFor(h.code, h.isDay)}</Text>
              <Text style={styles.temp}>{deg(h.temperature)}</Text>
              <Text style={[styles.rain, h.precipChance >= 40 && styles.wet]}>
                {h.precipChance > 0 ? `💧${Math.round(h.precipChance)}%` : ' '}
              </Text>
            </View>
          </Fragment>
        ))}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { gap: space.xs, paddingBottom: space.xs },
  hole: {
    width: 66,
    alignItems: 'center',
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.paperEdge,
    gap: 2,
  },
  now: { backgroundColor: color.sand, borderColor: color.sand },
  num: { fontFamily: font.bold, fontSize: 10, color: color.pencil },
  time: { fontFamily: font.medium, fontSize: 12, color: color.inkSoft },
  icon: { fontSize: 24 },
  temp: { fontFamily: font.bold, fontSize: 18, color: color.ink },
  rain: { fontFamily: font.body, fontSize: 11, color: color.inkSoft },
  wet: { color: color.over, fontFamily: font.bold },
  turn: {
    width: 26,
    backgroundColor: color.fairway,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnText: {
    fontFamily: font.bold,
    fontSize: 10,
    color: color.paper,
    transform: [{ rotate: '-90deg' }],
    width: 80,
    textAlign: 'center',
  },
});
