import { Coffee } from 'lucide-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { colors } from '@/constants/netbrew';

const DURATION = 500;

export function SplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const fade = new Keyframe({
    0: {
      opacity: 1,
    },
    35: {
      opacity: 1,
    },
    100: {
      opacity: 0,
      easing: Easing.out(Easing.cubic),
    },
  });

  const logo = (
    <View style={styles.tile}>
      <Coffee color={colors.surface} size={44} />
    </View>
  );

  if (animate) {
    return (
      <Animated.View
        entering={fade.duration(DURATION).withCallback((finished) => {
          'worklet';
          if (finished) {
            scheduleOnRN(setVisible, false);
          }
        })}
        style={styles.overlay}>
        {logo}
      </Animated.View>
    );
  }

  return (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => setAnimate(true));
      }}
      style={styles.overlay}>
      {logo}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  tile: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
});