import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowRight, Bell, Clock3, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/netbrew/app-bar';
import { Card, SectionHeader } from '@/components/netbrew/card';
import { Chip } from '@/components/netbrew/chip';
import { ScreenScroll } from '@/components/netbrew/screen';
import { TouchIcon } from '@/components/netbrew/touch-icon';
import { categories, type Product } from '@/constants/catalog';
import { PICKUP_ESTIMATE, colors, formatPeso, type } from '@/constants/netbrew';
import { useCart } from '@/providers/cart-provider';
import { useProducts } from '@/providers/products-context';

export default function HomeScreen() {
  const { products } = useProducts();
  const featuredProducts = products.filter((product) => product.featuredNote);

  return (
    <ScreenScroll
      contentStyle={styles.content}
      header={
        <AppBar
          subtitle="Where code meets caffeine."
          title="NetBrew Café"
          trailing={
            <TouchIcon
              accessibilityLabel="Notifications"
              icon={<Bell color={colors.text} size={22} />}
            />
          }
        />
      }>
      <Hero />
      <QuickCategories />
      <FeaturedSection products={featuredProducts} />
    </ScreenScroll>
  );
}

function Hero() {
  return (
    <View style={styles.hero}>
      <Image
        source={require('@/assets/images/products/hero-cafe.png')}
        contentFit="cover"
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(31,31,31,0.72)', 'rgba(31,31,31,0.18)']}
        locations={[0, 0.86]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.heroBody}>
        <View style={styles.pickupBadge}>
          <Clock3 color={colors.surface} size={15} />
          <Text style={styles.pickupBadgeLabel}>READY IN {PICKUP_ESTIMATE.toUpperCase()}</Text>
        </View>
        <Text style={styles.heroTitle}>Fuel your next idea.</Text>
        <Text style={styles.heroCopy}>
          Fresh coffee, flaky pastries, and easy pickup between classes.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/menu')}
          style={({ pressed }) => [styles.heroCta, pressed ? styles.pressed : null]}>
          <Text style={styles.heroCtaLabel}>ORDER NOW</Text>
          <ArrowRight color={colors.brand} size={17} />
        </Pressable>
      </View>
    </View>
  );
}

function QuickCategories() {
  return (
    <View style={styles.quickCategories}>
      <Text style={styles.eyebrowMuted}>QUICK CATEGORIES</Text>
      <View style={styles.chipRow}>
        {categories.map((item, index) => (
          <Chip
            key={item.id}
            active={index === 0}
            label={item.label}
            onPress={() => router.push('/menu')}
          />
        ))}
      </View>
    </View>
  );
}

function FeaturedSection({ products }: { products: Product[] }) {
  return (
    <View style={styles.featured}>
      <SectionHeader
        action="See all"
        onActionPress={() => router.push('/menu')}
        title="Featured Drinks"
      />
      <View style={styles.featuredRow}>
        {products.map((product) => (
          <FeaturedCard key={product.id} {...product} />
        ))}
      </View>
    </View>
  );
}

function FeaturedCard({
  id,
  name,
  blurb,
  price,
  image,
  featuredNote,
}: Product) {
  const { add } = useCart();

  return (
    <Card padded={false} style={styles.featuredCard}>
      <Image contentFit="cover" source={image} style={styles.featuredImage} />
      <View style={styles.featuredBody}>
        <Text style={styles.featuredNote}>{featuredNote?.toUpperCase()}</Text>
        <Text numberOfLines={2} style={styles.featuredName}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.featuredBlurb}>
          {blurb}
        </Text>
        <View style={styles.featuredFooter}>
          <Text style={styles.featuredPrice}>{formatPeso(price)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${name}`}
            hitSlop={10}
            onPress={() => add(id)}
            style={({ pressed }) => [styles.addPill, pressed ? styles.pressed : null]}>
            <Plus color={colors.surface} size={18} />
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
  hero: {
    height: 208,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.text,
  },
  heroBody: {
    flex: 1,
    padding: 16,
    gap: 4,
  },
  pickupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  pickupBadgeLabel: {
    ...type.micro,
    color: colors.surface,
  },
  heroTitle: {
    ...type.hero,
    color: colors.surface,
  },
  heroCopy: {
    ...type.bodySm,
    color: colors.surface,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  heroCtaLabel: {
    ...type.labelBold,
    color: colors.brand,
  },
  quickCategories: {
    gap: 8,
  },
  eyebrowMuted: {
    ...type.labelBold,
    color: colors.textMuted,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featured: {
    gap: 12,
  },
  featuredRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featuredCard: {
    flex: 1,
    height: 250,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 112,
  },
  featuredBody: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  featuredNote: {
    ...type.eyebrow,
    color: colors.accent,
  },
  featuredName: {
    ...type.nameSm,
    color: colors.text,
  },
  featuredBlurb: {
    ...type.caption,
    color: colors.textMuted,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  featuredPrice: {
    ...type.price,
    color: colors.text,
  },
  addPill: {
    width: 33,
    height: 26,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
});