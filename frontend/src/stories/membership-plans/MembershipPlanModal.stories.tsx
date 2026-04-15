import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import MembershipPlanModal from '../../components/membership-plans/MembershipPlanModal';
import {
  storyMembershipPlanConfigAddFormData,
  storyMembershipPlanConfigEditFormData,
  storyMembershipPlanConfigErrorMessage,
} from '../mocks/mockMembershipPlanConfig';

const meta = {
  title: 'App/Membership Plans/Membership Plan Modal',
  component: MembershipPlanModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    isOpen: true,
    mode: 'add',
    onClose: fn(),
    onSubmit: fn(),
    initialData: storyMembershipPlanConfigAddFormData,
    errorMessage: null,
  },
} satisfies Meta<typeof MembershipPlanModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const slowUser = userEvent.setup({ delay: 75 });

    await slowUser.type(canvas.getByPlaceholderText('e.g. Monthly Pass'), 'Premium Monthly');
    await slowUser.type(canvas.getByPlaceholderText('Brief description (optional)'), 'Includes locker access');
    await slowUser.clear(canvas.getByPlaceholderText('0.00'));
    await slowUser.type(canvas.getByPlaceholderText('0.00'), '1499');
    await slowUser.clear(canvas.getByPlaceholderText('30'));
    await slowUser.type(canvas.getByPlaceholderText('30'), '30');

    await slowUser.click(canvas.getByRole('button', { name: 'Create Plan' }));

    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledWith({
        name: 'Premium Monthly',
        description: 'Includes locker access',
        durationDays: 30,
        price: 1499,
        isActive: true,
      });
    });
  },
};

export const AddMode: Story = {
  args: {
    mode: 'add',
    initialData: storyMembershipPlanConfigAddFormData,
  },
};

export const EditMode: Story = {
  args: {
    mode: 'edit',
    initialData: storyMembershipPlanConfigEditFormData,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByDisplayValue('Quarterly Pass')).toBeInTheDocument();
      expect(canvas.getByDisplayValue('Three-month bundle with improved value.')).toBeInTheDocument();
      expect(canvas.getByDisplayValue('90')).toBeInTheDocument();
      expect(canvas.getByDisplayValue('3200')).toBeInTheDocument();
    });
  },
};

export const WithErrorMessage: Story = {
  args: {
    mode: 'edit',
    initialData: storyMembershipPlanConfigEditFormData,
    errorMessage: storyMembershipPlanConfigErrorMessage,
  },
};
