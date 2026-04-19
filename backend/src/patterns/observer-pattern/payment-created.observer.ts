export type PaymentCreatedEvent = {
  paymentId: string;
  memberId: string;
  planId: string;
  amount: number;
  paymentMethod: string;
  processedById: string;
  happenedAt: string;
};

interface Observer<TEvent> {
  update(event: TEvent): Promise<void> | void;
}

class Subject<TEvent> {
  private observers = new Set<Observer<TEvent>>();

  subscribe(observer: Observer<TEvent>): void {
    this.observers.add(observer);
  }

  async notify(event: TEvent): Promise<void> {
    for (const observer of this.observers) {
      try {
        await observer.update(event);
      } catch (error) {
        console.error('Observer execution failed:', error);
      }
    }
  }
}

class PaymentAuditLogObserver implements Observer<PaymentCreatedEvent> {
  update(event: PaymentCreatedEvent): void {
    console.info('[payment-created]', JSON.stringify(event));
  }
}

const paymentCreatedSubject = new Subject<PaymentCreatedEvent>();
paymentCreatedSubject.subscribe(new PaymentAuditLogObserver());

export async function notifyPaymentCreated(event: PaymentCreatedEvent): Promise<void> {
  await paymentCreatedSubject.notify(event);
}
