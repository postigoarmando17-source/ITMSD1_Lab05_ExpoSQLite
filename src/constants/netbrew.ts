import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/** Palette lifted from the NetBrew Café Figma file. */
export const colors = {
  background: '#F7F3EF',
  surface: '#FFFFFF',
  text: '#1F1F1F',
  textMuted: '#6B625E',
  brand: '#02677D',
  accent: '#CC8A00',
  brandSoft: '#E6F0F2',
  accentSoft: '#FFF4D6',
  border: '#D8D0CA',
} as const;

const fontFamily = Platform.select({
  ios: 'System',
  default: 'sans-serif',
});

/**
 * Type ramp. Figma uses Roboto (the Android system face); `sans-serif`
 * resolves to Roboto on Android and the platform face elsewhere.
 */
export const type = {
  hero: { fontFamily, fontSize: 28, lineHeight: 32, fontWeight: '700' },
  success: { fontFamily, fontSize: 26, lineHeight: 31, fontWeight: '700' },
  pageTitle: { fontFamily, fontSize: 18, lineHeight: 22, fontWeight: '600' },
  sectionTitle: { fontFamily, fontSize: 18, fontWeight: '600' },
  screenTitle: { fontFamily, fontSize: 16, lineHeight: 20, fontWeight: '600' },
  cardTitle: { fontFamily, fontSize: 16, lineHeight: 20, fontWeight: '600' },
  cardTitleSm: { fontFamily, fontSize: 15, lineHeight: 19, fontWeight: '600' },
  itemTitle: { fontFamily, fontSize: 15, fontWeight: '600' },
  optionTitle: { fontFamily, fontSize: 14, fontWeight: '600' },
  nameSm: { fontFamily, fontSize: 14, lineHeight: 18, fontWeight: '600' },
  caption: { fontFamily, fontSize: 10, lineHeight: 15 },
  price: { fontFamily, fontSize: 14, fontWeight: '700' },
  priceLg: { fontFamily, fontSize: 16, fontWeight: '700' },
  priceXl: { fontFamily, fontSize: 22, fontWeight: '700' },
  body: { fontFamily, fontSize: 14, lineHeight: 20 },
  bodyMd: { fontFamily, fontSize: 14, fontWeight: '500' },
  optionLabel: { fontFamily, fontSize: 14 },
  bodySm: { fontFamily, fontSize: 13, lineHeight: 18 },
  subtitle: { fontFamily, fontSize: 11, lineHeight: 14 },
  muted: { fontFamily, fontSize: 11, lineHeight: 15 },
  label: { fontFamily, fontSize: 11, fontWeight: '500' },
  chip: { fontFamily, fontSize: 12, fontWeight: '500' },
  labelSm: { fontFamily, fontSize: 12 },
  labelBold: { fontFamily, fontSize: 12, fontWeight: '700' },
  micro: { fontFamily, fontSize: 11, fontWeight: '700' },
  qty: { fontFamily, fontSize: 14, fontWeight: '600' },
  eyebrow: {
    fontFamily,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  live: { fontFamily, fontSize: 10, fontWeight: '700' },
  tabLabel: { fontFamily, fontSize: 11, lineHeight: 14 },
  tabLabelActive: { fontFamily, fontSize: 11, lineHeight: 14, fontWeight: '600' },
  badge: { fontFamily, fontSize: 9, fontWeight: '700' },
} satisfies Record<string, TextStyle>;

/**
 * Shadows use `boxShadow` rather than the legacy `shadow*` props, which React
 * Native Web has deprecated. `elevation` is still the Android-only path.
 */

/** `0 3px 10px rgba(31, 31, 31, 0.08)` — raised surface cards. */
export const cardShadow: ViewStyle = Platform.select({
  android: { elevation: 3 },
  default: { boxShadow: '0 3px 10px rgba(31, 31, 31, 0.08)' },
}) as ViewStyle;

/** `0 5px 14px rgba(2, 103, 125, 0.16)` — primary brand actions. */
export const brandShadow: ViewStyle = Platform.select({
  android: { elevation: 5 },
  default: { boxShadow: '0 5px 14px rgba(2, 103, 125, 0.16)' },
}) as ViewStyle;

export const PICKUP_LOCATION = 'Student Union · Main counter';
export const PICKUP_ESTIMATE = '10–15 min';

export const ORDER_NUMBER = '#NB1024';

/** 44px is the smallest comfortable touch target; the mock uses 48. */
export const TOUCH = 48;

export function formatPeso(amount: number): string {
  const digits = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₱${digits}`;
}