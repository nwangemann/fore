import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { uiIcons, type UiIconName } from './uiIcons';

type Props = { name: UiIconName; size: number; style?: StyleProp<ViewStyle> };

/**
 * A decorative UI icon in a fixed square box, so the layout does not move
 * while the SVG draws. Hidden from screen readers: the text beside it says
 * the same thing.
 */
export function Icon({ name, size, style }: Props) {
  return (
    <View style={[{ width: size, height: size }, style]} aria-hidden>
      <SvgXml xml={uiIcons[name]} width={size} height={size} />
    </View>
  );
}
