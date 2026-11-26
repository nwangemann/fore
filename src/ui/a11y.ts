import { Platform } from 'react-native';
import { focusRing } from './tokens';

/**
 * Heading level for web (`h1`, `h2`…). React Native's types have no `aria-level`, but
 * react-native-web reads it; native ignores levels, so nothing is passed there.
 */
export function headingLevel(level: 1 | 2 | 3): object {
  return Platform.OS === 'web' ? { 'aria-level': level } : {};
}

/**
 * Web only: a two-tone ring on whatever has keyboard focus. `:focus-visible` keeps it
 * off mouse clicks. Paper inside and ink outside, so it shows on green, paper and sand.
 */
export function installFocusRing(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById('fore-focus-ring')) return;
  const style = document.createElement('style');
  style.id = 'fore-focus-ring';
  style.textContent = `:focus-visible {
  outline: ${focusRing.width}px solid ${focusRing.outer} !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px ${focusRing.inner};
}`;
  document.head.appendChild(style);
}

/**
 * On/off state for a toggle button. Web gets `aria-pressed` (not in React Native's
 * types, but react-native-web passes it through); native gets the selected state.
 */
export function pressedState(pressed: boolean): object {
  return Platform.OS === 'web' ? { 'aria-pressed': pressed } : { 'aria-selected': pressed };
}
