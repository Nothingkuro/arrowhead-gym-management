import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import MemberSearchSelect from '../../components/payments/MemberSearchSelect';
import type { PaymentMember } from '../../types/payment';

const storyMembers: PaymentMember[] = [
  {
    id: 'member-001',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    contactNumber: '09171234567',
    status: 'ACTIVE',
  },
  {
    id: 'member-002',
    firstName: 'Lea',
    lastName: 'Santos',
    contactNumber: '09179998888',
    status: 'EXPIRED',
  },
  {
    id: 'member-003',
    firstName: 'Paolo',
    lastName: 'Rivera',
    contactNumber: '09176667777',
    status: 'INACTIVE',
  },
];

const meta = {
  title: 'App/Payments/Member Search Select',
  component: MemberSearchSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MemberSearchSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

function MemberSearchSelectPlayground(args: ComponentProps<typeof MemberSearchSelect>) {
  const [selectedMemberId, setSelectedMemberId] = useState(args.selectedMemberId);

  return (
    <div className="max-w-xl">
      <MemberSearchSelect
        {...args}
        selectedMemberId={selectedMemberId}
        onSelectMember={setSelectedMemberId}
      />
    </div>
  );
}

export const HappyWithMatches: Story = {
  args: {
    members: storyMembers,
    selectedMemberId: 'member-001',
    onSelectMember: () => {},
  },
  render: (args) => <MemberSearchSelectPlayground {...args} />,
};

export const SadNoResults: Story = {
  args: {
    members: [],
    selectedMemberId: '',
    onSelectMember: () => {},
    disabled: true,
  },
  render: (args) => <MemberSearchSelectPlayground {...args} />,
};
