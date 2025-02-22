import * as schema from './schema';

import { drizzle } from 'drizzle-orm/node-postgres';

// Initialize drizzle with the schema
export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
  schema,
});

// Export all schema objects
export * from './schema';
