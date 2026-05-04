# Playwright E2E — Arrowhead Gym Management System

This package runs browser-based end-to-end tests that validate the system's functional requirements against the SRS user stories. Each test suite maps to a specific feature area, ensuring traceability from specification to verified behavior.

---

## SRS Traceability Matrix

| Test Suite | SRS Coverage | Key Scenarios |
|---|---|---|
| `authentication-flow.e2e.spec.ts` | FR-8, NFR-3.1, NFR-3.2 | Login form rendering, invalid credential rejection, Staff login with restricted navigation, Owner login with full navigation, logout and redirect. |
| `membership-management.e2e.spec.ts` | FR-1, FR-7 (US-1.1, US-1.3, US-1.4, US-7.1) | New member registration with validation, check-in with active-status enforcement, **undo check-in** within grace period, profile editing, and member deactivation. |
| `payment-subscription.e2e.spec.ts` | FR-2 (US-2.1, US-2.2, US-2.3) | Payment processing with plan selection, **undo payment** within 5-second grace period, payment history viewing with month/year filtering. |
| `equipment-tracking.e2e.spec.ts` | FR-3 (US-3.1, US-3.2) | Condition status updates (Good/Needs Repair/Out of Order), filtering by condition, equipment CRUD operations, timestamp verification on updates. |
| `supplier-transaction.e2e.spec.ts` | FR-4 (US-4.1, US-4.2) | Supplier directory filtering by category, supplier detail editing, purchase history access, new transaction logging. |
| `reporting-analytics.e2e.spec.ts` | FR-5 (US-5.1, US-5.6) | Reports overview cards with seeded data, **inventory threshold alerts** (default: 5 units), threshold adjustment and alert list refresh. |
| `membership-plan-configuration.e2e.spec.ts` | FR-6 (US-6.1) | Plan creation/edit/delete lifecycle, required field validation, plan visibility on the payments page plan selector. |
| `profile-management.e2e.spec.ts` | FR-8 (US-8.1) | Owner updates admin and staff credentials through the Profiles page. |

---

## Install

From repository root:

```bash
npm --prefix e2e install
npm --prefix e2e run playwright:install
```

---

## Required Environment Variables

Set these in `e2e/.env.test` before running tests. If `e2e/.env.test` is absent, the runner also falls back to `e2e/.env`:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL_TEST` | Yes | Test database connection string. Mapped to `DATABASE_URL` for backend reset and server processes. |
| `SEED_STAFF_PASSWORD` or `E2E_LOGIN_PASSWORD` | Yes | Staff login password used by E2E test fixtures. |

Optional variables:

| Variable | Default | Description |
|---|---|---|
| `E2E_LOGIN_USERNAME` | `staff` | Staff username for login. |
| `E2E_BASE_URL` | `http://127.0.0.1:5173` | Frontend base URL. |
| `E2E_FRONTEND_PORT` | `5173` | Frontend dev server port. |
| `E2E_BACKEND_PORT` | `5001` | Backend API server port. |
| `E2E_HEADLESS` | `true` | Run in headless mode (`true`/`false`). |
| `E2E_USE_EXISTING_BACKEND` | — | Set `true` to skip auto-starting the backend. |
| `E2E_USE_EXISTING_FRONTEND` | — | Set `true` to skip auto-starting the frontend. |

---

## Run Tests

From repository root:

```bash
npm --prefix e2e run test:e2e
```

Headless explicitly:

```bash
npm --prefix e2e run test:e2e:headless
```

Headed mode:

```bash
npm --prefix e2e run test:e2e:headed
```

UI mode:

```bash
npm --prefix e2e run test:e2e:ui
```

---

## What the Suite Does

1. **Server Management** — Starts backend and frontend automatically through Playwright `webServer` configuration.
2. **Database Reset** — Resets and reseeds the database before each test via the backend `db:reset:e2e` script, ensuring a clean, deterministic state.
3. **Authenticated Workflows** — Logs in as Staff or Owner (depending on the test) and executes feature workflows in a real Chromium browser.
4. **Failure Artifacts** — Captures screenshots, video recordings, and traces for failed tests to aid debugging.
