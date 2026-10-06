import { SQLiteProvider } from 'expo-sqlite';
import type { ReactNode } from 'react';

import { initializeDatabase } from '@/db/database';

export function DatabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SQLiteProvider databaseName="netbrew.db" onInit={initializeDatabase}>
      {children}
    </SQLiteProvider>
  );
}
