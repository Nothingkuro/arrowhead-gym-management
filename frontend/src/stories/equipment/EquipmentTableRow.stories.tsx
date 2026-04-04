import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { Equipment } from '../../types/equipment';
import { EquipmentCondition } from '../../types/equipment';
import EquipmentTableRow from '../../components/equipment/EquipmentTableRow';
import { longNameEquipment, newTreadmill } from '../helpers/mockEquipment';

type EquipmentRowStoryArgs = {
  id: string;
  itemName: string;
  quantity: number;
  condition: EquipmentCondition;
  isHovered: boolean;
  index: number;
};

function buildEquipment(args: EquipmentRowStoryArgs): Equipment {
  return {
    id: args.id,
    itemName: args.itemName,
    quantity: args.quantity,
    condition: args.condition,
    lastChecked: '2026-04-04T10:00:00.000Z',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-04-04T10:00:00.000Z',
  };
}

function EquipmentTableRowStory(args: EquipmentRowStoryArgs) {
  const equipment = buildEquipment(args);

  return (
    <div className="w-[760px] max-w-full rounded-lg border border-neutral-300 overflow-hidden bg-surface">
      <table className="w-full border-collapse">
        <tbody>
          <EquipmentTableRow
            equipment={equipment}
            index={args.index}
            isHovered={args.isHovered}
            onMouseEnter={fn()}
            onMouseLeave={fn()}
            onEdit={fn()}
            onDelete={fn()}
          />
        </tbody>
      </table>
    </div>
  );
}

const meta = {
  title: 'App/Equipment/Equipment Table Row',
  component: EquipmentTableRowStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    itemName: { control: 'text' },
    quantity: { control: { type: 'number', min: 0, step: 1 } },
    condition: {
      control: 'select',
      options: [EquipmentCondition.GOOD, EquipmentCondition.MAINTENANCE, EquipmentCondition.BROKEN],
    },
    isHovered: { control: 'boolean' },
    index: { control: { type: 'number', min: 0, step: 1 } },
    id: { control: 'text' },
  },
} satisfies Meta<typeof EquipmentTableRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    id: newTreadmill.id,
    itemName: newTreadmill.itemName,
    quantity: newTreadmill.quantity,
    condition: newTreadmill.condition,
    isHovered: false,
    index: 0,
  },
};

export const LowStock: Story = {
  args: {
    id: 'EQ-LOW-STOCK',
    itemName: 'Battle Rope',
    quantity: 1,
    condition: EquipmentCondition.MAINTENANCE,
    isHovered: false,
    index: 1,
  },
};

export const OutOfStock: Story = {
  args: {
    id: 'EQ-OUT-OF-STOCK',
    itemName: 'Resistance Band Pack',
    quantity: 0,
    condition: EquipmentCondition.BROKEN,
    isHovered: false,
    index: 2,
  },
};

export const LongName: Story = {
  args: {
    id: longNameEquipment.id,
    itemName: longNameEquipment.itemName,
    quantity: longNameEquipment.quantity,
    condition: longNameEquipment.condition,
    isHovered: false,
    index: 3,
  },
};
