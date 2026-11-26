import { Pressable, StyleSheet, Text } from 'react-native';
import { Card } from './Card';
import { color, font, radius, space } from './tokens';

type Props = { message: string; onRetry: () => void; retryLabel?: string };

/** The friendly failure card: what went wrong and a button to play it again. */
export function OutOfBounds({ message, onRetry, retryLabel = 'Re-tee' }: Props) {
  return (
    <Card title="Out of bounds" kicker="take a drop">
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={onRetry} style={styles.button} accessibilityRole="button">
        <Text style={styles.label}>{retryLabel}</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  message: { fontFamily: font.body, color: color.ink, fontSize: 15, lineHeight: 22 },
  button: {
    alignSelf: 'flex-start',
    marginTop: space.md,
    backgroundColor: color.sand,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  label: { fontFamily: font.bold, color: color.ink, fontSize: 15 },
});
