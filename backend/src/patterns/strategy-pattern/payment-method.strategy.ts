import { PaymentMethod } from '@prisma/client';

export type PaymentValidationPayload = {
  amount: number;
  referenceNumber?: string;
};

export interface PaymentProcessingStrategy {
  readonly method: PaymentMethod;
  validate(payload: PaymentValidationPayload): void;
}

class CashPaymentStrategy implements PaymentProcessingStrategy {
  readonly method = PaymentMethod.CASH;

  validate(payload: PaymentValidationPayload): void {
    const { amount } = payload;

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount paid must be a positive number');
    }
  }
}

class GCashPaymentStrategy implements PaymentProcessingStrategy {
  readonly method = PaymentMethod.GCASH;

  validate(payload: PaymentValidationPayload): void {
    const { amount, referenceNumber } = payload;

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount paid must be a positive number');
    }

    if (!referenceNumber || referenceNumber.trim().length < 8) {
      throw new Error('GCash reference number must be at least 8 characters');
    }
  }
}

const strategies: PaymentProcessingStrategy[] = [new CashPaymentStrategy(), new GCashPaymentStrategy()];

export class PaymentProcessingContext {
  private readonly strategy: PaymentProcessingStrategy | null;

  constructor(strategy: PaymentProcessingStrategy | null) {
    this.strategy = strategy;
  }

  isSupportedMethod(): boolean {
    return this.strategy !== null;
  }

  getMethod(): PaymentMethod {
    if (!this.strategy) {
      throw new Error('Invalid payment method');
    }

    return this.strategy.method;
  }

  validate(payload: PaymentValidationPayload): void {
    if (!this.strategy) {
      throw new Error('Invalid payment method');
    }

    this.strategy.validate(payload);
  }
}

/**
 * Returns a payment processing context for the provided payment method.
 */
export function getPaymentContext(
  paymentMethod: unknown,
): PaymentProcessingContext {
  if (typeof paymentMethod !== 'string') {
    return new PaymentProcessingContext(null);
  }

  return new PaymentProcessingContext(
    strategies.find((strategy) => strategy.method === paymentMethod) ?? null,
  );
}

export { CashPaymentStrategy, GCashPaymentStrategy };
