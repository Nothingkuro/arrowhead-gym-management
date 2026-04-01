import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';

const meta = {
  title: 'App/Pages/Login Page',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RoleSelection: Story = {
  render: () => (
    <MemoryRouter>
      <LoginPage disableSubmit />
    </MemoryRouter>
  ),
};

export const CredentialsInput: Story = {
  render: () => (
    <MemoryRouter>
      <LoginPage
        disableSubmit
        initialStep="enter-credentials"
        initialRole="Staff"
      />
    </MemoryRouter>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <MemoryRouter>
      <LoginPage
        disableSubmit
        initialStep="enter-credentials"
        initialRole="Owner"
        initialUsername="owner.user"
        initialPassword="secret123"
        initialLoading
      />
    </MemoryRouter>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <MemoryRouter>
      <LoginPage
        disableSubmit
        initialStep="enter-credentials"
        initialRole="Staff"
        initialUsername="staff.user"
        initialPassword="bad-password"
        initialError="Invalid username or password"
      />
    </MemoryRouter>
  ),
};
