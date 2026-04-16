import type { MembershipPlan, MembershipPlanFormData } from '../../types/membershipPlan';

export const storyMembershipPlanConfigPlans: MembershipPlan[] = [
  {
    id: 'plan-monthly',
    name: 'Monthly Pass',
    description: 'Standard monthly access for regular gym members.',
    durationDays: 30,
    price: 1200,
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'plan-quarterly',
    name: 'Quarterly Pass',
    description: 'Three-month bundle with improved value.',
    durationDays: 90,
    price: 3200,
    isActive: true,
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'plan-day',
    name: 'Day Pass',
    description: 'One-day walk-in access.',
    durationDays: 1,
    price: 150,
    isActive: false,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-10T08:00:00Z',
  },
];

export const storyMembershipPlanConfigManyPlans: MembershipPlan[] = [
  ...storyMembershipPlanConfigPlans,
  {
    id: 'plan-weekly',
    name: 'Weekly Pass',
    description: 'Seven-day plan for short-term goals.',
    durationDays: 7,
    price: 650,
    isActive: true,
    createdAt: '2026-02-03T08:00:00Z',
    updatedAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'plan-semiannual',
    name: 'Semi-Annual Pass',
    description: 'Half-year membership for committed members.',
    durationDays: 180,
    price: 6800,
    isActive: true,
    createdAt: '2026-02-05T08:00:00Z',
    updatedAt: '2026-02-05T08:00:00Z',
  },
  {
    id: 'plan-annual',
    name: 'Annual Pass',
    description:
      'Full-year unlimited access including periodic progress consultation and class priority on peak hours.',
    durationDays: 365,
    price: 11900,
    isActive: true,
    createdAt: '2026-02-06T08:00:00Z',
    updatedAt: '2026-02-06T08:00:00Z',
  },
  {
    id: 'plan-frozen',
    name: 'Legacy Promo Plan',
    description: null,
    durationDays: 60,
    price: 1900,
    isActive: false,
    createdAt: '2025-11-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
];

export const storyMembershipPlanConfigArchivedOnlyPlans: MembershipPlan[] = [
  {
    id: 'plan-legacy-monthly',
    name: 'Legacy Monthly',
    description: 'Archived monthly option kept for historical reference.',
    durationDays: 30,
    price: 1100,
    isActive: false,
    createdAt: '2025-09-15T08:00:00Z',
    updatedAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'plan-legacy-annual',
    name: 'Legacy Annual',
    description: 'Archived annual option with no longer active pricing.',
    durationDays: 365,
    price: 9800,
    isActive: false,
    createdAt: '2025-08-15T08:00:00Z',
    updatedAt: '2026-01-08T08:00:00Z',
  },
];

export const storyMembershipPlanConfigMissingDescriptionPlans: MembershipPlan[] = [
  {
    id: 'plan-nodec-monthly',
    name: 'Starter Monthly',
    description: null,
    durationDays: 30,
    price: 950,
    isActive: true,
    createdAt: '2026-03-11T08:00:00Z',
    updatedAt: '2026-03-11T08:00:00Z',
  },
  {
    id: 'plan-nodec-day',
    name: 'Starter Day Pass',
    description: '',
    durationDays: 1,
    price: 120,
    isActive: false,
    createdAt: '2026-03-12T08:00:00Z',
    updatedAt: '2026-03-15T08:00:00Z',
  },
];

export const storyMembershipPlanConfigLongDescriptionPlans: MembershipPlan[] = [
  {
    id: 'plan-premium-yearly',
    name: 'Premium Yearly',
    description:
      'Long-term premium plan with floor access, class priority, monthly trainer check-ins, and selected event passes for members who want a consistent full-year program.',
    durationDays: 365,
    price: 15000,
    isActive: true,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  },
];

export const storyMembershipPlanConfigAddFormData: MembershipPlanFormData = {
  name: '',
  description: '',
  durationDays: 30,
  price: 0,
  isActive: true,
};

export const storyMembershipPlanConfigEditFormData: MembershipPlanFormData = {
  name: 'Quarterly Pass',
  description: 'Three-month bundle with improved value.',
  durationDays: 90,
  price: 3200,
  isActive: true,
};

export const storyMembershipPlanConfigErrorMessage = 'A membership plan with this name already exists.';

export const storyMembershipPlanConfigDeletePlanName = 'Quarterly Pass';

export const storyMembershipPlanConfigStatusLabels = {
  activeLabel: 'Active',
  archivedLabel: 'Archived',
};
