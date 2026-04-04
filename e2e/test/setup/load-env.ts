import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line
      .slice(0, separatorIndex)
      .trim()
      .replace(/^export\s+/, '');
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // E2E vars should win over shell defaults to avoid mixing with backend dev env.
    process.env[key] = value;
  }
}

const envPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  loadEnvFile(envPath);
}
