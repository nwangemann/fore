import { StyleSheet, Text, View } from 'react-native';
import { aqiBand, pollenBand, type Air } from '@/core/air/air';
import { Card } from '@/ui/Card';
import { bandColor, color, font, radius, space } from '@/ui/tokens';

export function AirCard({ air }: { air: Air | null }) {
  if (!air || air.usAqi === null) {
    return (
      <Card title="Clubhouse air" kicker="air quality">
        <Text style={styles.muted}>No air reading for this course right now.</Text>
      </Card>
    );
  }
  const band = aqiBand(air.usAqi);
  return (
    <Card title="Clubhouse air" kicker="US AQI">
      <View style={styles.top}>
        <View style={[styles.dial, { backgroundColor: bandColor[band.level] }]}>
          <Text style={styles.aqi}>{Math.round(air.usAqi)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.band}>{band.label}</Text>
          <Text style={styles.quip}>{band.quip}</Text>
        </View>
      </View>
      <View style={styles.pills}>
        <Pill label="PM2.5" value={air.pm25} />
        <Pill label="PM10" value={air.pm10} />
        <Pill label="Ozone" value={air.ozone} />
      </View>
      <Text style={styles.sub}>The rough report · pollen</Text>
      {air.pollen.length ? (
        <View style={{ gap: space.xs }}>
          {air.pollen.map((p) => {
            const b = pollenBand(p.value);
            return (
              <View key={p.key} style={styles.pollen}>
                <View style={[styles.dot, { backgroundColor: bandColor[b.level] }]} />
                <Text style={styles.pollenName}>{p.name}</Text>
                <Text style={styles.pollenBand}>{b.label}</Text>
                <Text style={styles.pollenVal}>{Math.round(p.value)} /m³</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.muted}>
          Pollen isn’t tracked for this course. The free model only covers Europe.
        </Text>
      )}
    </Card>
  );
}

function Pill({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null;
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>
        {value.toFixed(value < 10 ? 1 : 0)} <Text style={styles.pillUnit}>µg/m³</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  dial: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: color.paper,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  aqi: { fontFamily: font.display, fontSize: 28, color: color.paper },
  band: { fontFamily: font.bold, fontSize: 18, color: color.ink },
  quip: { fontFamily: font.body, fontSize: 14, color: color.inkSoft, fontStyle: 'italic' },
  pills: { flexDirection: 'row', gap: space.sm, marginTop: space.md, flexWrap: 'wrap' },
  pill: { backgroundColor: '#F2EBD7', borderRadius: radius.sm, padding: space.sm, flexGrow: 1 },
  pillLabel: { fontFamily: font.medium, fontSize: 11, color: color.inkSoft },
  pillValue: { fontFamily: font.bold, fontSize: 16, color: color.ink },
  pillUnit: { fontFamily: font.body, fontSize: 11, color: color.inkSoft },
  sub: {
    marginTop: space.lg,
    marginBottom: space.sm,
    fontFamily: font.bold,
    fontSize: 12,
    color: color.fairway,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pollen: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  dot: { width: 12, height: 12, borderRadius: 6 },
  pollenName: { fontFamily: font.bold, fontSize: 14, color: color.ink, width: 80 },
  pollenBand: { fontFamily: font.body, fontSize: 14, color: color.inkSoft, flex: 1 },
  pollenVal: { fontFamily: font.body, fontSize: 12, color: color.pencil },
  muted: { fontFamily: font.body, fontSize: 14, color: color.inkSoft },
});
