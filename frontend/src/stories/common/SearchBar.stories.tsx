import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchBar from '../../components/common/SearchBar';

const meta = {
  title: 'App/Common/Search Bar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function SearchBarPlayground(args: ComponentProps<typeof SearchBar>) {
  const [value, setValue] = useState(args.value ?? '');

  return (
    <div className="w-[320px]">
      <SearchBar {...args} value={value} onChange={setValue} />
    </div>
  );
}

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Search member...',
    inputClassName: 'bg-surface border-neutral-300 text-secondary placeholder:text-neutral-400',
  },
  render: (args) => <SearchBarPlayground {...args} />,
};

export const Prefilled: Story = {
  args: {
    value: 'john doe',
    placeholder: 'Search member...',
    inputClassName: 'bg-surface border-neutral-300 text-secondary placeholder:text-neutral-400',
  },
  render: (args) => <SearchBarPlayground {...args} />,
};

export const Disabled: Story = {
  args: {
    value: 'search disabled',
    disabled: true,
    placeholder: 'Search...',
    inputClassName: 'bg-surface-alt border-neutral-300 text-secondary placeholder:text-neutral-400',
  },
  render: (args) => <SearchBarPlayground {...args} />,
};
