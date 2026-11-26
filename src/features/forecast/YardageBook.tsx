import { StyleSheet, Text, View } from 'react-native';
import { compassPoint, unitLabels, visibilityToDistance, type Units } from '@/core/units';
import type { Forecast } from '@/core/weather/forecast';
import { clockLabel, minutesBetween } from '@/core/weather/localTime';
import { Card } from '@/ui/Card';
import { deg, pct, speed } from '@/ui/format';
import { color, font, radius, space } from '@/ui/tokens';

type Stat = { label: string; value: string; note?: string; icon: string };

/** The conditions a golfer reads before every shot. */
export function YardageBook({ forecast, units }: { forecast: Forecast; units: Units }) {
  const c = forecast.current;
  const today = forecast.days[0];
  const vis = visibilityToDistance(c.visibility, units);
  const stats: Stat[] = [
    {
      icon: '🚩',
      label: 'Wind',
      value: speed(c.windSpeed, units),
      note: `from the ${compassPoint(c.windDirection)}, gusts ${speed(c.windGusts, units)}`,
    },
    { icon: '💦', label: 'Humidity', value: pct(c.humidity), note: `dew point ${deg(c.dewPoint)}` },
    {
      icon: '😎',
      label: 'UV index',
      value: String(Math.round(c.uvIndex)),
      note: today ? `peak ${Math.round(today.uvMax)} today` : undefined,
    },
    { icon: '☁️', label: 'Cloud cover', value: pct(c.cloudCover) },
    {
      icon: '🔭',
      label: 'Visibility',
      value: `${vis >= 10 ? Math.round(vis) : vis.toFixed(1)} ${unitLabels[units].distance}`,
    },
    { icon: '🎈', label: 'Pressure', value: `${Math.round(c.pressure)} hPa` },
  ];
  if (today) {
    stats.push({
      icon: '🌧️',
      label: 'Rain today',
      value: `${today.precipSum.toFixed(units === 'imperial' ? 2 : 1)} ${unitLabels[units].precip}`,
    });
    const mins = minutesBetween(today.sunrise, today.sunset);
    stats.push({
      icon: '🌅',
      label: 'Tee times',
      value: `${clockLabel(today.sunrise)} – ${clockLabel(today.sunset)}`,
      note: `${Math.floor(mins / 60)} h ${mins % 60} min of daylight`,
    });
  }
  return (
    <Card title="Yardage book" kicker="conditions now">
      <View style={styles.grid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.label}>
              {s.icon} {s.label}
            </Text>
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
  label: {
    fontFamily: font.medium,
    fontSize: 12,
    color: color.inkSoft,
    textTransform: 'uppercase',
  },
  value: { fontFamily: font.bold, fontSize: 20, color: color.ink },
  note: { fontFamily: font.body, fontSize: 12, color: color.inkSoft },
});
