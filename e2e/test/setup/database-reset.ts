import { execSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../../..');

function assertDatabaseUrl(): void {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'Missing DATABASE_URL for E2E DB reset. Set DATABASE_URL to your test database before running E2E tests.',
    );
  }
}

function resetDatabase(trigger: string): void {
  assertDatabaseUrl();

  execSync('npm --prefix backend run db:reset:e2e', {
    cwd: repoRoot,
    env: process.env,
    stdio: 'inherit',
  });

  process.stdout.write(`[e2e-db] reset complete (${trigger})\n`);
}

beforeAll(() => {
  resetDatabase('beforeAll');
});

afterEach(() => {
  resetDatabase('afterEach');
});