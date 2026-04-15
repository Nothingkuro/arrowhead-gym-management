import { useMemo, useState } from 'react';
import { CalendarDays, KeyRound, ShieldCheck, UserCog, Users, X } from 'lucide-react';
import type { User, UserRole } from '../types/user';

interface PasswordModalState {
  isOpen: boolean;
  user: User | null;
}

function formatAccountDate(isoDate: string): string {
  if (!isoDate) {
    return '--';
  }

  const dateValue = new Date(isoDate);

  if (Number.isNaN(dateValue.getTime())) {
    return '--';
  }

  return dateValue.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function roleBadgeStyles(role: UserRole): string {
  return role === 'ADMIN'
    ? 'bg-primary/10 text-primary'
    : 'bg-neutral-200 text-secondary';
}

function buildMockAccounts(): User[] {
  const sessionUsername = window.sessionStorage.getItem('authUsername')?.trim();

  return [
    {
      id: 'usr-admin-001',
      username: sessionUsername || 'admin.arrowhead',
      role: 'ADMIN',
      createdAt: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'usr-staff-001',
      username: 'staff.reception',
      role: 'STAFF',
      createdAt: '2026-02-01T08:15:00.000Z',
    },
    {
      id: 'usr-staff-002',
      username: 'staff.trainer',
      role: 'STAFF',
      createdAt: '2026-03-14T10:30:00.000Z',
    },
  ];
}

export default function UserProfilePage() {
  const [accounts] = useState<User[]>(() => buildMockAccounts());
  const [passwordModal, setPasswordModal] = useState<PasswordModalState>({
    isOpen: false,
    user: null,
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const adminAccount = useMemo(() => {
    return accounts.find((account) => account.role === 'ADMIN') ?? accounts[0];
  }, [accounts]);

  const staffAccounts = useMemo(() => {
    return accounts.filter((account) => account.role === 'STAFF');
  }, [accounts]);

  const openPasswordModal = (user: User) => {
    setPasswordModal({
      isOpen: true,
      user,
    });
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const closePasswordModal = () => {
    setPasswordModal({
      isOpen: false,
      user: null,
    });
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordModal.user) {
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSaveMessage(`Password updated locally for ${passwordModal.user.username}.`);
    closePasswordModal();
  };

  return (
    <div className="relative min-h-full">
      <div className="flex items-center justify-center gap-3 mb-8">
        <h1 className="text-primary text-3xl sm:text-4xl font-semibold">
          System Accounts
        </h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {saveMessage && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {saveMessage}
          </div>
        )}

        {adminAccount && (
          <section className="border border-neutral-300 bg-surface-alt px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">Admin Account</h2>
              </div>
              <button
                type="button"
                onClick={() => openPasswordModal(adminAccount)}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-surface px-4 py-2 text-sm font-semibold text-secondary hover:bg-neutral-100 transition-colors"
              >
                <KeyRound size={16} />
                Edit Password
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <article className="rounded-md border border-neutral-300 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Username</p>
                <p className="mt-1 text-base font-semibold text-secondary">{adminAccount.username}</p>
              </article>

              <article className="rounded-md border border-neutral-300 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Role</p>
                <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${roleBadgeStyles(adminAccount.role)}`}>
                  {adminAccount.role}
                </span>
              </article>

              <article className="rounded-md border border-neutral-300 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Created At</p>
                <p className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-secondary">
                  <CalendarDays size={14} className="text-primary" />
                  {formatAccountDate(adminAccount.createdAt)}
                </p>
              </article>
            </div>
          </section>
        )}

        <section className="border border-neutral-300 bg-surface-alt px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-2 border-b border-neutral-300 pb-4">
            <Users size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-primary">Staff Accounts</h2>
          </div>

          {staffAccounts.length === 0 ? (
            <div className="mt-6 rounded-md border border-dashed border-neutral-300 bg-white px-4 py-8 text-center text-neutral-500">
              No staff accounts available.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-md border border-neutral-300 bg-surface">
              <table className="min-w-full border-collapse text-left text-sm text-secondary">
                <thead className="bg-secondary-light text-text-light">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold tracking-wide">Username</th>
                    <th scope="col" className="px-4 py-3 font-semibold tracking-wide">Role</th>
                    <th scope="col" className="px-4 py-3 font-semibold tracking-wide">Created At</th>
                    <th scope="col" className="px-4 py-3 font-semibold tracking-wide text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staffAccounts.map((staffAccount, index) => (
                    <tr key={staffAccount.id} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                      <td className="px-4 py-3 font-medium">{staffAccount.username}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${roleBadgeStyles(staffAccount.role)}`}>
                          {staffAccount.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatAccountDate(staffAccount.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openPasswordModal(staffAccount)}
                          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-surface px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-neutral-100 transition-colors"
                        >
                          <UserCog size={14} />
                          Edit Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {passwordModal.isOpen && passwordModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-alt p-6 shadow-modal sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-primary">Edit Password</h3>
              <button
                type="button"
                onClick={closePasswordModal}
                className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-200 hover:text-secondary transition-colors"
                aria-label="Close password modal"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mb-4 text-sm text-secondary">
              Updating password for <span className="font-semibold">{passwordModal.user.username}</span>.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {passwordError}
                </div>
              )}

              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New Password"
                className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm text-secondary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
                required
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm Password"
                className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm text-secondary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
                required
              />

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="rounded-md border border-neutral-300 bg-surface px-4 py-2 text-sm font-semibold text-secondary hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-text-light hover:bg-primary-dark transition-colors"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
