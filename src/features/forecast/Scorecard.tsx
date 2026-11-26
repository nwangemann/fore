import { StyleSheet, Text, View } from 'react-native';
import type { Units } from '@/core/units';
import { iconFor } from '@/core/weather/codes';
import type { Day } from '@/core/weather/forecast';
import { weekdayLabel } from '@/core/weather/localTime';
import { scoreDay, scoreMark, type DayScore } from '@/core/weather/score';
import { Card } from '@/ui/Card';
import { deg } from '@/ui/format';
import { color, font, space } from '@/ui/tokens';

/**
 * The week as a golf scorecard. Each day is a hole; under par is circled and
 * over par is boxed, as on a real card.
 */
export function Scorecard({ days, units }: { days: Day[]; units: Units }) {
  const week = days.slice(0, 7);
  const scores = week.map((d) => scoreDay(d, units));
  const total = scores.reduce((n, s) => n + (s.strokes ?? 0), 0);
  return (
    <Card title="Scorecard" kicker="7-day fore-cast">
      <View style={styles.table}>
        <Row label="Hole">
          {week.map((d, i) => cell(i, i === 0 ? 'Today' : weekdayLabel(d.date), styles.head))}
        </Row>
        <Row label="Sky">{week.map((d, i) => cell(i, iconFor(d.code, true), styles.icon))}</Row>
        <Row label="High">{week.map((d, i) => cell(i, deg(d.high), styles.big))}</Row>
        <Row label="Low">{week.map((d, i) => cell(i, deg(d.low), styles.soft))}</Row>
        <Row label="Rain">
          {week.map((d, i) => cell(i, `${Math.round(d.precipChance)}%`, styles.soft))}
        </Row>
        <Row label="Score" last>
          {scores.map((s, i) => (
            <View key={i} style={styles.cell}>
              <Mark score={s} />
            </View>
          ))}
        </Row>
      </View>
      <Text style={styles.total}>
        Week total: <Text style={styles.totalNum}>{scoreMark({ strokes: total, label: '' })}</Text>
        {'  '}
        <Text style={styles.legend}>○ under par · □ over par · — weather delay</Text>
      </Text>
    </Card>
  );
}

function cell(key: number, text: string, style: object) {
  return (
    <View key={key} style={styles.cell}>
      <Text style={style}>{text}</Text>
    </View>
  );
}

function Row({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <View style={styles.labelCell}>
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

function Mark({ score }: { score: DayScore }) {
  const s = score.strokes;
  const shape = s === null ? null : s < 0 ? styles.circle : s > 0 ? styles.box : null;
  const tint = s === null ? color.pencil : s < 0 ? color.under : s > 0 ? color.over : color.ink;
  return (
    <View style={[styles.mark, shape, { borderColor: tint }]} accessibilityLabel={score.label}>
      <Text style={[styles.markText, { color: tint }]}>{scoreMark(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  table: { borderWidth: 1.5, borderColor: color.fairway, borderRadius: 6, overflow: 'hidden' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: color.paperEdge },
  labelCell: {
    width: 58,
    backgroundColor: color.fairway,
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  label: { fontFamily: font.bold, fontSize: 11, color: color.paper, textTransform: 'uppercase' },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    borderLeftWidth: 1,
    borderColor: color.paperEdge,
    minWidth: 36,
  },
  head: { fontFamily: font.bold, fontSize: 12, color: color.ink },
  icon: { fontSize: 22 },
  big: { fontFamily: font.bold, fontSize: 16, color: color.ink },
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
  legend: { fontFamily: font.body, fontSize: 12, color: color.pencil },
});
