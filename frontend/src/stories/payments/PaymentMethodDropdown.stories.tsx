import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import PaymentMethodDropdown from '../../components/payments/PaymentMethodDropdown';

const meta = {
  title: 'App/Payments/Payment Method Dropdown',
  component: PaymentMethodDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PaymentMethodDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaymentMethodDropdownPlayground(args: ComponentProps<typeof PaymentMethodDropdown>) {
  const [value, setValue] = useState(args.value);

  return (
    <div className="w-80">
      <PaymentMethodDropdown {...args} value={value} onChange={setValue} />
    </div>
  );
}

export const HappyDefault: Story = {
  args: {
    value: 'CASH',
    onChange: () => {},
  },
  render: (args) => <PaymentMethodDropdownPlayground {...args} />,
};

export const SadDisabled: Story = {
  args: {
    value: 'GCASH',
    onChange: () => {},
    disabled: true,
  },
  render: (args) => <PaymentMethodDropdownPlayground {...args} />,
};
