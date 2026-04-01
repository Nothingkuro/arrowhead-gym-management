import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

const meta = {
  title: 'App/Layouts/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    onToggle: fn(),
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopExpanded: Story = {
  args: {
    isOpen: true,
    defaultCollapsed: false,
  },
  render: (args) => (
    <MemoryRouter initialEntries={['/dashboard/members']}>
      <div className="h-screen">
        <Sidebar {...args} />
      </div>
    </MemoryRouter>
  ),
};

export const DesktopCollapsed: Story = {
  args: {
    isOpen: true,
    defaultCollapsed: true,
  },
  render: (args) => (
    <MemoryRouter initialEntries={['/dashboard/members']}>
      <div className="h-screen">
        <Sidebar {...args} />
      </div>
    </MemoryRouter>
  ),
};


