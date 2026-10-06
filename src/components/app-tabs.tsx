import { TabList, Tabs, TabSlot, TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { Boxes, Home, ShoppingBag, User, Utensils, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, type } from '@/constants/netbrew';
import { useCart } from '@/providers/cart-provider';

type NavItemProps = TabTriggerSlotProps & {
  label: string;
  icon: LucideIcon;
  badge?: number;
};

function NavItem({ label, icon: Icon, badge, isFocused, ...props }: NavItemProps) {
  const tint = isFocused ? colors.brand : colors.textMuted;

  return (
    <Pressable {...props} style={styles.item}>
      <View style={[styles.iconArea, isFocused ? styles.iconAreaActive : null]}>
        <Icon color={tint} size={20} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        style={[isFocused ? styles.labelActive : styles.label, { color: tint }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Headless tabs so the bar matches the Figma spec (pill highlight, amber cart
 * badge, 11px labels) instead of the platform tab bar.
 */
export default function AppTabs() {
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={styles.slot} />
      <TabList style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <TabTrigger name="home" href="/" asChild>
          <NavItem label="Home" icon={Home} />
        </TabTrigger>
        <TabTrigger name="menu" href="/menu" asChild>
          <NavItem label="Menu" icon={Utensils} />
        </TabTrigger>
        <TabTrigger name="cart" href="/cart" asChild>
          <NavItem label="Cart" icon={ShoppingBag} badge={itemCount} />
        </TabTrigger>
        <TabTrigger name="inventory" href="/inventory" asChild>
          <NavItem label="Stock" icon={Boxes} />
        </TabTrigger>
        <TabTrigger name="profile" href="/profile" asChild>
          <NavItem label="Profile" icon={User} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.background,
  },
  slot: {
    flex: 1,
    minHeight: 0,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  item: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconArea: {
    width: 40,
    height: 28,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAreaActive: {
    backgroundColor: colors.brandSoft,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -5,
    minWidth: 16,
    height: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    backgroundColor: colors.accent,
  },
  badgeLabel: {
    ...type.badge,
    color: colors.surface,
    textAlign: 'center',
  },
  label: {
    ...type.tabLabel,
  },
  labelActive: {
    ...type.tabLabelActive,
  },
});