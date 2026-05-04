# Design Patterns — Introduction

> **Arrowhead Gym Management System · Backend Architecture**

## 1. Purpose of This Document Suite

This directory contains the authoritative, single-source-of-truth documentation for every **GoF (Gang of Four) design pattern** applied in the Arrowhead backend. Each document is structured identically so that any developer—new or experienced—can quickly locate:

1. **Why** a pattern was chosen (rooted in real business pain points from the SRS/URD).
2. **How** it is implemented (concrete file paths, classes, and interfaces).
3. **What trade-offs** were accepted (pragmatic decisions appropriate for a student project / small-business context).

> [!NOTE]
> These documents satisfy **NFR-4.1** of the SRS, which requires "sufficient documentation to allow a new developer to set up, run, and understand the core system architecture within 2 hours."

---

## 2. Why Design Patterns Matter for a Small Gym

The Arrowhead Gym Management System was conceived to transition a small fitness centre from **manual, paper-based record-keeping** to a **digital, data-driven platform**. The SRS (§1) identifies four critical vulnerabilities that design patterns directly mitigate:

| Business Pain Point (SRS §1) | Risk if Unsolved | Pattern(s) That Address It |
|---|---|---|
| **Data Vulnerability & Loss** — Paper records are prone to physical damage, loss, and human error. | Financial records could be destroyed by a single incident (fire, flood, misplacement). | **Singleton** (single DB connection), **Command** (atomic transactions) |
| **Inaccurate Tracking** — Human error in payments, expiration dates, and equipment status. | Members may be wrongly charged, expired members allowed entry, or financial reports misaligned. | **Command** (transactional payment + undo), **Factory Method** (normalized payloads) |
| **Operational Inefficiency** — Manual search through paper logs for member verification. | Long customer wait times at the front desk, violating the < 5-second SLA (NFR-1.1). | **Strategy** (payment validation), **Factory Method** (fast object creation) |
| **Lack of Business Intelligence** — No historical data for reporting or forecasting. | Owner cannot make data-driven decisions about staffing, pricing, or equipment purchases. | **Strategy** (revenue forecasting), **Observer** (real-time dashboard updates), **Factory Method** (report DTOs) |

---

## 3. Pattern Catalogue at a Glance

| # | Pattern | Classification | Primary Concern | Key File(s) |
|---|---|---|---|---|
| 01 | [Singleton](./01-Singleton-Pattern.md) | Creational | Database & configuration connection management | `src/lib/prisma.ts`, `src/config/ConfigManager.ts` |
| 02 | [Factory Method](./02-Factory-Method.md) | Creational | Standardized entity & report DTO creation | `src/patterns/factory-method/` |
| 03 | [Command](./03-Command-Pattern.md) | Behavioral | Atomic check-in logic & transactional "Undo Payment" | `src/patterns/command/` |
| 04 | [Strategy](./04-Strategy-Pattern.md) | Behavioral | Swappable payment validation & revenue forecasting algorithms | `src/patterns/strategy-pattern/`, `src/services/` |
| 05 | [Observer](./05-Observer-Pattern.md) | Behavioral | Decoupled side effects (SSE refresh, audit logs, cache invalidation) | `src/patterns/observer-pattern/` |

---

## 4. Architectural Principles

All five patterns are guided by the following SOLID principles, as mandated by NFR-4.2 (Maintainability):

- **Single Responsibility Principle (SRP):** Each class has one reason to change. Controllers handle HTTP; Commands handle business logic; Factories handle object construction; Observers handle side effects.
- **Open/Closed Principle (OCP):** The system is open for extension but closed for modification. New payment methods, report types, or forecast algorithms are added by creating new classes—not by modifying existing ones.
- **Dependency Inversion Principle (DIP):** High-level modules (controllers, services) depend on abstractions (`ICommand`, `IFactory`, `Observer<T>`, `IForecastStrategy`), not on concrete implementations.

---

## 5. How to Read These Documents

Each pattern document follows a **standardized six-section template**:

1. **Pattern Name & Classification** — GoF category (Creational, Behavioral, Structural).
2. **Business Context (The "Why")** — The specific SRS/URD pain point that justifies the pattern.
3. **Implementation Details (The "How")** — File paths, classes, and interfaces involved.
4. **Visual Architecture** — A Mermaid.js class/sequence diagram.
5. **Code Traceability** — A concise, representative code snippet taken directly from the codebase.
6. **Trade-offs & Rationale** — Why this pattern is appropriate for a student project / small-business context, and what alternatives were considered.

---

## 6. SRS & URD Traceability Matrix

| SRS Requirement | Related User Story (URD) | Pattern(s) Applied |
|---|---|---|
| FR-2.1, FR-2.2 (Payment Processing & Validity Logic) | US-2.1 (Log Membership Payment) | Command, Factory Method, Strategy, Observer |
| FR-2.3 (Payment History) | US-2.2 (Viewing Payment History) | Factory Method |
| US-2.3 (Undo Payment) | US-2.3 (Undo Payment History) | Command |
| FR-5.1 (Real-time Revenue Summary) | US-5.1 (Real-time Operational Revenue Summary) | Strategy (Revenue Calculation) |
| FR-5.2 (Short-term Expiry Monitoring) | US-5.2 (Immediate Desk Renewal Alerts) | Factory Method, Observer |
| FR-5.3 (At-Risk Analysis) | US-5.3 (Predictive Churn & At-Risk Identification) | Factory Method, Observer |
| FR-5.4 (Multi-Strategy Revenue Forecasting) | US-5.4 (Strategic Revenue Forecasting) | Strategy (Revenue Forecast) |
| FR-5.5 (Peak Utilization Analytics) | US-5.5 (Peak Hour & Utilization Insights) | Factory Method |
| FR-7.1–FR-7.3 (Member Attendance) | US-7.1 (Log Member Check-in) | Command, Observer |
| NFR-2.1 (Atomic Transactions / ACID) | US-10.1 (Transactional Atomicity) | Command |
| NFR-4.1 (Documentation & Maintainability) | US-11.1 (System Documentation and Onboarding) | All patterns (this document suite) |
