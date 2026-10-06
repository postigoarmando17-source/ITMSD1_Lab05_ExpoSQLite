import type { SQLiteDatabase } from 'expo-sqlite';

import { products } from '@/constants/catalog';

export async function initializeDatabase(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      blurb TEXT NOT NULL,
      price REAL NOT NULL CHECK (price > 0),
      category TEXT NOT NULL CHECK (category IN ('coffee', 'non-coffee', 'pastries')),
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      image_key TEXT NOT NULL,
      featured_note TEXT
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name COLLATE NOCASE);
  `);

  const seeded = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    'catalog_seeded'
  );

  if (seeded) return;

  await database.withTransactionAsync(async () => {
    const existing = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM products'
    );

    if (!existing?.count) {
      for (const product of products) {
        await database.runAsync(
          `INSERT INTO products
            (id, name, description, blurb, price, category, stock, image_key, featured_note)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          product.id,
          product.name,
          product.description,
          product.blurb,
          product.price,
          product.category,
          product.stock,
          product.id,
          product.featuredNote ?? null
        );
      }
    }

    await database.runAsync(
      'INSERT INTO app_meta (key, value) VALUES (?, ?)',
      'catalog_seeded',
      'true'
    );
  });
}
