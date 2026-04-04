import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import AddEquipmentModal from '../../components/equipment/AddEquipmentModal';
import { EquipmentCondition } from '../../types/equipment';

const meta = {
  title: 'App/Equipment/Add Equipment Modal',
  component: AddEquipmentModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: true,
    onClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof AddEquipmentModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenDefault: Story = {
  args: {
    initialData: {
      itemName: '',
      quantity: 1,
      condition: EquipmentCondition.GOOD,
    },
  },
};

export const ValidationErrors: Story = {
  args: {
    errorMessage: 'Item Name is required. Quantity must be positive.',
    initialData: {
      itemName: '',
      quantity: -1,
      condition: EquipmentCondition.MAINTENANCE,
    },
  },
};

export const SubmittingState: Story = {
  args: {
    isSubmitting: true,
    title: 'Edit Equipment',
    submitLabel: 'Save',
    submittingLabel: 'Saving...',
    initialData: {
      itemName: 'Wobbly Bench',
      quantity: 2,
      condition: EquipmentCondition.MAINTENANCE,
    },
  },
};
