import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { condition, iconFor, type WeatherIconName } from '@/core/weather/codes';
import { meteocons } from './meteocons';

// Fails to compile if codes.ts names an icon that is not vendored.
const icons: Record<WeatherIconName, string> = meteocons;

type Props = { code: number; isDay: boolean; size: number };

/**
 * The Meteocons icon for a WMO code. The box is fixed at `size`, so the
 * layout does not move while the SVG draws.
 */
export function WeatherIcon({ code, isDay, size }: Props) {
  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={condition(code).label}
    >
      <SvgXml xml={icons[iconFor(code, isDay)]} width={size} height={size} />
    </View>
  );
}
