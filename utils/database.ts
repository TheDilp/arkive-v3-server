import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import drizzleConfig from "../drizzle.config";

// for migrations
export const migrationClient = postgres(process.env.DATABASE_URL as string, {
  max: 1,
});

// for query purposes
const queryClient = postgres(process.env.DATABASE_URL as string);
export const db: PostgresJsDatabase = drizzle(queryClient);
