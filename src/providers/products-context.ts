import { createContext, use } from 'react';

import type { CategoryId, Product } from '@/constants/catalog';

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  stock: number;
};

export type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addProduct: (input: ProductInput) => Promise<void>;
  updateProduct: (id: string, input: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

export const ProductsContext = createContext<ProductsContextValue | null>(null);

export function useProducts(): ProductsContextValue {
  const context = use(ProductsContext);
  if (!context) throw new Error('useProducts must be used inside a ProductsProvider');
  return context;
}
