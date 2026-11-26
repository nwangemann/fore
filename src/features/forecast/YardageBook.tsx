import { StyleSheet, Text, View } from 'react-native';
import { compassPoint, unitLabels, visibilityToDistance, type Units } from '@/core/units';
import type { Forecast } from '@/core/weather/forecast';
import { Card } from '@/ui/Card';
import { deg, pct, speed } from '@/ui/format';
import { Icon } from '@/ui/icons/Icon';
import type { UiIconName } from '@/ui/icons/uiIcons';
import { color, font, radius, space } from '@/ui/tokens';

const trendNote = {
  rising: '↗ rising: settling down',
  falling: '↘ falling: change on the way',
  steady: '→ steady',
} as const;

type Stat = { label: string; value: string; note?: string; icon: UiIconName };

/** The conditions a golfer reads before every shot. */
export function YardageBook({ forecast, units }: { forecast: Forecast; units: Units }) {
  const c = forecast.current;
  const today = forecast.days[0];
  const vis = visibilityToDistance(c.visibility, units);
  const stats: Stat[] = [
    {
      icon: 'windsock',
      label: 'Wind',
      value: speed(c.windSpeed, units),
      note: `from the ${compassPoint(c.windDirection)}, gusts ${speed(c.windGusts, units)}`,
    },
    {
      icon: 'humidity',
      label: 'Humidity',
      value: pct(c.humidity),
      note: `dew point ${deg(c.dewPoint)}`,
    },
    {
      icon: 'uv-index',
      label: 'UV index',
      value: String(Math.round(c.uvIndex)),
      note: today ? `peak ${Math.round(today.uvMax)} today` : undefined,
    },
    { icon: 'cloudy', label: 'Cloud cover', value: pct(c.cloudCover) },
    {
      icon: 'horizon',
      label: 'Visibility',
      value: `${vis >= 10 ? Math.round(vis) : vis.toFixed(1)} ${unitLabels[units].distance}`,
    },
    {
      icon: 'barometer',
      label: 'Pressure',
      value:
        units === 'imperial'
          ? `${(c.pressure * 0.02953).toFixed(2)} inHg`
          : `${Math.round(c.pressure)} hPa`,
      note: forecast.pressureTrend ? trendNote[forecast.pressureTrend] : undefined,
    },
  ];
  return (
    <Card title="Yardage book" kicker="conditions now">
      <View style={styles.grid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <View style={styles.labelRow}>
              <Icon name={s.icon} size={28} style={styles.icon} />
              <Text style={styles.label}>{s.label}</Text>
            </View>
            <Text style={styles.value}>{s.value}</Text>
            {s.note ? <Text style={styles.note}>{s.note}</Text> : null}
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  stat: {
    flexGrow: 1,
    flexBasis: 150,
    borderRadius: radius.sm,
    backgroundColor: '#F2EBD7',
    padding: space.md,
    gap: 2,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  icon: { marginVertical: -6, marginLeft: -6 },
  label: {
    fontFamily: font.medium,
    fontSize: 12,
    color: color.inkSoft,
    textTransform: 'uppercase',
  },
  value: { fontFamily: font.bold, fontSize: 20, color: color.ink },
  note: { fontFamily: font.body, fontSize: 12, color: color.inkSoft },
});
