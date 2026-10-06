import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';

import type { Product } from '@/constants/catalog';
import { useProducts } from '@/providers/products-context';

export type CartLine = {
  product: Product;
  quantity: number;
};

export type CartTotals = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
};

type CartContextValue = CartTotals & {
  lastOrder: CartTotals | null;
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  /** Snapshots the current cart as the placed order, then empties the cart. */
  placeOrder: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Matches the mock: one iced latte + two croissants = ₱280. */
const INITIAL_CART: Record<string, number> = {
  'iced-latte': 1,
  croissant: 2,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  const [quantities, setQuantities] = useState<Record<string, number>>(INITIAL_CART);
  const [lastOrder, setLastOrder] = useState<CartTotals | null>(null);

  const add = useCallback((productId: string, quantity = 1) => {
    setQuantities((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + quantity,
    }));
  }, []);

  const remove = useCallback((productId: string) => {
    setQuantities((current) => {
      if (productId in current === false) return current;
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setQuantities((current) => {
      if (quantity <= 0) {
        if (productId in current === false) return current;
        const next = { ...current };
        delete next[productId];
        return next;
      }
      if (current[productId] === quantity) return current;
      return { ...current, [productId]: quantity };
    });
  }, []);

  const increment = useCallback((productId: string) => {
    setQuantities((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  }, []);

  const decrement = useCallback((productId: string) => {
    setQuantities((current) => {
      const next = (current[productId] ?? 0) - 1;
      if (next > 0) return { ...current, [productId]: next };
      if (productId in current === false) return current;
      const without = { ...current };
      delete without[productId];
      return without;
    });
  }, []);

  const clear = useCallback(() => setQuantities({}), []);

  const cart = useMemo<CartTotals>(() => {
    const lines: CartLine[] = [];
    let subtotal = 0;

    for (const [productId, quantity] of Object.entries(quantities)) {
      if (quantity <= 0) continue;
      const product = products.find((item) => item.id === productId);
      if (!product) continue;
      lines.push({ product, quantity });
      subtotal += product.price * quantity;
    }

    const tax = 0;

    return {
      lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }, [quantities, products]);

  const placeOrder = useCallback(() => {
    setLastOrder(cart);
    setQuantities({});
  }, [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      ...cart,
      lastOrder,
      add,
      remove,
      setQuantity,
      increment,
      decrement,
      clear,
      placeOrder,
    }),
    [cart, lastOrder, add, remove, setQuantity, increment, decrement, clear, placeOrder]
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = use(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider');
  return context;
}