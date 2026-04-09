import type { Meta, StoryObj } from '@storybook/react-vite';
import StatusBadge from '../../components/members/StatusBadge';

const meta = {
  title: 'App/Members/Status Badge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveText: Story = {
  args: {
    status: 'ACTIVE',
    variant: 'text',
  },
};

export const ExpiredText: Story = {
  args: {
    status: 'EXPIRED',
    variant: 'text',
  },
};

export const InactiveText: Story = {
  args: {
    status: 'INACTIVE',
    variant: 'text',
  },
};

export const PillVariant: Story = {
  args: {
    status: 'ACTIVE',
    variant: 'pill',
  },
};
