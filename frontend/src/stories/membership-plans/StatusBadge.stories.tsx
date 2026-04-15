import type { Meta, StoryObj } from '@storybook/react-vite';
import StatusBadge from '../../components/membership-plans/StatusBadge';
import { storyMembershipPlanConfigStatusLabels } from '../mocks/mockMembershipPlanConfig';

const meta = {
  title: 'App/Membership Plans/Status Badge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: {
    activeLabel: storyMembershipPlanConfigStatusLabels.activeLabel,
    archivedLabel: storyMembershipPlanConfigStatusLabels.archivedLabel,
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isActive: true,
  },
};

export const Archived: Story = {
  args: {
    isActive: false,
  },
};
