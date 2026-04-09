import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import SubmitPaymentButton from '../../components/payments/SubmitPaymentButton';

const meta = {
  title: 'App/Payments/Submit Payment Button',
  component: SubmitPaymentButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
    label: 'Submit',
  },
} satisfies Meta<typeof SubmitPaymentButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HappyEnabled: Story = {
  args: {
    disabled: false,
  },
};

export const SadDisabled: Story = {
  args: {
    disabled: true,
  },
};
