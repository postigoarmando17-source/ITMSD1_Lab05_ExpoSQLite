import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { SplashOverlay } from '@/components/splash-overlay';
import { colors } from '@/constants/netbrew';
import { CartProvider } from '@/providers/cart-provider';
import { DatabaseProvider } from '@/providers/database-provider';
import { ProductsProvider } from '@/providers/products-provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <ProductsProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <SplashOverlay />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="confirmation" options={{ gestureEnabled: false }} />
          </Stack>
        </CartProvider>
      </ProductsProvider>
    </DatabaseProvider>
  );
}