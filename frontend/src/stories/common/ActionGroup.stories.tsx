import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import ActionGroup from '../../components/common/ActionGroup';

const meta = {
  title: 'App/Common/Action Group',
  component: ActionGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ActionGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllEnabled: Story = {
  args: {
    actions: [
      { label: 'Edit Profile', onClick: fn(), variant: 'secondary' },
      { label: 'Check-In', onClick: fn(), variant: 'neutral' },
      { label: 'Deactivate', onClick: fn(), variant: 'danger' },
    ],
  },
};

export const WithDisabledActions: Story = {
  args: {
    actions: [
      { label: 'Edit Profile', onClick: fn(), variant: 'secondary' },
      { label: 'Check-In', onClick: fn(), variant: 'neutral', disabled: true },
      { label: 'Deactivate', onClick: fn(), variant: 'danger', disabled: true },
    ],
  },
};
