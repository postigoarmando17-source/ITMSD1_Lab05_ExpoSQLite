import { router } from 'expo-router';
import { Check, Home, MapPin, ShoppingBag } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/netbrew/button';
import { Card, Divider } from '@/components/netbrew/card';
import { Screen } from '@/components/netbrew/screen';
import { ORDER_NUMBER, PICKUP_ESTIMATE, PICKUP_LOCATION, brandShadow, colors, formatPeso, type } from '@/constants/netbrew';
import { useCart } from '@/providers/cart-provider';

const STEPS = [
  { id: 'confirmed', label: 'Confirmed', state: 'done' },
  { id: 'preparing', label: 'Preparing', state: 'current' },
  { id: 'ready', label: 'Ready', state: 'pending' },
] as const;

export default function ConfirmationScreen() {
  const { itemCount, total, lastOrder } = useCart();

  // `lastOrder` is the snapshot taken when the order was placed. Falling back to
  // the live cart keeps this screen correct if it is opened directly.
  const order = lastOrder ?? { itemCount, total };

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        style={styles.scroll}
        showsVerticalScrollIndicator>
        <View style={styles.success}>
          <View style={styles.successRing}>
            <View style={styles.successDisc}>
              <Check color={colors.surface} size={34} strokeWidth={2.5} />
            </View>
          </View>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successCopy}>Thank you for ordering from NetBrew Café.</Text>
          <Badge label={`Order Number: ${ORDER_NUMBER}`} />
          <Badge label={`Total: ${formatPeso(order.total)}`} />
        </View>

        <Card style={styles.statusCard}>
          <View style={styles.statusHead}>
            <View style={styles.statusLabels}>
              <Text style={styles.eyebrow}>CURRENT STATUS</Text>
              <Text style={styles.statusValue}>Being prepared</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveLabel}>LIVE</Text>
            </View>
          </View>

          <Progress />

          <Divider />

          <View style={styles.estimate}>
            <View style={styles.statusLabels}>
              <Text style={styles.eyebrow}>ESTIMATED PICKUP</Text>
              <Text style={styles.estimateValue}>{PICKUP_ESTIMATE}</Text>
            </View>
            <View style={styles.bagIcon}>
              <ShoppingBag color={colors.accent} size={22} />
            </View>
          </View>

          <View style={styles.pickupLine}>
            <MapPin color={colors.textMuted} size={15} />
            <Text style={styles.pickupText}>{PICKUP_LOCATION}</Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            icon={<Home color={colors.surface} size={18} />}
            label="BACK TO HOME"
            onPress={() => router.replace('/')}
          />
          <Button
            label="View order details"
            onPress={() => router.replace('/cart')}
            variant="secondary"
          />
        </View>

        <Text style={styles.footnote}>
          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} · We’ll text you when it’s ready.
        </Text>
      </ScrollView>
    </Screen>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

function Progress() {
  return (
    <View style={styles.progress}>
      <View style={[styles.connector, styles.connectorDone]} />
      <View style={styles.connectorIdle} />
      {STEPS.map((step) => (
        <View key={step.id} style={styles.step}>
          <View
            style={[
              styles.marker,
              step.state === 'pending' ? styles.markerIdle : styles.markerActive,
            ]}>
            {step.state === 'done' ? (
              <Check color={colors.surface} size={12} strokeWidth={3} />
            ) : step.state === 'current' ? (
              <View style={styles.markerCentre} />
            ) : null}
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.stepLabel,
              step.state === 'current' && styles.stepLabelCurrent,
              step.state === 'pending' && styles.stepLabelIdle,
            ]}>
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 36,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  success: {
    alignItems: 'center',
    gap: 10,
  },
  successRing: {
    width: 96,
    height: 96,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
  },
  successDisc: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    ...brandShadow,
  },
  successTitle: {
    ...type.success,
    textAlign: 'center',
    color: colors.text,
  },
  successCopy: {
    ...type.body,
    textAlign: 'center',
    color: colors.textMuted,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
  },
  badgeLabel: {
    ...type.labelBold,
    color: colors.accent,
  },
  statusCard: {
    gap: 12,
  },
  statusHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusLabels: {
    gap: 2,
  },
  eyebrow: {
    ...type.label,
    color: colors.textMuted,
  },
  statusValue: {
    ...type.screenTitle,
    color: colors.brand,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: colors.brandSoft,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.brand,
  },
  liveLabel: {
    ...type.live,
    color: colors.brand,
  },
  progress: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  connector: {
    position: 'absolute',
    top: 11,
    left: '16.667%',
    width: '33.333%',
    height: 2,
  },
  connectorDone: {
    backgroundColor: colors.brand,
  },
  connectorIdle: {
    position: 'absolute',
    top: 11,
    left: '50%',
    width: '33.333%',
    height: 2,
    backgroundColor: colors.border,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brand,
  },
  markerIdle: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  markerCentre: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  stepLabel: {
    ...type.caption,
    fontSize: 10,
    textAlign: 'center',
    color: colors.brand,
  },
  stepLabelCurrent: {
    fontWeight: '600',
    color: colors.brand,
  },
  stepLabelIdle: {
    color: colors.textMuted,
  },
  estimate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  estimateValue: {
    ...type.priceXl,
    color: colors.text,
  },
  bagIcon: {
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  pickupLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pickupText: {
    ...type.subtitle,
    color: colors.textMuted,
  },
  actions: {
    gap: 8,
  },
  footnote: {
    ...type.caption,
    textAlign: 'center',
    color: colors.textMuted,
  },
});