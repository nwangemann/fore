import { StyleSheet, Text, View } from 'react-native';
import type { Units } from '@/core/units';
import type { Day } from '@/core/weather/forecast';
import { weekdayLabel, weekdayName } from '@/core/weather/localTime';
import { scorecardDayLabel } from '@/core/weather/speech';
import type { Normal } from '@/core/climate/normals';
import { bestDay, deltaFromC, scoreDay, scoreMark, type DayScore } from '@/core/weather/score';
import { Card } from '@/ui/Card';
import { deg } from '@/ui/format';
import { color, font, space } from '@/ui/tokens';
import { WeatherIcon } from '@/ui/weather/WeatherIcon';

/**
 * The week as a golf scorecard. Each day is a hole; under par is circled and
 * over par is boxed, as on a real card.
 */
type Props = { days: Day[]; units: Units; normals: Record<string, Normal | null> };

export function Scorecard({ days, units, normals }: Props) {
  const week = days.slice(0, 7);
  const par = week.map((d) => normals[d.date] ?? null);
  const scores = week.map((d, i) => scoreDay(d, units, par[i]));
  const best = bestDay(scores);
  const bestDate = best === null ? null : week[best];
  const toUnit = (c: number) => (units === 'imperial' ? deltaFromC(c, units) + 32 : c);
  const hasPar = par.some(Boolean);
  if (!week.length)
    return (
      <Card title="Scorecard" kicker="7-day fore-cast">
        <Text style={styles.empty}>No daily forecast for this course.</Text>
      </Card>
    );
  const rows: RowName[] = hasPar
    ? ['Hole', 'Sky', 'Par', 'High', 'Low', 'Rain', 'Score']
    : ['Hole', 'Sky', 'High', 'Low', 'Rain', 'Score'];
  const last = rows[rows.length - 1];
  return (
    <Card title="Scorecard" kicker="7-day fore-cast">
      {/* Drawn as columns, one per day, so each day reads as one sentence. */}
      <View style={styles.table}>
        <View style={styles.labels} aria-hidden>
          {rows.map((r) => (
            <Cell key={r} row={r} last={r === last} label>
              <Text style={styles.label}>{r}</Text>
            </Cell>
          ))}
        </View>
        {week.map((d, i) => {
          const s = scores[i]!;
          const n = par[i];
          return (
            <View
              key={d.date}
              style={styles.col}
              role="img"
              aria-label={scorecardDayLabel({
                name: i === 0 ? 'Today' : weekdayName(d.date),
                high: d.high,
                low: d.low,
                precipChance: d.precipChance,
                score: s,
              })}
            >
              <Cell row="Hole">
                <Text style={styles.head}>{i === 0 ? 'Today' : weekdayLabel(d.date)}</Text>
              </Cell>
              <Cell row="Sky">
                <WeatherIcon code={d.code} isDay size={34} decorative />
              </Cell>
              {hasPar ? (
                <Cell row="Par">
                  <Text style={styles.par}>{n ? deg(toUnit(n.high)) : '–'}</Text>
                </Cell>
              ) : null}
              <Cell row="High">
                <Text style={styles.big}>{deg(d.high)}</Text>
              </Cell>
              <Cell row="Low">
                <Text style={styles.soft}>{deg(d.low)}</Text>
              </Cell>
              <Cell row="Rain">
                <Text style={styles.soft}>{`${Math.round(d.precipChance)}%`}</Text>
              </Cell>
              <Cell row="Score" last>
                <Mark score={s} />
              </Cell>
            </View>
          );
        })}
      </View>
      {bestDate ? (
        <Text style={styles.total}>
          Best day to play:{' '}
          <Text style={styles.totalNum}>{best === 0 ? 'Today' : weekdayLabel(bestDate.date)}</Text>
        </Text>
      ) : null}
      <Text style={styles.legend}>
        {hasPar ? 'Par is a normal day here for the time of year (10-year average high). ' : ''}○
        under par · □ over par · — weather delay
      </Text>
    </Card>
  );
}

type RowName = 'Hole' | 'Sky' | 'Par' | 'High' | 'Low' | 'Rain' | 'Score';

/** Fixed row heights keep the day columns and the label column lined up. */
const ROW_HEIGHT: Record<RowName, number> = {
  Hole: 32,
  Sky: 50,
  Par: 34,
  High: 38,
  Low: 34,
  Rain: 34,
  Score: 50,
};

function Cell({
  row,
  last,
  label,
  children,
}: {
  row: RowName;
  last?: boolean;
  label?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        label ? styles.labelCell : styles.cell,
        { height: ROW_HEIGHT[row] },
        last && { borderBottomWidth: 0 },
      ]}
    >
      {children}
    </View>
  );
}

function Mark({ score }: { score: DayScore }) {
  const s = score.strokes;
  const shape = s === null ? null : s < 0 ? styles.circle : s > 0 ? styles.box : null;
  const tint = s === null ? color.pencil : s < 0 ? color.under : s > 0 ? color.over : color.ink;
  return (
    <View style={[styles.mark, shape, { borderColor: tint }]}>
      <Text style={[styles.markText, { color: tint }]}>{scoreMark(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontFamily: font.body, fontSize: 14, color: color.inkSoft },
  table: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: color.fairway,
    borderRadius: 6,
    overflow: 'hidden',
  },
  labels: { width: 58, backgroundColor: color.fairway },
  labelCell: {
    justifyContent: 'center',
    paddingHorizontal: space.sm,
    borderBottomWidth: 1,
    borderColor: color.paperEdge,
  },
  col: { flex: 1, minWidth: 36, borderLeftWidth: 1, borderColor: color.paperEdge },
  label: { fontFamily: font.bold, fontSize: 11, color: color.paper, textTransform: 'uppercase' },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: color.paperEdge,
  },
  head: { fontFamily: font.bold, fontSize: 12, color: color.ink },
  big: { fontFamily: font.bold, fontSize: 16, color: color.ink },
  par: { fontFamily: font.medium, fontSize: 13, color: color.fairway, fontStyle: 'italic' },
  soft: { fontFamily: font.body, fontSize: 13, color: color.inkSoft },
  mark: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  circle: { borderWidth: 2, borderRadius: 17 },
  box: { borderWidth: 2, borderRadius: 2 },
  markText: { fontFamily: font.bold, fontSize: 14 },
  total: { marginTop: space.md, fontFamily: font.medium, color: color.ink, fontSize: 14 },
  totalNum: { fontFamily: font.display, fontSize: 18, color: color.flag },
  legend: { fontFamily: font.body, fontSize: 12, color: color.pencil, marginTop: space.xs },
});
