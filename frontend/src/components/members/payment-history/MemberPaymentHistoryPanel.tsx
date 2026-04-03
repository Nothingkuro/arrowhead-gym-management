import { useMemo, useState } from 'react';
import PaymentHistoryFilters from './PaymentHistoryFilters';
import PaymentHistoryList from './PaymentHistoryList';
import { MOCK_MEMBER_PAYMENTS, type MemberPaymentHistoryRecord } from '../../../stories/helpers/mockPayments';

interface MemberPaymentHistoryPanelProps {
  memberId: string;
  payments?: MemberPaymentHistoryRecord[];
}

export default function MemberPaymentHistoryPanel({
  memberId,
  payments,
}: MemberPaymentHistoryPanelProps) {
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');

  const memberPayments = useMemo(() => {
    return (payments ?? MOCK_MEMBER_PAYMENTS)
      .filter((paymentRecord) => paymentRecord.memberId === memberId)
      .sort((leftRecord, rightRecord) => {
        return new Date(rightRecord.paidAt).getTime() - new Date(leftRecord.paidAt).getTime();
      });
  }, [memberId, payments]);

  const yearOptions = useMemo(() => {
    return Array.from(
      new Set(
        memberPayments.map((paymentRecord) => {
          return String(new Date(paymentRecord.paidAt).getFullYear());
        }),
      ),
    ).sort((leftYear, rightYear) => Number(rightYear) - Number(leftYear));
  }, [memberPayments]);

  const filteredPayments = useMemo(() => {
    return memberPayments.filter((paymentRecord) => {
      const paidDate = new Date(paymentRecord.paidAt);
      const monthMatches = selectedMonth === 'ALL' || String(paidDate.getMonth() + 1) === selectedMonth;
      const yearMatches = selectedYear === 'ALL' || String(paidDate.getFullYear()) === selectedYear;
      return monthMatches && yearMatches;
    });
  }, [memberPayments, selectedMonth, selectedYear]);

  return (
    <section
      className="
        w-130 max-w-full border border-neutral-300 bg-surface-alt
        px-5 py-5 sm:px-8 sm:py-7
      "
    >
      <PaymentHistoryFilters
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        yearOptions={yearOptions}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />
      <PaymentHistoryList payments={filteredPayments} />
    </section>
  );
}