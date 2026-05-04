# 05 — Observer Pattern

> **Classification:** Behavioral
> **Scope:** Decoupled side effects — real-time SSE notifications, audit logging, and analytics cache invalidation

---

## 1. Business Context (The "Why")

The SRS mandates several **reactive behaviours** that must fire automatically when core business events occur, without coupling the primary operation to the secondary effects:

### 1.1 Real-Time Dashboard Updates (FR-5.1, FR-5.2, US-5.1, US-5.2)

> *"The system shall generate an on-demand dashboard showing total revenue collected…"*
> *"A 'Short-term Expirations' widget is prominently displayed on the main dashboard."*

When a payment is processed, a member checks in, or a member profile is updated, the dashboard must reflect these changes **in real time** via Server-Sent Events (SSE). Without the Observer pattern, the payment/check-in logic would need to directly call the SSE notification service — creating tight coupling between business logic and presentation infrastructure.

### 1.2 At-Risk Member Cache Refresh (FR-5.3 / US-5.3)

> *"A member is classified as At-Risk if their subscription expires within 14 days AND they have no recorded attendance check-ins within the last 10 days."*

Every check-in event potentially changes a member's risk classification. The analytics service maintains a transient cache of at-risk members that must be **invalidated and recalculated** after each attendance event. Embedding this cache management inside the check-in command would violate SRP.

### 1.3 Audit Trail (Implicit in NFR-2.1, NFR-3)

Financial transactions and attendance events should produce an **audit log** for accountability. The Observer pattern allows audit logging to be attached as a side effect without modifying any business logic.

---

## 2. Implementation Details (The "How")

### 2.1 Core Framework

| File | Class / Interface | Role |
|---|---|---|
| `backend/src/patterns/observer-pattern/base.observer.ts` | `Observer<TEvent>` | Generic interface — `update(event: TEvent): Promise<void> \| void` |
| — | `IBaseObserver<TEvent>` | Extends `Observer<TEvent>` (marker interface for project conventions) |
| — | `Subject<TEvent>` | Manages a `Set<Observer>`, exposes `attach()`, `detach()`, `subscribe()`, `unsubscribe()`, and `notify()` |

### 2.2 Event Channels

| File | Subject | Event Type | Concrete Observers |
|---|---|---|---|
| `attendance-logged.observer.ts` | `attendanceLoggedSubject` | `AttendanceLoggedEvent` | `AttendanceAuditLogObserver`, `AttendanceSseRefreshObserver`, `RiskAnalysisObserver` |
| `payment-created.observer.ts` | `paymentCreatedSubject` | `PaymentCreatedEvent` | `PaymentAuditLogObserver`, `PaymentSseRefreshObserver` |
| `member-changed.observer.ts` | `memberChangedSubject` | `MemberChangedEvent` | `MemberSseRefreshObserver` |

### 2.3 SSE Infrastructure

| File | Class | Role |
|---|---|---|
| `backend/src/patterns/observer-pattern/notification.subject.ts` | `NotificationSubject` | Manages SSE client connections; broadcasts `REFRESH_NOTIFICATIONS` signals |
| — | `globalNotificationSubject` | Module-level singleton instance used by all SSE refresh observers |

### 2.4 Bootstrap

| File | Function | Role |
|---|---|---|
| `backend/src/patterns/observer-pattern/observer.bootstrap.ts` | `bootstrapObserverPattern()` | Registers all concrete observers to their respective subjects at application startup. Idempotent — guarded by a boolean flag. |

---

## 3. Visual Architecture

```mermaid
classDiagram
    class Observer~TEvent~ {
        <<interface>>
        +update(event: TEvent): Promise~void~ | void
    }

    class Subject~TEvent~ {
        -observers: Set~Observer~TEvent~~
        +attach(observer): void
        +detach(observer): void
        +notify(event): Promise~void~
    }

    class AttendanceAuditLogObserver {
        +update(event: AttendanceLoggedEvent): void
    }
    class AttendanceSseRefreshObserver {
        +update(): Promise~void~
    }
    class RiskAnalysisObserver {
        +update(): Promise~void~
    }

    class PaymentAuditLogObserver {
        +update(event: PaymentCreatedEvent): Promise~void~
    }
    class PaymentSseRefreshObserver {
        +update(): Promise~void~
    }

    class MemberSseRefreshObserver {
        +update(): Promise~void~
    }

    class NotificationSubject {
        -clients: Map~string, Response~
        +subscribeClient(id, res): void
        +notifyAll(): Promise~void~
    }

    class CheckInCommand ["CheckInCommand (Publisher)"]
    class PaymentController ["PaymentController (Publisher)"]
    class MemberController ["MemberController (Publisher)"]

    Observer <|.. AttendanceAuditLogObserver
    Observer <|.. AttendanceSseRefreshObserver
    Observer <|.. RiskAnalysisObserver
    Observer <|.. PaymentAuditLogObserver
    Observer <|.. PaymentSseRefreshObserver
    Observer <|.. MemberSseRefreshObserver

    Subject --> Observer : notifies

    AttendanceSseRefreshObserver --> NotificationSubject : notifyAll()
    PaymentSseRefreshObserver --> NotificationSubject : notifyAll()
    MemberSseRefreshObserver --> NotificationSubject : notifyAll()
    RiskAnalysisObserver --> "analyticsService" : refreshAtRiskMembersCache()

    CheckInCommand ..> Subject : notifyAttendanceLogged()
    PaymentController ..> Subject : notifyPaymentCreated()
    MemberController ..> Subject : notifyMemberChanged()
```

