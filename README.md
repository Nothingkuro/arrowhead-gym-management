# Arrowhead Gym Management System

[![Backend & E2E Tests](https://github.com/Nothingkuro/final-project-2ndyr/actions/workflows/test.yaml/badge.svg)](https://github.com/Nothingkuro/final-project-2ndyr/actions/workflows/test.yaml)

---

## Overview

**Arrowhead Gym Management System** is a web-based platform that digitizes the daily operations of a small gym previously reliant on paper-based record-keeping. The system provides a centralized, role-aware digital interface for membership management, payment processing, attendance tracking, equipment inventory, and supplier procurement — replacing manual workflows that were prone to data loss, human error, and slow reporting.

The platform enforces a **two-role access model** with clearly defined boundaries:

| Role | Scope | Key Capabilities |
|---|---|---|
| **Staff (Employee/Cashier)** | Day-to-day operational data entry | Register members, log payments, record check-ins, update equipment condition. Cannot access financial reports or delete financial records. |
| **Admin (Owner)** | Full system oversight, configuration, and analytics | All Staff capabilities plus: view financial and analytics reports, manage membership plans, configure inventory thresholds, manage staff/admin credentials (FR-8.1), and access supplier transaction logging. |

> **Rationale — Two-user constraint:** Per SRS §7.2, the system maintains exactly two user records (one ADMIN, one STAFF). The Owner manages both sets of credentials through the Profiles page.

All data is persisted in a cloud-hosted PostgreSQL database (NeonDB) with Point-in-Time Recovery, ensuring operational continuity and a maximum 6-hour data loss window.

---

## Key Features

- **Member Registry** — Register, search, filter, and manage gym members with real-time status tracking (`ACTIVE`, `EXPIRED`, `INACTIVE`). Search returns results in under 500ms (NFR-1.2).
- **Payment Processing** — Record membership payments linked to configurable plans; atomically renews member expiry on each transaction (NFR-2.1). Supports a 5-second undo grace period (US-2.3).
- **Attendance Tracking** — Log member check-ins with timestamps; enforce active-status validation (FR-7.2). Check-ins are undoable within a 5-second window.
- **Equipment Inventory** — Track gym equipment stock and condition (`GOOD`, `NEEDS_REPAIR`, `OUT_OF_ORDER`) with configurable low-inventory threshold alerts (FR-5.7, default: 5 units).
- **Supplier Management** — Maintain a supplier directory and log itemized procurement transactions (FR-4).
- **Advanced Analytics (Admin)** — Predictive member retention analysis flags "At-Risk" members (expiry ≤ 14 days AND no check-in in 10 days, FR-5.3). Multi-strategy revenue forecasting provides Conservative and Optimistic projections (FR-5.4). Peak-hour utilization charts visualize traffic density by hour and membership plan type (FR-5.5).
- **Operational Reports (Admin)** — Real-time daily revenue summary by payment method (FR-5.1), short-term membership expiry monitoring within 3 days (FR-5.2), and historical monthly revenue reporting (FR-5.6).
- **Membership Plan Configuration (Admin)** — Plan catalogue controlling name, fixed price, and duration in days (FR-6).
- **Profile Management (Admin)** — Owner manages both admin and staff credentials through a dedicated Profiles page (FR-8.1).

---

## Architecture Overview

The system follows a layered client–server architecture with a clear separation of concerns:

| Layer | Role |
|---|---|
| **Frontend (React SPA)** | Responsive dashboard with mobile-first design (≥ 375px). Handles session management and inactivity timeout. |
| **Backend (Express API)** | Centralized business logic, RBAC enforcement, and data consistency through Prisma transactions. |
| **Database (NeonDB PostgreSQL)** | Cloud-hosted with SSL/TLS, connection pooling, and PITR-enabled backups. |

### Design Patterns

The backend employs several GoF design patterns to satisfy the Maintainability NFR (NFR-4):

| Pattern | Application |
|---|---|
| **Command** | Encapsulates payment processing and check-in operations as reversible, transactional commands (`execute`/`undo`). Enables the 5-second undo grace period. |
| **Strategy** | Payment method validation (Cash vs. GCash) and multi-mode revenue forecasting (Conservative vs. Optimistic) are implemented as interchangeable strategy families. |
| **Observer** | Server-Sent Events (SSE) push real-time notification signals to connected clients when member, payment, or attendance state changes. |
| **Factory Method** | Standardizes creation of Payment records and typed Report DTOs across multiple report categories. |
| **Singleton** | Prisma client and ConfigManager are instantiated once and shared across the application lifecycle. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router, TypeScript |
| **Backend** | Node.js, Express, TypeScript (strict mode) |
| **ORM** | Prisma ORM (adapter-based client) |
| **Database** | PostgreSQL via NeonDB (serverless, PITR-enabled) |
| **Testing** | Jest (unit/integration), Playwright (E2E), Storybook (component isolation) |
| **CI/CD** | GitHub Actions (3-job pipeline: unit → integration → E2E) |

> **Rationale — Why NeonDB?** Neon's native PITR ("History") feature provides a 6-hour recovery window on the free tier without additional infrastructure cost, satisfying NFR-4.2.

---

## Quick Start

### 1. Install all workspace dependencies

```bash
npm install
```

### 2. Configure environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp e2e/.env.example e2e/.env.test
```

Fill in `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, and seed passwords in `backend/.env`. Set `VITE_API_BASE_URL=http://localhost:5001` in `frontend/.env`.

### 3. Prepare the database

```bash
npm --prefix backend run db:generate
npm --prefix backend run db:seed
```

### 4. Start the application

```bash
npm run dev
```

Frontend: `http://localhost:5173` · Backend: `http://localhost:5001`

> **First time?** See the full [Developer Onboarding Guide](docs/guides/onboarding.md) for the complete Day 1 Verification Checklist and environment variable reference.

---

## Repository Layout

```text
final-project-2ndyr/
├── backend/        Express API, Prisma schema, migrations, and test suites
├── frontend/       React dashboard, UI components, Storybook stories
├── e2e/            Playwright browser tests and database reset helpers
├── docs/           Project documentation (see Documentation Map below)
└── .github/        GitHub Actions CI/CD workflow definitions
```

---

## Documentation Map

### Business

| Document | Description |
|---|---|
| [Requirements Elicitation](docs/business/01-requirements.md) | Stakeholder analysis, in-scope/out-of-scope problems, functional and non-functional requirements |
| [Software Requirements Specification (SRS)](docs/business/02-srs.md) | Formal user stories with acceptance criteria for all system features |

### Technical

| Document | Description |
|---|---|
| [Architecture Reference](docs/technical/01-architecture.md) | System diagrams, tech stack rationale, module responsibilities, and request lifecycle |
| [Database Schema](docs/technical/02-database.md) | Full Prisma model definitions, ER diagram, and NeonDB backup/recovery strategy |
| [API Reference](docs/technical/03-api-reference.md) | All REST endpoints with methods, auth requirements, request/response shapes |

### Guides

| Document | Description |
|---|---|
| [Developer Onboarding](docs/guides/onboarding.md) | Day 1 checklist, env variable reference, troubleshooting, and suggested starter tasks |
| [Testing Strategy](docs/guides/testing.md) | Jest unit/integration test patterns, Playwright E2E conventions, CI/CD pipeline details |

### Package Guides

| Document | Description |
|---|---|
| [Backend Package](backend/README.md) | Local setup commands, available scripts, and backend-specific conventions |
| [Frontend Package](frontend/README.md) | Local setup commands, folder conventions, and frontend-specific scripts |
| [E2E Package](e2e/README.md) | E2E environment variables, run commands, and test suite behavior |

---

## Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start backend and frontend in parallel |
| `npm run build` | Build backend and frontend |
| `npm run test:e2e` | Run the full Playwright E2E suite |
| `npm --prefix backend run test` | Run all Jest tests (unit + integration) |
| `npm --prefix backend run test:unit` | Run unit tests only |
| `npm --prefix frontend run storybook` | Start Storybook component explorer |
