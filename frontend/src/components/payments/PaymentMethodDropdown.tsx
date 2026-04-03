import type { PaymentMethod } from '../../types/payment';

const DEFAULT_METHODS: PaymentMethod[] = ['CASH', 'GCASH'];

interface PaymentMethodDropdownProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
  methods?: PaymentMethod[];
}

export default function PaymentMethodDropdown({
  value,
  onChange,
  disabled = false,
  methods = DEFAULT_METHODS,
}: PaymentMethodDropdownProps) {
  return (
    <div>
      <label htmlFor="paymentMethod" className="mb-1.5 block text-sm font-semibold text-primary">
        Select Payment Method
      </label>
      <select
        id="paymentMethod"
        value={value}
        onChange={(event) => onChange(event.target.value as PaymentMethod)}
        disabled={disabled}
        className="
          w-full rounded-md border border-neutral-300 bg-white px-4 py-3
          text-sm text-secondary transition-all duration-200
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25
          disabled:cursor-not-allowed disabled:bg-neutral-100
        "
      >
        {methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
    </div>
  );
}
