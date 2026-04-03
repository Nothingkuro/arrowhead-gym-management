import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

if (process.env.CI) {
  process.exit(0);
}

const envTestPath = path.resolve(process.cwd(), '.env.test');

if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath, override: true });
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to run integration tests.');
}

execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
execSync('npx prisma migrate dev', { stdio: 'inherit', env: process.env });
