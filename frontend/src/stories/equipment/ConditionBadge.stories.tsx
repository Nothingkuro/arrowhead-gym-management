import type { Meta, StoryObj } from '@storybook/react-vite';
import ConditionBadge from '../../components/equipment/ConditionBadge';
import { EquipmentCondition } from '../../types/equipment';

const meta = {
  title: 'App/Equipment/Condition Badge',
  component: ConditionBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    condition: {
      control: 'select',
      options: [
        EquipmentCondition.GOOD,
        EquipmentCondition.MAINTENANCE,
        EquipmentCondition.BROKEN,
        'UNKNOWN',
      ],
    },
    variant: {
      control: 'inline-radio',
      options: ['text', 'pill'],
    },
  },
} satisfies Meta<typeof ConditionBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Good: Story = {
  args: {
    condition: EquipmentCondition.GOOD,
    variant: 'pill',
  },
};

export const Maintenance: Story = {
  args: {
    condition: EquipmentCondition.MAINTENANCE,
    variant: 'pill',
  },
};

export const Broken: Story = {
  args: {
    condition: EquipmentCondition.BROKEN,
    variant: 'pill',
  },
};

export const UnknownCondition: Story = {
  args: {
    condition: 'UNKNOWN',
    variant: 'pill',
  },
};

export const MissingCondition: Story = {
  args: {
    condition: undefined,
    variant: 'pill',
  },
};
