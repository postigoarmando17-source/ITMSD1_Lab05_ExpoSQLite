import { router } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  Lock,
  ShieldCheck,
  Store,
  Utensils,
  WalletCards,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/netbrew/app-bar';
import { Button } from '@/components/netbrew/button';
import { Card, Divider } from '@/components/netbrew/card';
import { OptionRow } from '@/components/netbrew/option-row';
import { Screen } from '@/components/netbrew/screen';
import { TouchIcon } from '@/components/netbrew/touch-icon';
import { PICKUP_ESTIMATE, PICKUP_LOCATION, colors, formatPeso, type } from '@/constants/netbrew';
import { useCart } from '@/providers/cart-provider';

type OrderType = 'pickup' | 'dine-in';
type PaymentMethod = 'cash' | 'gcash';

export default function CheckoutScreen() {
  const { lines, total, placeOrder } = useCart();
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [payment, setPayment] = useState<PaymentMethod>('cash');

  function submit() {
    placeOrder();
    router.push('/confirmation');
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <AppBar
        leading={
          <TouchIcon
            accessibilityLabel="Go back"
            icon={<ArrowLeft color={colors.text} size={22} />}
            onPress={() => router.back()}
          />
        }
        subtitle="Review & pay"
        title="Checkout"
        trailing={
          <TouchIcon accessibilityLabel="Secure checkout" icon={<Lock color={colors.text} size={22} />} />
        }
      />

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.form}
          style={styles.formScroll}
          showsVerticalScrollIndicator>
          <Card style={styles.pickupCard}>
            <View style={styles.pickupHead}>
              <View style={styles.row}>
                <Store color={colors.brand} size={19} />
                <Text style={styles.pickupTitle}>Pickup details</Text>
              </View>
              <EditLink />
            </View>
            <View style={styles.pickupRow}>
              <View style={styles.clockIcon}>
                <Clock3 color={colors.accent} size={18} />
              </View>
              <View style={styles.pickupCopy}>
                <Text style={styles.pickupEta}>ASAP · {PICKUP_ESTIMATE}</Text>
                <Text numberOfLines={1} style={styles.pickupAddress}>
                  {PICKUP_LOCATION}
                </Text>
              </View>
            </View>
          </Card>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order type</Text>
            <OptionRow
              description="Collect at the counter"
              icon={<Store color={colors.brand} size={19} />}
              onPress={() => setOrderType('pickup')}
              selected={orderType === 'pickup'}
              title="Pickup"
            />
            <OptionRow
              description="Enjoy at a table"
              icon={<Utensils color={colors.brand} size={19} />}
              onPress={() => setOrderType('dine-in')}
              selected={orderType === 'dine-in'}
              title="Dine-in"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <OptionRow
              description="Pay at the counter"
              icon={<CreditCard color={colors.brand} size={19} />}
              onPress={() => setPayment('cash')}
              selected={payment === 'cash'}
              title="Cash"
            />
            <OptionRow
              description="Pay with your GCash account"
              icon={<WalletCards color={colors.brand} size={19} />}
              onPress={() => setPayment('gcash')}
              selected={payment === 'gcash'}
              title="GCash"
            />
          </View>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHead}>
              <Text style={styles.summaryTitle}>Order summary</Text>
              <EditLink onPress={() => router.push('/cart')} />
            </View>
            {lines.map((line) => (
              <View key={line.product.id} style={styles.summaryRow}>
                <Text numberOfLines={1} style={styles.summaryLabel}>
                  {line.product.name} × {line.quantity}
                </Text>
                <Text style={styles.summaryValue}>
                  {formatPeso(line.product.price * line.quantity)}
                </Text>
              </View>
            ))}
            <Divider />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPeso(total)}</Text>
            </View>
          </Card>
        </ScrollView>

        <View style={styles.actions}>
          <View style={styles.secureNote}>
            <ShieldCheck color={colors.brand} size={15} />
            <Text style={styles.secureLabel}>Encrypted payment · No service fee</Text>
          </View>
          <Button
            disabled={lines.length === 0}
            icon={<Check color={colors.surface} size={18} />}
            label="PLACE ORDER"
            onPress={submit}
          />
        </View>
      </View>
    </Screen>
  );
}

function EditLink({ onPress }: { onPress?: () => void }) {
  if (!onPress) {
    return <Text style={styles.editLink}>Edit</Text>;
  }

  return (
    <Pressable accessibilityRole="button" hitSlop={8} onPress={onPress}>
      <Text style={styles.editLink}>Edit</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  formScroll: {
    flex: 1,
  },
  form: {
    gap: 8,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickupCard: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  pickupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  pickupTitle: {
    ...type.cardTitleSm,
    color: colors.text,
  },
  editLink: {
    ...type.labelBold,
    color: colors.brand,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 32,
  },
  clockIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  pickupCopy: {
    flex: 1,
    gap: 2,
  },
  pickupEta: {
    ...type.label,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  pickupAddress: {
    ...type.caption,
    color: colors.textMuted,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...type.sectionTitle,
    color: colors.text,
  },
  summaryCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  summaryTitle: {
    ...type.cardTitleSm,
    color: colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 18,
  },
  summaryLabel: {
    ...type.labelSm,
    flex: 1,
    color: colors.textMuted,
  },
  summaryValue: {
    ...type.labelSm,
    fontWeight: '500',
    color: colors.text,
  },
  totalLabel: {
    ...type.price,
    color: colors.text,
  },
  totalValue: {
    ...type.price,
    color: colors.brand,
  },
  actions: {
    gap: 8,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secureLabel: {
    ...type.subtitle,
    color: colors.textMuted,
  },
});