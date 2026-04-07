/**
 * Prisma Configuration for Migrations
 *
 * This file configures database connection for Prisma Migrate and other CLI tools.
 * Required for Prisma 7.x which separates runtime configuration from schema.
 *
 * @see https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */

import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const DATABASE_URL_PREFIX = "DATABASE_URL=";

function normalizeDatabaseUrl(rawValue: string | undefined | null): string | undefined {
  if (!rawValue) {
    return undefined;
  }

  let normalizedValue = rawValue.trim();

  if (normalizedValue.startsWith(DATABASE_URL_PREFIX)) {
    normalizedValue = normalizedValue.slice(DATABASE_URL_PREFIX.length).trim();
  }

  const isWrappedInQuotes =
    (normalizedValue.startsWith('"') && normalizedValue.endsWith('"')) ||
    (normalizedValue.startsWith("'") && normalizedValue.endsWith("'"));

  if (isWrappedInQuotes) {
    normalizedValue = normalizedValue.slice(1, -1).trim();
  }

  return normalizedValue || undefined;
}

// Load .env file before accessing environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),

  datasource: {
    url: normalizeDatabaseUrl(process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL),
  },
});
