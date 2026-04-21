import type { Meta, StoryObj } from '@storybook/react-vite';
import DashboardChartsSection from '../../components/reports/DashboardChartsSection';
import {
  storyMembershipDistribution,
  storyRevenueTrends,
} from '../mocks/mockReports';

const meta = {
  title: 'App/Reports/Dashboard Charts Section',
  component: DashboardChartsSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div className="w-[98vw] max-w-6xl rounded-2xl bg-surface-alt p-4 sm:p-6">
      <DashboardChartsSection {...args} />
    </div>
  ),
} satisfies Meta<typeof DashboardChartsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    revenueTrends: storyRevenueTrends,
    membershipDistribution: storyMembershipDistribution,
  },
};

export const ZeroMembershipDistribution: Story = {
  args: {
    revenueTrends: storyRevenueTrends,
    membershipDistribution: [
      { plan: 'Daily Pass', memberCount: 0, percentage: 0 },
      { plan: 'Monthly Basic', memberCount: 0, percentage: 0 },
      { plan: 'Quarterly Plus', memberCount: 0, percentage: 0 },
    ],
  },
};

export const PeakFridayRevenue: Story = {
  args: {
    revenueTrends: [
      { day: 'Monday', revenue: 8200 },
      { day: 'Tuesday', revenue: 9100 },
      { day: 'Wednesday', revenue: 9800 },
      { day: 'Thursday', revenue: 10400 },
      { day: 'Friday', revenue: 16800 },
      { day: 'Saturday', revenue: 14200 },
      { day: 'Sunday', revenue: 12100 },
    ],
    membershipDistribution: storyMembershipDistribution,
  },
};
