import type { MemberPaymentHistoryRecord } from '../../../stories/helpers/mockPayments';

function formatPaymentDate(dateIso: string): string {
  const dateValue = new Date(dateIso);

  if (Number.isNaN(dateValue.getTime())) {
    return '--';
  }

  return dateValue.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface PaymentHistoryCardProps {
  payment: MemberPaymentHistoryRecord;
}

export default function PaymentHistoryCard({ payment }: PaymentHistoryCardProps) {
  const amountLabel = `${payment.amountPhp.toLocaleString('en-PH')} Php`;

  return (
    <article className="w-full rounded-sm bg-primary px-6 py-4 text-center text-text-light shadow-card">
      <h3 className="text-2xl leading-tight">Payment #{payment.id}</h3>
      <p className="mt-2 text-lg leading-tight">{formatPaymentDate(payment.paidAt)}</p>
      <p className="mt-1 text-lg leading-tight">{amountLabel}</p>
      <p className="mt-1 text-lg leading-tight">{payment.membershipPlan}</p>
      <p className="mt-1 text-lg leading-tight">Issued by: {payment.processedBy}</p>
    </article>
  );
}