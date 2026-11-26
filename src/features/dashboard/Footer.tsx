import { Linking, StyleSheet, Text, View } from 'react-native';
import { color, font, space } from '@/ui/tokens';

const sources = [
  { label: 'Open-Meteo (CC BY 4.0)', url: 'https://open-meteo.com/' },
  { label: 'US National Weather Service', url: 'https://www.weather.gov/' },
  { label: '© OpenStreetMap contributors', url: 'https://www.openstreetmap.org/copyright' },
];

export function Footer() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>Weather data by </Text>
      {sources.map((s, i) => (
        <Text key={s.url} style={styles.text}>
          <Text style={styles.link} onPress={() => void Linking.openURL(s.url)}>
            {s.label}
          </Text>
          {i < sources.length - 1 ? ' · ' : ''}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: space.xl },
  text: { fontFamily: font.body, fontSize: 12, color: color.sand },
  link: { textDecorationLine: 'underline' },
});
