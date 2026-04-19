import { PaymentMethod } from '@prisma/client';

export type PaymentMethodBreakdown = {
  cash: number;
  gcash: number;
};

export interface PaymentMethodStrategy {
  readonly method: PaymentMethod;
  validate(amount: number): void;
  applyRevenue(amount: number, current: PaymentMethodBreakdown): PaymentMethodBreakdown;
}

class CashPaymentStrategy implements PaymentMethodStrategy {
  readonly method = PaymentMethod.CASH;

  validate(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount paid must be a positive number');
    }
  }

  applyRevenue(amount: number, current: PaymentMethodBreakdown): PaymentMethodBreakdown {
    return {
      ...current,
      cash: current.cash + amount,
    };
  }
}

class GCashPaymentStrategy implements PaymentMethodStrategy {
  readonly method = PaymentMethod.GCASH;

  validate(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount paid must be a positive number');
    }
  }

  applyRevenue(amount: number, current: PaymentMethodBreakdown): PaymentMethodBreakdown {
    return {
      ...current,
      gcash: current.gcash + amount,
    };
  }
}

const strategies: PaymentMethodStrategy[] = [new CashPaymentStrategy(), new GCashPaymentStrategy()];

/**
 * Resolves behavior for a given payment method.
 */
export function resolvePaymentMethodStrategy(
  paymentMethod: unknown,
): PaymentMethodStrategy | null {
  if (typeof paymentMethod !== 'string') {
    return null;
  }

  return strategies.find((strategy) => strategy.method === paymentMethod) ?? null;
}

export function createEmptyPaymentMethodBreakdown(): PaymentMethodBreakdown {
  return { cash: 0, gcash: 0 };
}
