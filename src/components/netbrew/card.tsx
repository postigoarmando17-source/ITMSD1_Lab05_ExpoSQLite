import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { cardShadow, colors, type } from '@/constants/netbrew';

export function Card({
  children,
  style,
  padded = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  return <View style={[styles.card, padded && styles.cardPadded, style]}>{children}</View>;
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

type SectionHeaderProps = {
  title: string;
  action?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, action, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        onActionPress ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={onActionPress}
            style={styles.sectionAction}>
            <Text style={styles.sectionActionLabel}>{action}</Text>
          </Pressable>
        ) : (
          <View style={styles.sectionAction}>
            <Text style={styles.sectionActionLabel}>{action}</Text>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    ...cardShadow,
  },
  cardPadded: {
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  sectionTitle: {
    ...type.sectionTitle,
    color: colors.text,
  },
  sectionAction: {
    justifyContent: 'center',
    height: 48,
  },
  sectionActionLabel: {
    ...type.labelBold,
    color: colors.brand,
  },
});