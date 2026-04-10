const DATABASE_URL_PREFIX = 'DATABASE_URL=';

export function normalizeDatabaseUrl(rawValue: string | undefined | null): string | undefined {
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
