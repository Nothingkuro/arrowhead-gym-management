import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import UserProfilePage from '../../pages/UserProfilePage';
import { storyProfileUsers, storyProfileUsersNoStaff } from '../mocks/mockUserProfiles';

const meta = {
  title: 'App/Pages/User Profile Page',
  component: UserProfilePage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UserProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

function UserProfileCanvas(props: { users?: typeof storyProfileUsers }) {
  return (
    <MemoryRouter initialEntries={['/dashboard/profile']}>
      <div className="min-h-screen bg-surface-alt p-4 sm:p-6 lg:p-8">
        <UserProfilePage users={props.users ?? storyProfileUsers} />
      </div>
    </MemoryRouter>
  );
}

export const Default: Story = {
  render: () => <UserProfileCanvas />,
};

export const NoStaffRecord: Story = {
  render: () => <UserProfileCanvas users={storyProfileUsersNoStaff} />,
};

export const UpdateAdminUsernameFlow: Story = {
  render: () => <UserProfileCanvas />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slowUser = userEvent.setup({ delay: 50 });

    const adminUsernameInput = canvas.getByPlaceholderText('Admin username');
    await slowUser.clear(adminUsernameInput);
    await slowUser.type(adminUsernameInput, 'owner.updated');
    await slowUser.click(canvas.getByRole('button', { name: 'Save Admin Profile' }));

    await waitFor(() => {
      expect(canvas.getByText('Admin credentials updated successfully.')).toBeInTheDocument();
      expect(canvas.getByDisplayValue('owner.updated')).toBeInTheDocument();
    });
  },
};

export const UpdateStaffUsernameFlow: Story = {
  render: () => <UserProfileCanvas />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slowUser = userEvent.setup({ delay: 50 });

    const staffUsernameInput = canvas.getByPlaceholderText('Staff username');
    await slowUser.clear(staffUsernameInput);
    await slowUser.type(staffUsernameInput, 'staff.updated');
    await slowUser.click(canvas.getByRole('button', { name: 'Save Staff Profile' }));

    await waitFor(() => {
      expect(canvas.getByText('Staff credentials updated successfully.')).toBeInTheDocument();
      expect(canvas.getByDisplayValue('staff.updated')).toBeInTheDocument();
    });
  },
};

export const ValidationFeedback: Story = {
  render: () => <UserProfileCanvas />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slowUser = userEvent.setup({ delay: 50 });

    await slowUser.click(canvas.getByRole('button', { name: 'Save Admin Profile' }));

    await waitFor(() => {
      expect(
        canvas.getByText('Provide a new admin username or password before saving.'),
      ).toBeInTheDocument();
    });
  },
};
