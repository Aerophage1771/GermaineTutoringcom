import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set (for example in your .env file) to a direct Postgres connection string like postgresql://...");
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
