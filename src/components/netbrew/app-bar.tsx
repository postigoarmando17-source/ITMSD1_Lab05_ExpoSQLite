import { Coffee } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TouchIcon } from '@/components/netbrew/touch-icon';
import { colors, TOUCH, type } from '@/constants/netbrew';

type AppBarProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function AppBar({ title, subtitle, leading, trailing }: AppBarProps) {
  return (
    <View style={styles.bar}>
      {leading ?? <BrandMark />}
      <View style={styles.titles}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

export function BrandMark() {
  return (
    <TouchIcon icon={<CafeLogo />} accessibilityLabel="NetBrew Café" />
  );
}

export function CafeLogo({ size = 22, color = colors.surface }: { size?: number; color?: string }) {
  return (
    <View style={styles.logo}>
      <Coffee color={color} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    height: 56,
    backgroundColor: colors.background,
  },
  titles: {
    flex: 1,
    gap: 1,
  },
  title: {
    ...type.pageTitle,
    color: colors.text,
  },
  subtitle: {
    ...type.subtitle,
    color: colors.textMuted,
  },
  logo: {
    width: TOUCH - 8,
    height: TOUCH - 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
});