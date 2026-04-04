import { execSync } from 'node:child_process';
import prisma, { disconnectPrisma } from '../../src/lib/prisma';

function quoteIdentifier(value: string): string {
	return `"${value.replace(/"/g, '""')}"`;
}

function assertSafeDatabaseUrl(): void {
	const databaseUrl = process.env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error('DATABASE_URL is required for E2E DB reset.');
	}

	// Prevent accidental truncation of a non-test database.
	const isLikelyTestDatabase = /test/i.test(databaseUrl);
	if (!isLikelyTestDatabase && process.env.E2E_ALLOW_NON_TEST_DB_RESET !== 'true') {
		throw new Error(
			'Refusing to reset DATABASE_URL because it does not look like a test database. ' +
				'Include "test" in the URL or set E2E_ALLOW_NON_TEST_DB_RESET=true to override.',
		);
	}
}

async function truncatePublicTables(): Promise<void> {
	const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
		SELECT tablename
		FROM pg_tables
		WHERE schemaname = 'public'
			AND tablename <> '_prisma_migrations'
	`;

	if (tables.length === 0) {
		return;
	}

	const qualifiedTables = tables
		.map(({ tablename }) => `"public".${quoteIdentifier(tablename)}`)
		.join(', ');

	await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${qualifiedTables} RESTART IDENTITY CASCADE`);
}

async function main(): Promise<void> {
	assertSafeDatabaseUrl();
	await truncatePublicTables();
	await disconnectPrisma();

	execSync('npm run db:seed', {
		cwd: process.cwd(),
		env: process.env,
		stdio: 'inherit',
	});
}

main()
	.catch(async (error) => {
		console.error('E2E DB reset failed:', error);

		try {
			await disconnectPrisma();
		} catch {
			// Best effort disconnect
		}

		process.exit(1);
	});
