import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getProductImage, products as initialProducts, type Product } from '@/constants/catalog';
import { ProductsContext, type ProductInput } from '@/providers/products-context';

const STORAGE_KEY = 'netbrew-products';

type StoredProduct = {
  id: string;
  name: string;
  description: string;
  blurb: string;
  price: number;
  category: Product['category'];
  stock: number;
  imageKey: string;
  featuredNote?: string;
};

function isStoredProduct(value: unknown): value is StoredProduct {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.description === 'string' &&
    typeof item.blurb === 'string' &&
    typeof item.price === 'number' &&
    (item.category === 'coffee' ||
      item.category === 'non-coffee' ||
      item.category === 'pastries') &&
    typeof item.stock === 'number' &&
    typeof item.imageKey === 'string' &&
    (item.featuredNote === undefined || typeof item.featuredNote === 'string')
  );
}

function serializeProduct(product: Product): StoredProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    blurb: product.blurb,
    price: product.price,
    category: product.category,
    stock: product.stock,
    imageKey: product.id,
    featuredNote: product.featuredNote,
  };
}

function deserializeProducts(value: unknown): Product[] {
  if (!Array.isArray(value) || !value.every(isStoredProduct)) {
    throw new Error('Saved browser inventory has an invalid format.');
  }

  return value.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    blurb: item.blurb,
    price: item.price,
    category: item.category,
    stock: item.stock,
    image: getProductImage(item.imageKey, item.category),
    featuredNote: item.featuredNote,
  }));
}

function readProducts(): Product[] {
  const serialized = window.localStorage.getItem(STORAGE_KEY);
  if (serialized === null) {
    const seeded = initialProducts;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded.map(serializeProduct)));
    return seeded;
  }
  const savedProducts: unknown = JSON.parse(serialized);
  return deserializeProducts(savedProducts);
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const savedProducts = readProducts();
      setProducts(savedProducts);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
      throw loadError;
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(readProducts)
      .then((savedProducts) => {
        if (active) {
          setProducts(savedProducts);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : String(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((nextProducts: Product[]) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextProducts.map(serializeProduct))
      );
      setProducts(nextProducts);
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : String(saveError));
      throw saveError;
    }
  }, []);

  const addProduct = useCallback(
    async (input: ProductInput) => {
      const id = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      persist([
        ...products,
        {
          ...input,
          id,
          name: input.name.trim(),
          description: input.description.trim(),
          blurb: input.description.trim(),
          image: getProductImage(input.category, input.category),
        },
      ]);
    },
    [persist, products]
  );

  const updateProduct = useCallback(
    async (id: string, input: ProductInput) => {
      if (!products.some((product) => product.id === id)) {
        throw new Error('Product no longer exists in the local catalog.');
      }
      persist(
        products.map((product) =>
          product.id === id
            ? {
                ...product,
                ...input,
                name: input.name.trim(),
                description: input.description.trim(),
                blurb: input.description.trim(),
              }
            : product
        )
      );
    },
    [persist, products]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!products.some((product) => product.id === id)) {
        throw new Error('Product no longer exists in the local catalog.');
      }
      persist(products.filter((product) => product.id !== id));
    },
    [persist, products]
  );

  const value = useMemo(
    () => ({ products, loading, error, refresh, addProduct, updateProduct, deleteProduct }),
    [products, loading, error, refresh, addProduct, updateProduct, deleteProduct]
  );

  return <ProductsContext value={value}>{children}</ProductsContext>;
}
