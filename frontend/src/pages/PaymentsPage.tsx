import { useEffect, useState } from 'react';
import MemberSearchSelect from '../components/payments/MemberSearchSelect';
import MembershipPlanTable from '../components/payments/MembershipPlanTable';
import PaymentMethodDropdown from '../components/payments/PaymentMethodDropdown';
import SubmitPaymentButton from '../components/payments/SubmitPaymentButton';
import type { MembershipPlan, PaymentMember, PaymentMethod } from '../types/payment';

const MOCK_MEMBERS: PaymentMember[] = [
  {
    id: 'member-001',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    contactNumber: '09171234567',
    status: 'ACTIVE',
  },
  {
    id: 'member-002',
    firstName: 'Lea',
    lastName: 'Santos',
    contactNumber: '09179998888',
    status: 'EXPIRED',
  },
  {
    id: 'member-003',
    firstName: 'Paolo',
    lastName: 'Rivera',
    contactNumber: '09176667777',
    status: 'INACTIVE',
  },
];

const MOCK_PLANS: MembershipPlan[] = [
  { id: 'plan-walkin', name: 'Walk-In', durationDays: 1, price: 100 },
  { id: 'plan-1month', name: 'One Month', durationDays: 30, price: 1000 },
  { id: 'plan-3months', name: 'Three Months', durationDays: 90, price: 2700 },
];

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'GCASH'];

interface PaymentsPageProps {
  members?: PaymentMember[];
  plans?: MembershipPlan[];
  initialSelectedMemberId?: string;
  initialPaymentMethod?: PaymentMethod;
  initialSelectedPlanId?: string;
  initialLoading?: boolean;
}

export default function PaymentsPage({
  members,
  plans,
  initialSelectedMemberId = '',
  initialPaymentMethod = 'CASH',
  initialSelectedPlanId = '',
  initialLoading = false,
}: PaymentsPageProps) {
  const [membersList, setMembersList] = useState<PaymentMember[]>(members ?? MOCK_MEMBERS);
  const [plansList, setPlansList] = useState<MembershipPlan[]>(plans ?? MOCK_PLANS);
  const [selectedMemberId, setSelectedMemberId] = useState(initialSelectedMemberId);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [selectedPlanId, setSelectedPlanId] = useState(initialSelectedPlanId);
  const [isLoading, setIsLoading] = useState(initialLoading);

  useEffect(() => {
    setMembersList(members ?? MOCK_MEMBERS);
  }, [members]);

  useEffect(() => {
    setPlansList(plans ?? MOCK_PLANS);
  }, [plans]);

  useEffect(() => {
    if (selectedMemberId || membersList.length === 0) {
      return;
    }

    setSelectedMemberId(membersList[0].id);
  }, [membersList, selectedMemberId]);

  useEffect(() => {
    if (selectedPlanId || plansList.length === 0) {
      return;
    }

    setSelectedPlanId(plansList[0].id);
  }, [plansList, selectedPlanId]);

  useEffect(() => {
    setIsLoading(initialLoading);
  }, [initialLoading]);

  useEffect(() => {
    setSelectedPaymentMethod(initialPaymentMethod);
  }, [initialPaymentMethod]);

  return (
    <div className="relative min-h-full">
      <div className="flex items-center justify-center gap-2.5">
        <h1 className="text-primary text-3xl sm:text-4xl font-semibold tracking-tight">Process Payment</h1>
      </div>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-neutral-300 bg-surface-alt px-6 py-6 shadow-card sm:px-8 sm:py-8">
        <div className="space-y-6">
          <MemberSearchSelect
            members={membersList}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            disabled={isLoading || membersList.length === 0}
          />

          <PaymentMethodDropdown
            value={selectedPaymentMethod}
            onChange={setSelectedPaymentMethod}
            disabled={isLoading}
            methods={PAYMENT_METHODS}
          />

          <MembershipPlanTable
            plans={plansList}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
            isLoading={isLoading}
          />

          <SubmitPaymentButton />
        </div>
      </section>
    </div>
  );
}
