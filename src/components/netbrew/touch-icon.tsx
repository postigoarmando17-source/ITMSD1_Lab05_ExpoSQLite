import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { TOUCH } from '@/constants/netbrew';

type TouchIconProps = {
  icon: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
};

/** 48×48 hit area that keeps a small icon optically centred. */
export function TouchIcon({ icon, onPress, accessibilityLabel }: TouchIconProps) {
  const style = styles.touch;

  // Without a handler this is decorative, so it must not be exposed as a button.
  if (!onPress) {
    return (
      <View accessibilityLabel={accessibilityLabel} style={style}>
        {icon}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={4}
      onPress={onPress}
      style={style}>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: TOUCH,
    height: TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});