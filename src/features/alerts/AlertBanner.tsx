import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Alert } from '@/core/alerts/alerts';
import { color, font, radius, space } from '@/ui/tokens';

/** "Fore!" is the warning shout, so official alerts get the loudest card. */
export function AlertBanner({ alerts, failed }: { alerts: Alert[]; failed: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  if (failed)
    return (
      <Text style={styles.failed}>Couldn’t reach the National Weather Service for alerts.</Text>
    );
  if (!alerts.length) return null;
  return (
    <View style={styles.wrap}>
      {alerts.map((a) => (
        <Pressable
          key={a.id || a.headline}
          onPress={() => setOpen(open === a.id ? null : a.id)}
          style={styles.card}
          role="button"
          aria-expanded={open === a.id}
        >
          <Text style={styles.shout}>FORE! {a.event}</Text>
          <Text style={styles.headline}>{a.headline}</Text>
          {open === a.id ? (
            <>
              <Text style={styles.body}>{a.description}</Text>
              {a.instruction ? (
                <Text style={[styles.body, styles.bold]}>{a.instruction}</Text>
              ) : null}
            </>
          ) : (
            <Text style={styles.more}>Show the details</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm, marginBottom: space.lg },
  card: { backgroundColor: color.flag, borderRadius: radius.md, padding: space.lg, gap: space.xs },
  shout: { fontFamily: font.display, fontSize: 22, color: color.paper },
  headline: { fontFamily: font.medium, color: color.paper, fontSize: 14 },
  body: { fontFamily: font.body, color: color.paper, fontSize: 14, marginTop: space.sm },
  bold: { fontFamily: font.bold },
  failed: {
    fontFamily: font.medium,
    color: color.sand,
    fontSize: 13,
    marginBottom: space.lg,
  },
  more: { fontFamily: font.body, color: color.paper, fontSize: 12 },
});
