import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import MembershipPlanTableRow from '../../components/membership-plans/MembershipPlanTableRow';
import { storyMembershipPlanConfigPlans } from '../mocks/mockMembershipPlanConfig';

const meta = {
  title: 'App/Membership Plans/Membership Plan Table Row',
  component: MembershipPlanTableRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div className="max-w-4xl overflow-hidden rounded-lg border border-neutral-300 bg-surface">
      <table className="w-full border-collapse">
        <tbody>
          <MembershipPlanTableRow {...args} />
        </tbody>
      </table>
    </div>
  ),
} satisfies Meta<typeof MembershipPlanTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    plan: storyMembershipPlanConfigPlans[0],
    index: 0,
    onEdit: fn(),
    onDelete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const slowUser = userEvent.setup({ delay: 75 });

    await slowUser.click(canvas.getByRole('button', { name: 'Edit plan' }));
    await slowUser.click(canvas.getByRole('button', { name: 'Delete plan' }));

    expect(args.onEdit).toHaveBeenCalledWith(storyMembershipPlanConfigPlans[0]);
    expect(args.onDelete).toHaveBeenCalledWith(storyMembershipPlanConfigPlans[0]);
  },
};

export const ArchivedRow: Story = {
  args: {
    plan: storyMembershipPlanConfigPlans[2],
    index: 1,
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const MissingDescriptionRow: Story = {
  args: {
    plan: {
      ...storyMembershipPlanConfigPlans[0],
      id: 'plan-row-missing-desc',
      name: 'Starter Pass',
      description: null,
      durationDays: 14,
      price: 799,
      isActive: true,
    },
    index: 2,
    onEdit: fn(),
    onDelete: fn(),
  },
};