# Frontend — Arrowhead Gym Management System

React dashboard built with Vite and Tailwind CSS. This package contains all UI components, page-level containers, API services, TypeScript types, and Storybook stories.

---

## Local Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

---

## Environment Variables

Copy `.env.example` to `.env` and provide the following value.

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL consumed by the API service layer (e.g., `http://localhost:5001`) |

---

## Mobile-First Design

The interface is designed mobile-first, ensuring full usability on screens down to **375px** width (NFR-1.3). This prioritizes the Staff role's primary use case: operating at the gym counter on a tablet or smartphone during peak hours.

Key responsive behaviors:

- **Sidebar Navigation** — Collapses into a hamburger menu on viewports under 768px (US-8.2).
- **Data Tables** — Switch to card-based layouts on narrow screens to maintain readability.
- **Action Controls** — Touch-optimized tap targets and spacing for gym floor operations.

---

## State Management & Session Handling

User sessions and inactivity detection are managed globally through the `InactivityTimeout` component, which wraps all authenticated routes via `MainLayout`:

1. **Activity Tracking:** The component intercepts DOM events (`mousemove`, `mousedown`, `keydown`, `touchstart`, `scroll`) and successful `fetch` calls to record the last activity timestamp.
2. **Token Refresh:** Every 60 seconds, if the user has been active within the last interval, the component calls `POST /api/auth/refresh` to extend the JWT session.
3. **Auto-Logout:** After **5 minutes** of continuous inactivity (US-9.2), the component automatically calls `POST /api/auth/logout` and redirects to the login page.
4. **Role State:** The authenticated user's role is stored in `sessionStorage` on login and used to conditionally render Admin-only sidebar links (Reports, Membership Plans, Profiles) and guard route access via `ProtectedRoute`.

> **Rationale:** This client-side timeout mechanism complements the server-side JWT expiry, ensuring unattended workstations are secured even if the server token has not yet expired.

---

## Testing Strategy — Storybook

[Storybook](https://storybook.js.org/) is used to isolate and visually verify UI components and full pages before integration into the live application. Stories are organized by domain under `src/stories/`:

| Story Category | Coverage |
|---|---|
| `pages/` | Full-page compositions (Members, Payments, Reports, Equipment, Suppliers, Profiles, Login, Membership Plans) with `play` functions exercising user flows. |
| `reports/` | Individual report widgets (Daily Revenue, Monthly Revenue, At-Risk Members, Expiry Alerts, Low Inventory Alerts, Analytics Charts). |
| `payments/` | Payment form elements (Member Search, Plan Table, Payment Method Dropdown, Submit Button). |
| `suppliers/` | Supplier Table and Transaction List components. |
| `modals/` | CRUD modals (Edit Member, Edit Equipment, Supplier Form, Delete Confirmation, Transaction Form, Add Equipment). |
| `common/` | Shared primitives (search controls, filter dropdowns). |
| `membership-plans/` | Plan management grid and form components. |

Stories include interaction tests (via `@storybook/test`) that simulate real user flows — typing into forms, selecting dropdowns, and asserting rendered output. This provides a rapid feedback loop for component-level regressions without requiring a running backend.

**Run Storybook:**

```bash
npm run storybook
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the production bundle |
| `npm run lint` | Run ESLint checks |
| `npm run preview` | Preview the production build locally |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build the static Storybook output |

---

## Folder Conventions

Use the following convention when deciding where new code belongs.

| Directory | Convention |
|---|---|
| `src/pages/` | Route-level composition only. Pages orchestrate data fetching and assemble domain components. |
| `src/components/layout/` | Shared app chrome: `MainLayout`, `Sidebar`, `Header`, and inactivity timeout wrapper. |
| `src/components/common/` | Generic, reusable UI primitives: search/filter controls, modals, action groups. |
| `src/components/<domain>/` | Domain-specific components for members, payments, plans, reports, suppliers, and equipment. |
| `src/services/` | API communication layer. Keep all `fetch` calls here; never call `fetch` in presentational components. |
| `src/types/` | Shared TypeScript contracts for domain models (Member, Payment, Report, etc.). |
| `src/hooks/` | Reserved for custom React hooks. |
| `src/layouts/` | Reserved for future layout abstractions. |
| `src/stories/` | Storybook stories and mock fixtures for isolated component/page previews. |

---

## Adding a New Page

1. Create the page component in `src/pages/` (e.g., `src/pages/StaffPage.tsx`).
2. Export it through `src/pages/index.ts`.
3. Import the page in `src/App.tsx` via the existing barrel import.
4. Add a `<Route>` entry in `src/App.tsx` using the `ProtectedRoute` + `MainLayout` shell pattern.
5. Add a navigation entry in `src/components/layout/Sidebar.tsx` if sidebar access is required.

---

## Service Layer Pattern

All backend calls live in `src/services/`. Domain-specific API modules (e.g., `membershipPlanApi.ts`) expose typed async functions. Pages/components import and call these functions; they never call `fetch` directly.

```ts
// Usage in a page or component
import { listMembershipPlans } from '../services/membershipPlanApi';

const plans = await listMembershipPlans();
```

---

## Documentation

- [Architecture Reference](../docs/technical/01-architecture.md)
- [API Reference](../docs/technical/03-api-reference.md)
- [Developer Onboarding](../docs/guides/onboarding.md)
- [Root Project Guide](../README.md)
