import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import DeleteConfirmModal from '../../components/membership-plans/DeleteConfirmModal';
import { storyMembershipPlanConfigDeletePlanName } from '../mocks/mockMembershipPlanConfig';

const meta = {
  title: 'App/Membership Plans/Delete Confirm Modal',
  component: DeleteConfirmModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    isOpen: true,
    planName: storyMembershipPlanConfigDeletePlanName,
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof DeleteConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const slowUser = userEvent.setup({ delay: 75 });

    await slowUser.click(canvas.getByRole('button', { name: 'Delete' }));

    expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};
