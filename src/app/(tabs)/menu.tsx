import { Image } from 'expo-image';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/netbrew/app-bar';
import { Card, SectionHeader } from '@/components/netbrew/card';
import { Chip } from '@/components/netbrew/chip';
import { ScreenScroll } from '@/components/netbrew/screen';
import { TouchIcon } from '@/components/netbrew/touch-icon';
import { categories, type CategoryId, type Product } from '@/constants/catalog';
import { colors, formatPeso, type } from '@/constants/netbrew';
import { useCart } from '@/providers/cart-provider';
import { useProducts } from '@/providers/products-context';

export default function MenuScreen() {
  const [category, setCategory] = useState<CategoryId>('coffee');
  const { products } = useProducts();
  const items = products.filter((product) => product.category === category);

  return (
    <ScreenScroll
      contentStyle={styles.content}
      header={
        <AppBar
          subtitle="Order ahead for pickup"
          title="Menu"
          trailing={
            <TouchIcon accessibilityLabel="Search" icon={<Search color={colors.text} size={22} />} />
          }
        />
      }>
      <View style={styles.chipRow}>
        {categories.map((item) => (
          <Chip
            key={item.id}
            active={item.id === category}
            label={item.label}
            onPress={() => setCategory(item.id)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader action="Filter" title="Our Menu" />
        <View style={styles.list}>
          {items.map((product) => (
            <MenuItem key={product.id} product={product} />
          ))}
        </View>
      </View>
    </ScreenScroll>
  );
}

function MenuItem({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <Card style={styles.item}>
      <Image contentFit="cover" source={product.image} style={styles.thumb} />
      <View style={styles.itemBody}>
        <Text numberOfLines={1} style={styles.itemName}>
          {product.name}
        </Text>
        <Text numberOfLines={2} style={styles.itemDescription}>
          {product.description}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>{formatPeso(product.price)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name}`}
            onPress={() => add(product.id)}
            style={({ pressed }) => [styles.addButton, pressed ? styles.pressed : null]}>
            <Text style={styles.addLabel}>ADD</Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  pressed: {
    opacity: 0.85,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
    gap: 12,
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    height: 154,
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  itemBody: {
    flex: 1,
    gap: 5,
  },
  itemName: {
    ...type.screenTitle,
    color: colors.text,
  },
  itemDescription: {
    ...type.subtitle,
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  addLabel: {
    ...type.micro,
    color: colors.surface,
  },
});