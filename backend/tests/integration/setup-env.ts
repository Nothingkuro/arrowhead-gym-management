import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// In CI, DATABASE_URL is injected by workflow secrets. Keep that source of truth.
if (!process.env.CI) {
  const envTestPath = path.resolve(process.cwd(), '.env.test');

  if (fs.existsSync(envTestPath)) {
    dotenv.config({ path: envTestPath, override: true });
  }
}

process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
