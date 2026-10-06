import { useSQLiteContext } from 'expo-sqlite';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getProductImage, type CategoryId, type Product } from '@/constants/catalog';
import { ProductsContext, type ProductInput } from '@/providers/products-context';

type ProductRow = {
  id: string;
  name: string;
  description: string;
  blurb: string;
  price: number;
  category: CategoryId;
  stock: number;
  image_key: string;
  featured_note: string | null;
};

function fromRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    blurb: row.blurb,
    price: row.price,
    category: row.category,
    stock: row.stock,
    image: getProductImage(row.image_key, row.category),
    featuredNote: row.featured_note ?? undefined,
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const database = useSQLiteContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const rows = await database.getAllAsync<ProductRow>(
        `SELECT id, name, description, blurb, price, category, stock, image_key, featured_note
         FROM products
         ORDER BY name COLLATE NOCASE`
      );
      setError(null);
      setProducts(rows.map(fromRow));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
      throw loadError;
    }
  }, [database]);

  useEffect(() => {
    let active = true;
    database
      .getAllAsync<ProductRow>(
        `SELECT id, name, description, blurb, price, category, stock, image_key, featured_note
         FROM products
         ORDER BY name COLLATE NOCASE`
      )
      .then((rows) => {
        if (active) {
          setError(null);
          setProducts(rows.map(fromRow));
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
  }, [database]);

  const addProduct = useCallback(
    async (input: ProductInput) => {
      const id = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await database.runAsync(
        `INSERT INTO products (id, name, description, blurb, price, category, stock, image_key)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        input.name.trim(),
        input.description.trim(),
        input.description.trim(),
        input.price,
        input.category,
        input.stock,
        input.category
      );
      await refresh();
    },
    [database, refresh]
  );

  const updateProduct = useCallback(
    async (id: string, input: ProductInput) => {
      const result = await database.runAsync(
        `UPDATE products
         SET name = ?, description = ?, blurb = ?, price = ?, category = ?, stock = ?
         WHERE id = ?`,
        input.name.trim(),
        input.description.trim(),
        input.description.trim(),
        input.price,
        input.category,
        input.stock,
        id
      );
      if (result.changes !== 1) throw new Error('Product no longer exists in the local catalog.');
      await refresh();
    },
    [database, refresh]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const result = await database.runAsync('DELETE FROM products WHERE id = ?', id);
      if (result.changes !== 1) throw new Error('Product no longer exists in the local catalog.');
      await refresh();
    },
    [database, refresh]
  );

  const value = useMemo(
    () => ({ products, loading, error, refresh, addProduct, updateProduct, deleteProduct }),
    [products, loading, error, refresh, addProduct, updateProduct, deleteProduct]
  );

  return <ProductsContext value={value}>{children}</ProductsContext>;
}
