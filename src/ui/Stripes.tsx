import { StyleSheet, View } from 'react-native';
import type { CourseVariant } from '@/core/weather/variant';
import { stripeColor } from './tokens';

/** Mowing stripes behind the whole page, in the current course variant. */
export function Stripes({ variant = 'day' }: { variant?: CourseVariant }) {
  const { fairway, stripe } = stripeColor[variant];
  return (
    <View
      style={[StyleSheet.absoluteFill, styles.row, { backgroundColor: fairway }]}
      pointerEvents="none"
    >
      {Array.from({ length: 14 }, (_, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: i % 2 ? stripe : fairway }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row' } });
