import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  EllipsisVertical,
  MapPin,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/netbrew/app-bar';
import { Button } from '@/components/netbrew/button';
import { Card, Divider, SectionHeader } from '@/components/netbrew/card';
import { Screen } from '@/components/netbrew/screen';
import { TouchIcon } from '@/components/netbrew/touch-icon';
import { PICKUP_LOCATION, TOUCH, colors, formatPeso, type } from '@/constants/netbrew';
import { useCart, type CartLine } from '@/providers/cart-provider';

export default function CartScreen() {
  const { lines, itemCount, subtotal, tax, total } = useCart();

  return (
    <Screen>
      <AppBar
        leading={
          <TouchIcon
            accessibilityLabel="Go back"
            icon={<ArrowLeft color={colors.text} size={22} />}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
        }
        subtitle={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
        title="Your cart"
        trailing={
          <TouchIcon
            accessibilityLabel="More options"
            icon={<EllipsisVertical color={colors.text} size={22} />}
          />
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator
        style={styles.scroll}>
        <View style={styles.section}>
          <SectionHeader action="Add items" onActionPress={() => router.push('/menu')} title="Your picks" />
          {lines.length === 0 ? (
            <Card style={styles.empty}>
              <Text style={styles.emptyText}>Your cart is empty. Add something warm.</Text>
            </Card>
          ) : (
            <View style={styles.lines}>
              {lines.map((line) => (
                <CartItem key={line.product.id} line={line} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.pickup}>
          <View style={styles.pickupIcon}>
            <MapPin color={colors.surface} size={19} />
          </View>
          <View style={styles.pickupCopy}>
            <Text style={styles.pickupEyebrow}>PICKUP AT</Text>
            <Text numberOfLines={1} style={styles.pickupTitle}>
              {PICKUP_LOCATION}
            </Text>
          </View>
          <ChevronRight color={colors.text} size={18} />
        </View>

        <Card style={styles.summary}>
          <SummaryRow label="Subtotal" value={formatPeso(subtotal)} />
          <SummaryRow label="Tax" value={formatPeso(tax)} />
          <Divider />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPeso(total)}</Text>
          </View>
        </Card>
      </ScrollView>
      <View style={styles.checkoutBar}>
        <Button
          disabled={lines.length === 0}
          icon={<ArrowRight color={colors.surface} size={18} />}
          label={`CHECKOUT · ${formatPeso(total)}`}
          onPress={() => router.push('/checkout')}
        />
      </View>
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function CartItem({ line }: { line: CartLine }) {
  const { decrement, increment, remove } = useCart();
  const { product, quantity } = line;

  return (
    <Card style={styles.item}>
      <Image contentFit="cover" source={product.image} style={styles.itemImage} />
      <View style={styles.itemBody}>
        <View style={styles.itemHead}>
          <Text numberOfLines={1} style={styles.itemName}>
            {product.name}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${product.name}`}
            hitSlop={6}
            onPress={() => remove(product.id)}
            style={styles.itemRemove}>
            <Trash2 color={colors.textMuted} size={16} />
          </Pressable>
        </View>
        <Text style={styles.itemQuantity}>× {quantity}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>{formatPeso(product.price)}</Text>
          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Decrease ${product.name}`}
              onPress={() => decrement(product.id)}
              style={({ pressed }) => [styles.stepButton, styles.stepMinus, pressed ? styles.pressed : null]}>
              <Minus color={colors.brand} size={16} />
            </Pressable>
            <Text style={styles.stepValue}>{quantity}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Increase ${product.name}`}
              onPress={() => increment(product.id)}
              style={({ pressed }) => [styles.stepButton, styles.stepPlus, pressed ? styles.pressed : null]}>
              <Plus color={colors.surface} size={16} />
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  scroll: {
    flex: 1,
  },
  checkoutBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  section: {
    gap: 8,
  },
  lines: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    height: 142,
  },
  itemImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  itemBody: {
    flex: 1,
    gap: 4,
  },
  itemHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemName: {
    ...type.itemTitle,
    flex: 1,
    color: colors.text,
  },
  itemRemove: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemQuantity: {
    ...type.muted,
    color: colors.textMuted,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  itemPrice: {
    ...type.price,
    color: colors.text,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepButton: {
    width: TOUCH,
    height: TOUCH,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepMinus: {
    backgroundColor: colors.brandSoft,
  },
  stepPlus: {
    backgroundColor: colors.brand,
  },
  stepValue: {
    ...type.qty,
    width: 24,
    textAlign: 'center',
    color: colors.text,
  },
  pickup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 64,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.brandSoft,
  },
  pickupIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  pickupCopy: {
    flex: 1,
    gap: 2,
  },
  pickupEyebrow: {
    ...type.label,
    color: colors.textMuted,
  },
  pickupTitle: {
    ...type.optionTitle,
    color: colors.text,
  },
  summary: {
    padding: 16,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 20,
  },
  summaryLabel: {
    ...type.optionLabel,
    color: colors.textMuted,
  },
  summaryValue: {
    ...type.bodyMd,
    color: colors.text,
  },
  totalLabel: {
    ...type.itemTitle,
    color: colors.text,
  },
  totalValue: {
    ...type.priceLg,
    color: colors.brand,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    ...type.body,
    color: colors.textMuted,
  },
});