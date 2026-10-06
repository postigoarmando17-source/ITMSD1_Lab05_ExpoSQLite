import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/constants/netbrew';

type ScreenProps = {
  children: ReactNode;
  /** Pushed stack screens also need to clear the bottom inset. */
  edges?: Edge[];
};

export function Screen({ children, edges = ['top'] }: ScreenProps) {
  return (
    <View style={styles.screen}>
      <SafeAreaView edges={edges} style={styles.fill}>
        {children}
      </SafeAreaView>
    </View>
  );
}

type ScreenScrollProps = {
  header?: ReactNode;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export function ScreenScroll({ header, children, contentStyle }: ScreenScrollProps) {
  return (
    <Screen>
      {header}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentStyle]}
        // `flex: 1` keeps the viewport bounded so long screens always scroll
        // instead of growing to their content height.
        style={styles.scroll}
        showsVerticalScrollIndicator>
        {children}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
});