---

## 4. Code Traceability

### Observer Interface & Subject

```typescript
// backend/src/patterns/observer-pattern/base.observer.ts
export interface Observer<TEvent> {
  update(event: TEvent): Promise<void> | void;
}

export class Subject<TEvent> {
  private observers = new Set<Observer<TEvent>>();

  attach(observer: Observer<TEvent>): void {
    this.observers.add(observer);
  }

  async notify(event: TEvent): Promise<void> {
    const results = await Promise.allSettled(
      Array.from(this.observers, (observer) => Promise.resolve(observer.update(event))),
    );
    results.forEach((result) => {
      if (result.status === 'rejected') {
        console.error('Observer execution failed:', result.reason);
      }
    });
  }
}
```

### Concrete Observers — Attendance Channel

```typescript
// backend/src/patterns/observer-pattern/attendance-logged.observer.ts (excerpt)
export class AttendanceAuditLogObserver implements IBaseObserver<AttendanceLoggedEvent> {
  update(event: AttendanceLoggedEvent): void {
    console.info('[attendance-logged]', JSON.stringify(event));
  }
}

export class AttendanceSseRefreshObserver implements IBaseObserver<AttendanceLoggedEvent> {
  async update(): Promise<void> {
    await globalNotificationSubject.notifyAll();
  }
}

export class RiskAnalysisObserver implements IBaseObserver<AttendanceLoggedEvent> {
  async update(): Promise<void> {
    await analyticsService.refreshAtRiskMembersCache();
  }
}
```

### Registration & Notification

```typescript
// Registration (called once at startup via observer.bootstrap.ts)
const attendanceLoggedSubject = new Subject<AttendanceLoggedEvent>();
attendanceLoggedSubject.attach(new AttendanceAuditLogObserver());
attendanceLoggedSubject.attach(new AttendanceSseRefreshObserver());
attendanceLoggedSubject.attach(new RiskAnalysisObserver());

// Notification (called from CheckInCommand.execute())
export async function notifyAttendanceLogged(event: AttendanceLoggedEvent): Promise<void> {
  await attendanceLoggedSubject.notify(event);
}
```

### SSE Notification Subject

```typescript
// backend/src/patterns/observer-pattern/notification.subject.ts (excerpt)
export class NotificationSubject {
  private clients = new Map<string, Response>();

  subscribeClient(id: string, res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    this.clients.set(id, res);
    res.flushHeaders();
    res.write(': connected\n\n');
    res.on('close', () => { this.clients.delete(id); });
  }

  async notifyAll(): Promise<void> {
    const payload = { type: 'REFRESH_NOTIFICATIONS', timestamp: new Date().toISOString() };
    const message = `data: ${JSON.stringify(payload)}\n\n`;
    for (const [id, client] of this.clients) {
      if (client.writableEnded) { this.clients.delete(id); continue; }
      try { client.write(message); }
      catch { this.clients.delete(id); }
    }
  }
}

export const globalNotificationSubject = new NotificationSubject();
```

---

## 5. Trade-offs & Rationale

| Consideration | Decision | Justification |
|---|---|---|
| **`Promise.allSettled` vs. `Promise.all`** | `notify()` uses `Promise.allSettled`. | If one observer throws (e.g., SSE client disconnected), other observers still execute. With `Promise.all`, a single failure would abort all remaining side effects — including audit logging. |
| **Idempotent bootstrap** | `bootstrapObserverPattern()` is guarded by a boolean flag. | Prevents duplicate observer registration if the bootstrap module is imported multiple times (e.g., during testing or server restart). |
| **Module-scoped Subjects** | Each event channel (attendance, payment, member) has its own module-scoped `Subject` instance. | This avoids a monolithic event bus while keeping each event channel's observers co-located with their type definitions. |
| **SSE `NotificationSubject`** | A specialized Subject that manages `Express.Response` objects for Server-Sent Events. | The `NotificationSubject` is not a generic `Subject<TEvent>` because SSE clients require HTTP-specific lifecycle management (`flushHeaders`, `on('close')`, `writableEnded` checks). |
| **No event bus library** | Built from scratch rather than using EventEmitter or a third-party pub/sub library. | The custom `Subject<TEvent>` is ~30 lines of code, fully typed, and has no external dependencies. For three event channels with 2–3 observers each, an event bus library would be over-engineering. |
| **Why not WebSockets?** | SSE (one-way server → client) instead of WebSockets (bidirectional). | The dashboard only needs server-push notifications. SSE is simpler, natively supported by browsers, and auto-reconnects — making it the right tool for a read-only notification stream. |

> [!TIP]
> **OCP in action:** To add a new side effect (e.g., sending an email notification when a member's subscription is about to expire), a developer creates a new class implementing `Observer<MemberChangedEvent>`, attaches it in the bootstrap function, and is done — the `MemberController` and `Subject` code remain completely untouched.
