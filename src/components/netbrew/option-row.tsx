import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TOUCH, colors, type } from '@/constants/netbrew';

type OptionRowProps = {
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onPress: () => void;
};

export function OptionRow({ title, description, icon, selected, onPress }: OptionRowProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected ? styles.rowSelected : styles.rowIdle,
        pressed ? styles.pressed : null,
      ]}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.description}>
          {description}
        </Text>
      </View>
      <Radio selected={selected} />
    </Pressable>
  );
}

export function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={styles.radioTarget}>
      <View style={[styles.radioOutline, selected ? styles.radioSelected : styles.radioUnselected]}>
        {selected ? <View style={styles.radioCentre} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 56,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  rowSelected: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
    borderWidth: 2,
  },
  rowIdle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...type.optionTitle,
    color: colors.text,
  },
  description: {
    ...type.subtitle,
    color: colors.textMuted,
  },
  radioTarget: {
    width: TOUCH,
    height: TOUCH,
    marginRight: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.brand,
  },
  radioUnselected: {
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
  },
  radioCentre: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
});