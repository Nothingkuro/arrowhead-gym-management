# Backend — Arrowhead Gym Management System

Express/TypeScript REST API with Prisma ORM. This package contains the API server, database schema, migrations, seed scripts, and test suites.

---

## Local Setup

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:seed
npm run dev
```

---

## Environment Variables

Copy `.env.example` to `.env` and provide values for the following keys. **Do not commit real secrets.**

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Pooled PostgreSQL connection string (NeonDB **pooler** endpoint). Used by the Express app at runtime. |
| `DIRECT_URL` | Yes | Direct PostgreSQL connection string (NeonDB **non-pooler** endpoint). Required by Prisma for migrations and introspection — the pooler does not support the extended query protocol these operations need. |
| `FRONTEND_URL` | Yes | Frontend origin allowed by the CORS policy (e.g., `http://localhost:5173`). |
| `JWT_SECRET` | Yes | Secret used to sign session JWTs. |
| `SESSION_TTL` | No | Session duration (default: `7d`). |
| `AUTH_COOKIE_NAME` | No | Cookie name (default: `arrowhead_session`). |
| `AUTH_COOKIE_SAME_SITE` | No | Cookie SameSite attribute. Defaults to `lax` in development, `none` in production. |
| `AUTH_COOKIE_SECURE` | No | Cookie Secure flag. Defaults to `false` in development, `true` in production. |
| `BCRYPT_ROUNDS` | No | bcrypt hashing cost (default: `10`). |
| `SEED_OWNER_USERNAME` | Yes | Username for the seeded admin account. |
| `SEED_OWNER_PASSWORD` | Yes | Password for the seeded admin account. |
| `SEED_STAFF_USERNAME` | Yes | Username for the seeded staff account. |
| `SEED_STAFF_PASSWORD` | Yes | Password for the seeded staff account. |
| `PORT` | No | HTTP server port (default: `5001`). |
| `NODE_ENV` | No | Runtime environment (`development`, `test`, `production`). |
| `TZ` | No | Process timezone (default: `Asia/Manila`). Ensures all date/time operations align with the gym's local timezone. |

> **Rationale — `DIRECT_URL`:** NeonDB routes pooled connections through PgBouncer, which does not support the extended query protocol required by `prisma migrate` and `prisma db push`. The `DIRECT_URL` bypasses the pooler for schema management only.

---

## Data Consistency

All operations that modify interdependent records use **Prisma interactive transactions** (`prisma.$transaction`) at the `Serializable` isolation level to guarantee atomicity (NFR-2.1):

| Operation | What the transaction protects |
|---|---|
| **Process Payment** (`ProcessPaymentCommand.execute`) | Locks the member row (`SELECT ... FOR UPDATE`), creates the Payment record, and updates the member's `expiryDate` and `status` in a single atomic unit. Includes retry logic for serialization conflicts (Prisma error `P2034`). |
| **Undo Payment** (`ProcessPaymentCommand.undo`) | Locks the member row, reverts `status` and `expiryDate` to the snapshot stored in `previousStatus`/`previousExpiryDate`, and deletes the Payment record atomically. |
| **Check-in / Undo Check-in** (`CheckInCommand`) | Validates active membership status and creates or deletes the Attendance record within a transaction. |
| **Paginated Queries** | Supplier, member, and equipment listing endpoints use batch transactions to execute `count()` and `findMany()` together, ensuring consistent pagination metadata. |

> **Rationale:** The Command pattern encapsulates each mutation as a reversible operation with `execute()` and `undo()` methods, aligning with the 5-second undo grace period defined in US-2.3 and US-7.1.

---

## Authentication & Session Flow

1. **Login:** Client sends credentials to `POST /api/auth/login`. The server validates the password hash (bcrypt), generates a signed JWT, and sets it as an HTTP-only cookie.
2. **Session Refresh:** The frontend's `InactivityTimeout` component monitors user activity (mouse, keyboard, API calls). On each activity window, it calls `POST /api/auth/refresh` to obtain a fresh JWT, extending the session.
3. **Inactivity Timeout:** After **5 minutes** of continuous inactivity (US-9.2), the frontend automatically calls `POST /api/auth/logout` and redirects to the login page.
4. **RBAC Enforcement:** Every protected route passes through `requireAuth` middleware (JWT verification) and optionally `requireRole('ADMIN')` to restrict access. Staff cannot access `/reports` endpoints or delete financial records (NFR-3.2).
5. **Credential Management:** The Owner manages both admin and staff usernames/passwords through the Profiles page (FR-8.1). There is no self-service password reset.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the API in watch mode (nodemon) |
| `npm run build` | Generate Prisma Client and compile TypeScript |
| `npm run start` | Run the compiled server from `dist/src/server.js` |
| `npm run test` | Run all Jest tests |
| `npm run test:unit` | Run unit tests only (no database required) |
| `npm run test:integration` | Run integration tests (requires `DATABASE_URL_TEST`) |
| `npm run db:generate` | Generate the Prisma Client from the schema |
| `npm run db:seed` | Seed the local development database |
| `npm run db:migrate` | Apply pending Prisma migrations (development) |
| `npm run db:reset:e2e` | Reset and reseed the E2E test database |

---

## Folder Conventions

| Directory | Contents |
|---|---|
| `src/app.ts` | Express app composition (middleware, CORS, routes) |
| `src/server.ts` | HTTP server bootstrap |
| `src/controllers/` | Request handlers for each API domain |
| `src/routes/` | Route declarations and role guard wiring |
| `src/middleware/` | Auth verification and role enforcement |
| `src/services/` | Business logic services (analytics, revenue forecasting) |
| `src/lib/` | Prisma client singleton |
| `src/utils/` | JWT helpers, cookie options, password hashing |
| `src/config/` | `ConfigManager` singleton for environment variables |
| `src/patterns/` | GoF design pattern implementations (Command, Strategy, Observer, Factory, Singleton) |
| `prisma/schema.prisma` | Database model definitions |
| `prisma/seed.ts` | Development and test seed data |
| `tests/unit/` | Controller and utility unit tests (Prisma mocked) |
| `tests/integration/` | API-level tests against a real database |

---

## Documentation

- [Architecture Reference](../docs/technical/01-architecture.md)
- [Database Schema](../docs/technical/02-database.md)
- [API Reference](../docs/technical/03-api-reference.md)
- [Testing Strategy](../docs/guides/testing.md)
- [Root Project Guide](../README.md)