import { Observer, Subject } from './base.observer';
import { globalNotificationSubject } from './notification.subject';

export type PaymentCreatedEvent = {
  paymentId: string;
  memberId: string;
  planId: string;
  amount: number;
  paymentMethod: string;
  processedById: string;
  happenedAt: string;
};

class PaymentAuditLogObserver implements Observer<PaymentCreatedEvent> {
  async update(event: PaymentCreatedEvent): Promise<void> {
    console.info('[payment-created]', JSON.stringify(event));
    await globalNotificationSubject.notifyAll();
  }
}

const paymentCreatedSubject = new Subject<PaymentCreatedEvent>();
paymentCreatedSubject.subscribe(new PaymentAuditLogObserver());

export async function notifyPaymentCreated(event: PaymentCreatedEvent): Promise<void> {
  await paymentCreatedSubject.notify(event);
}
