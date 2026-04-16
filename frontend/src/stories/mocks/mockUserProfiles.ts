import type { User } from '../../types/user';

export const storyProfileUsers: User[] = [
  {
    id: 'usr-admin-001',
    username: 'owner.arrowhead',
    role: 'ADMIN',
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
  },
  {
    id: 'usr-staff-001',
    username: 'staff.reception',
    role: 'STAFF',
    createdAt: '2026-02-01T08:15:00.000Z',
    updatedAt: '2026-03-12T08:15:00.000Z',
  },
];

export const storyProfileUsersNoStaff: User[] = [
  {
    id: 'usr-admin-001',
    username: 'owner.arrowhead',
    role: 'ADMIN',
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
  },
];
