import { Coffee, CreditCard, MapPin, User } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppBar, BrandMark } from '@/components/netbrew/app-bar';
import { Card } from '@/components/netbrew/card';
import { ScreenScroll } from '@/components/netbrew/screen';
import { PICKUP_LOCATION, colors, formatPeso, type } from '@/constants/netbrew';
import { useCart } from '@/providers/cart-provider';

export default function ProfileScreen() {
  const { itemCount, total } = useCart();

  return (
    <ScreenScroll
      contentStyle={styles.content}
      header={
        <AppBar
          subtitle="Your NetBrew account"
          title="Profile"
          trailing={<BrandMark />}
        />
      }>
      <Card style={styles.identity}>
        <View style={styles.avatar}>
          <User color={colors.surface} size={24} />
        </View>
        <View style={styles.identityCopy}>
          <Text style={styles.name}>Armando Bona</Text>
          <Text style={styles.handle}>@armando · IT Mobile Dev</Text>
        </View>
      </Card>

      <View style={styles.stats}>
        <Stat label="Orders" value="12" />
        <Stat label="In cart" value={String(itemCount)} />
        <Stat label="Cart total" value={formatPeso(total)} />
      </View>

      <View style={styles.list}>
        <Row icon={<MapPin color={colors.brand} size={19} />} label="Pickup location" value={PICKUP_LOCATION} />
        <Row icon={<CreditCard color={colors.brand} size={19} />} label="Payment method" value="Cash · GCash" />
        <Row icon={<Coffee color={colors.brand} size={19} />} label="Usual order" value="Iced Latte" />
      </View>
    </ScreenScroll>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function Row({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text numberOfLines={1} style={styles.rowValue}>
          {value}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  identityCopy: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...type.cardTitleSm,
    color: colors.text,
  },
  handle: {
    ...type.caption,
    color: colors.textMuted,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  statValue: {
    ...type.priceLg,
    color: colors.brand,
  },
  statLabel: {
    ...type.caption,
    color: colors.textMuted,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...type.label,
    color: colors.textMuted,
  },
  rowValue: {
    ...type.optionTitle,
    color: colors.text,
  },
});