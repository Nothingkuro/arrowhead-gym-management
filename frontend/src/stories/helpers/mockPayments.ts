export interface MemberPaymentHistoryRecord {
  id: string;
  memberId: string;
  paidAt: string;
  amountPhp: number;
  membershipPlan: string;
  processedBy: string;
}

export const MOCK_MEMBER_PAYMENTS: MemberPaymentHistoryRecord[] = [
  {
    id: '23293',
    memberId: '67',
    paidAt: '2026-01-01T08:00:00.000Z',
    amountPhp: 600,
    membershipPlan: 'One Month',
    processedBy: 'Staff A',
  },
  {
    id: '23354',
    memberId: '67',
    paidAt: '2026-02-03T08:00:00.000Z',
    amountPhp: 600,
    membershipPlan: 'One Month',
    processedBy: 'Staff B',
  },
  {
    id: '23511',
    memberId: '67',
    paidAt: '2026-03-01T08:00:00.000Z',
    amountPhp: 1500,
    membershipPlan: 'Three Months',
    processedBy: 'Staff C',
  },
  {
    id: '23602',
    memberId: '67',
    paidAt: '2025-12-01T08:00:00.000Z',
    amountPhp: 600,
    membershipPlan: 'One Month',
    processedBy: 'Staff A',
  },
  {
    id: '23888',
    memberId: '68',
    paidAt: '2026-02-11T08:00:00.000Z',
    amountPhp: 600,
    membershipPlan: 'One Month',
    processedBy: 'Staff C',
  },
  {
    id: '23901',
    memberId: '69',
    paidAt: '2026-01-23T08:00:00.000Z',
    amountPhp: 300,
    membershipPlan: 'Walk-In',
    processedBy: 'Staff B',
  },
];