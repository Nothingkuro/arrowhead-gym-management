import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import MembersPage from '../../pages/MembersPage';
import { storyMembers } from '../helpers/mockMembers';

const meta = {
  title: 'App/Pages/Members Page',
  component: MembersPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MembersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

function MembersPageCanvas(props: ComponentProps<typeof MembersPage>) {
  return (
    <MemoryRouter initialEntries={['/dashboard/members']}>
      <div className="min-h-screen bg-surface-alt p-4 sm:p-6 lg:p-8">
        <MembersPage {...props} disableNavigation />
      </div>
    </MemoryRouter>
  );
}

export const DefaultList: Story = {
  render: () => <MembersPageCanvas members={storyMembers} />,
};

export const EmptyResults: Story = {
  render: () => (
    <MembersPageCanvas
      members={storyMembers}
      initialSearchQuery="not-a-member"
    />
  ),
};

export const FilterMenuOpen: Story = {
  render: () => (
    <MembersPageCanvas
      members={storyMembers}
      initialFilterOpen
    />
  ),
};

export const ActiveOnly: Story = {
  render: () => (
    <MembersPageCanvas
      members={storyMembers}
      initialFilter="ACTIVE"
    />
  ),
};

export const ExpiredOnly: Story = {
  render: () => (
    <MembersPageCanvas
      members={storyMembers}
      initialFilter="EXPIRED"
    />
  ),
};

export const SearchResults: Story = {
  render: () => (
    <MembersPageCanvas
      members={storyMembers}
      initialSearchQuery="67"
    />
  ),
};

export const AddModalOpen: Story = {
  render: () => (
    <MembersPageCanvas
      members={storyMembers}
      initialAddModalOpen
    />
  ),
};
