import { execSync, spawn, type ChildProcess } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../../..');
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? '5001');
const useExistingBackend = process.env.E2E_USE_EXISTING_BACKEND === 'true';

let backendProcess: ChildProcess | undefined;

function buildBackendEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };

  if (!env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL for E2E-managed backend process.');
  }

  env.PORT = String(backendPort);
  env.NODE_ENV = 'test';
  env.FRONTEND_URL = env.E2E_BASE_URL ?? env.FRONTEND_URL ?? 'http://localhost:5173';

  return env;
}

function waitForPort(port: number, timeoutMs = 30_000): Promise<void> {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = new net.Socket();

      socket
        .once('connect', () => {
          socket.destroy();
          resolve();
        })
        .once('error', () => {
          socket.destroy();

          if (Date.now() - start >= timeoutMs) {
            reject(new Error(`Timed out waiting for backend on port ${port}.`));
            return;
          }

          setTimeout(tryConnect, 300);
        })
        .connect(port, '127.0.0.1');
    };

    tryConnect();
  });
}

async function startBackend(): Promise<void> {
  if (useExistingBackend) {
    return;
  }

  const env = buildBackendEnv();

  backendProcess = spawn('npm', ['--prefix', 'backend', 'run', 'start:e2e'], {
    cwd: repoRoot,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  await waitForPort(backendPort);
}

function stopBackend(): void {
  if (!backendProcess || backendProcess.killed) {
    return;
  }

  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /pid ${backendProcess.pid} /T /F`);
    } catch {
      // Best effort shutdown
    }
    return;
  }

  backendProcess.kill('SIGTERM');
}

beforeAll(async () => {
  await startBackend();
});

afterAll(() => {
  stopBackend();
});