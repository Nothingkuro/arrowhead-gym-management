import type { Meta, StoryObj } from '@storybook/react-vite';
import ProfileInfoRow from '../../components/members/ProfileInfoRow';
import StatusBadge from '../../components/members/StatusBadge';

const meta = {
  title: 'App/Members/Profile Info Row',
  component: ProfileInfoRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div className="w-105 rounded-lg border border-neutral-300 bg-surface-alt px-6 py-4">
      <ProfileInfoRow {...args} />
    </div>
  ),
} satisfies Meta<typeof ProfileInfoRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextValue: Story = {
  args: {
    label: 'Contact Number',
    value: '09171234567',
  },
};

export const DateValue: Story = {
  args: {
    label: 'Join Date',
    value: 'January 1, 2023',
  },
};

export const StatusValue: Story = {
  args: {
    label: 'Status',
    value: <StatusBadge status="ACTIVE" className="text-sm sm:text-base" />,
  },
};
