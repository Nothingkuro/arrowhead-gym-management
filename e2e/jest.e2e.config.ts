import type { Config } from 'jest';

// Jest requires a numeric timeout; this effectively disables timeouts for E2E runs.
const DISABLED_E2E_TEST_TIMEOUT_MS = 2_147_483_647;

const config: Config = {
  testEnvironment: 'node',
  rootDir: '..',
  roots: ['<rootDir>/e2e/test'],
  testMatch: ['**/specs/**/*.e2e.test.ts'],
  clearMocks: true,
  maxWorkers: 1,
  testTimeout: DISABLED_E2E_TEST_TIMEOUT_MS,
  setupFiles: ['<rootDir>/e2e/test/setup/load-env.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/e2e/test/setup/backend-lifecycle.ts',
    '<rootDir>/e2e/test/setup/database-reset.ts',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/e2e/node_modules'],
  transform: {
    '^.+\\.(ts|tsx)$': ['<rootDir>/e2e/node_modules/ts-jest', { tsconfig: '<rootDir>/e2e/tsconfig.json' }]
  }
};

export default config;
