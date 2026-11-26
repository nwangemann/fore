import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { headingLevel } from './a11y';
import { color, font, radius, space } from './tokens';

type Props = { title?: string; kicker?: string; children: ReactNode; style?: ViewStyle };

/** A scorecard-paper panel with an optional golf-flavoured heading. */
export function Card({ title, kicker, children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <View style={styles.head}>
          <Text style={styles.title} role="heading" {...headingLevel(2)}>
            {title}
          </Text>
          {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.paper,
    borderRadius: radius.md,
    padding: space.lg,
    borderWidth: 1,
    borderColor: color.paperEdge,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.sm,
    marginBottom: space.md,
    flexWrap: 'wrap',
  },
  title: { fontFamily: font.display, fontSize: 22, color: color.fairway },
  kicker: {
    fontFamily: font.medium,
    fontSize: 12,
    color: color.pencil,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
