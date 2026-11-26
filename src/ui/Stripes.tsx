import { StyleSheet, View } from 'react-native';
import { color } from './tokens';

/** Mowing stripes behind the whole page. */
export function Stripes() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.row]} pointerEvents="none">
      {Array.from({ length: 14 }, (_, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: i % 2 ? color.stripe : color.fairway }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row' } });
