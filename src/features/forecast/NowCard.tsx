import { StyleSheet, Text, View } from 'react-native';
import type { Normal } from '@/core/climate/normals';
import { unitLabels, type Units } from '@/core/units';
import { condition } from '@/core/weather/codes';
import type { Forecast } from '@/core/weather/forecast';
import { clockLabel, minutesBetween } from '@/core/weather/localTime';
import {
  bestTeeTime,
  inTheBag,
  nowcastLine,
  rainOutlook,
  versusNormal,
  versusYesterday,
} from '@/core/weather/outlook';
import { caddieNotes, scoreDay } from '@/core/weather/score';
import { courseVariant } from '@/core/weather/variant';
import { deg } from '@/ui/format';
import { headingLevel } from '@/ui/a11y';
import { Icon } from '@/ui/icons/Icon';
import { previewVariant } from '@/ui/previewVariant';
import { color, font, heroColor, radius, space } from '@/ui/tokens';
import { WeatherIcon } from '@/ui/weather/WeatherIcon';

type Props = { forecast: Forecast; units: Units; normal: Normal | null };

export function NowCard({ forecast, units, normal }: Props) {
  const { current, hours } = forecast;
  const today = forecast.days[0];
  const sky = condition(current.code);
  const variant = previewVariant ?? courseVariant(current.code, current.isDay);
  const notes = caddieNotes(current, units);
  const score = today ? scoreDay(today, units, normal) : null;
  const nowcast = nowcastLine(forecast.nowcast, sky.mood === 'snow');
  const outlook = rainOutlook(hours, units);
  const bag = inTheBag(hours, today, units);
  const tee = bestTeeTime(hours, units, forecast.days);
  const context = [
    versusYesterday(current.temperature, forecast.sameHourYesterday, units),
    today ? versusNormal(today.high, normal, units) : null,
  ].filter(Boolean);
  const precip = unitLabels[units].precip;

  return (
    <View style={[styles.card, { backgroundColor: heroColor(variant, sky.mood) }]}>
      <View style={styles.top}>
        <WeatherIcon code={current.code} isDay={current.isDay} size={88} decorative />
        <View style={{ flex: 1 }}>
          <Text style={styles.temp}>
            {deg(current.temperature)}
            <Text style={styles.unit}>{unitLabels[units].temp.slice(1)}</Text>
          </Text>
          <Text style={styles.label} role="heading" {...headingLevel(2)}>
            {sky.label}
          </Text>
        </View>
        {score ? (
          <View style={styles.badge} role="img" aria-label={`Today scores ${score.label}`}>
            <Text style={styles.badgeKicker}>Today</Text>
            <Text style={styles.badgeText}>{score.label}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.quip}>“{sky.quip}”</Text>
      {context.length ? <Text style={styles.context}>{context.join(' · ')}</Text> : null}

      <View style={styles.outlook}>
        {nowcast ? <Text style={styles.nowcast}>{nowcast}</Text> : null}
        <Text style={styles.outlookText}>{outlook}</Text>
      </View>

      <View style={styles.facts}>
        <Fact label="Plays like" value={deg(current.feelsLike)} />
        {today ? <Fact label="High" value={deg(today.high)} /> : null}
        {today ? <Fact label="Low" value={deg(today.low)} /> : null}
        {today ? (
          <Fact
            label="Rain today"
            value={`${today.precipSum.toFixed(units === 'imperial' ? 2 : 1)} ${precip}`}
          />
        ) : null}
      </View>

      {bag.length || tee ? (
        <View style={styles.row}>
          {bag.length ? (
            <View style={styles.panel}>
              <Text style={styles.panelHead} role="heading" {...headingLevel(3)}>
                In the bag
              </Text>
              <View style={styles.chips}>
                {bag.map((b) => (
                  <Text key={b.label} style={styles.chip}>
                    {b.label}
                  </Text>
                ))}
              </View>
            </View>
          ) : null}
          {tee ? (
            <View style={styles.panel}>
              <Text style={styles.panelHead} role="heading" {...headingLevel(3)}>
                Best tee time {tee.when}
              </Text>
              <Text style={styles.tee}>{tee.label}</Text>
              {tee.soggy ? <Text style={styles.small}>Least wet, not dry.</Text> : null}
            </View>
          ) : null}
        </View>
      ) : null}

      {notes.length ? (
        <View style={styles.notes}>
          <Text style={styles.notesHead} role="heading" {...headingLevel(3)}>
            Caddie says
          </Text>
          {notes.map((n) => (
            <Text key={n} style={styles.note}>
              <Text aria-hidden>• </Text>
              {n}
            </Text>
          ))}
        </View>
      ) : null}

      {today?.sunrise ? <SunStrip sunrise={today.sunrise} sunset={today.sunset} /> : null}
    </View>
  );
}

function SunStrip({ sunrise, sunset }: { sunrise: string; sunset: string }) {
  const mins = minutesBetween(sunrise, sunset);
  return (
    <View style={styles.sun}>
      <View style={styles.sunItem}>
        <Icon name="sunrise" size={32} style={styles.sunIcon} />
        <Text style={styles.sunText}>First tee {clockLabel(sunrise)}</Text>
      </View>
      <View style={styles.sunItem}>
        <Icon name="sunset" size={32} style={styles.sunIcon} />
        <Text style={styles.sunText}>Last light {clockLabel(sunset)}</Text>
      </View>
      <Text style={styles.sunText}>
        {Math.floor(mins / 60)} h {mins % 60} m of daylight
      </Text>
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

// A darker tint, not a lighter one: sand and paper text stay at WCAG AA on every sky.
const glass = 'rgba(0,0,0,0.12)';
const shade = 'rgba(0,0,0,0.18)';

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.xl, gap: space.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.lg, paddingTop: 44 },
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
  context: { fontFamily: font.medium, fontSize: 14, color: color.sand },
  outlook: { backgroundColor: shade, borderRadius: radius.sm, padding: space.md, gap: space.xs },
  nowcast: { fontFamily: font.bold, fontSize: 15, color: color.sand },
  outlookText: { fontFamily: font.bold, fontSize: 16, color: color.paper },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  fact: {
    backgroundColor: glass,
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  panel: {
    flexGrow: 1,
    flexBasis: 180,
    backgroundColor: glass,
    borderRadius: radius.sm,
    padding: space.md,
    gap: space.xs,
  },
  panelHead: {
    fontFamily: font.bold,
    color: color.sand,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { fontFamily: font.medium, fontSize: 15, color: color.paper },
  tee: { fontFamily: font.display, fontSize: 22, color: color.paper },
  small: { fontFamily: font.body, fontSize: 12, color: color.sand },
  notes: { backgroundColor: shade, borderRadius: radius.sm, padding: space.md, gap: 2 },
  notesHead: {
    fontFamily: font.bold,
    color: color.sand,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  note: { fontFamily: font.body, color: color.paper, fontSize: 14 },
  sun: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space.lg,
    rowGap: space.xs,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingTop: space.md,
    alignItems: 'center',
  },
  sunItem: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sunIcon: { marginVertical: -8, marginLeft: -6 },
  sunText: { fontFamily: font.medium, fontSize: 13, color: color.paper },
});
