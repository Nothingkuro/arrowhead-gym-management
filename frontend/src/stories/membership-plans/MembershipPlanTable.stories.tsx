import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import MembershipPlanTable from '../../components/membership-plans/MembershipPlanTable';
import {
  storyMembershipPlanConfigArchivedOnlyPlans,
  storyMembershipPlanConfigMissingDescriptionPlans,
  storyMembershipPlanConfigLongDescriptionPlans,
  storyMembershipPlanConfigManyPlans,
  storyMembershipPlanConfigPlans,
} from '../mocks/mockMembershipPlanConfig';

const meta = {
  title: 'App/Membership Plans/Membership Plan Table',
  component: MembershipPlanTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    plans: storyMembershipPlanConfigPlans,
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof MembershipPlanTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const slowUser = userEvent.setup({ delay: 75 });

    await slowUser.click(canvas.getByRole('button', { name: 'Edit plan' }));
    await slowUser.click(canvas.getByRole('button', { name: 'Delete plan' }));

    expect(args.onEdit).toHaveBeenCalledWith(storyMembershipPlanConfigPlans[0]);
    expect(args.onDelete).toHaveBeenCalledWith(storyMembershipPlanConfigPlans[0]);
  },
};

export const Empty: Story = {
  args: {
    plans: [],
  },
};

export const LongDescription: Story = {
  args: {
    plans: storyMembershipPlanConfigLongDescriptionPlans,
  },
};

export const ArchivedOnly: Story = {
  args: {
    plans: storyMembershipPlanConfigArchivedOnlyPlans,
  },
};

export const MissingDescription: Story = {
  args: {
    plans: storyMembershipPlanConfigMissingDescriptionPlans,
  },
};

export const ScrollableManyRows: Story = {
  args: {
    plans: storyMembershipPlanConfigManyPlans,
  },
};
