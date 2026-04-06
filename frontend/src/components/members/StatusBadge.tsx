import type { MemberStatus } from '../../types/member';

type BadgeVariant = 'text' | 'pill';

interface StatusBadgeProps {
  status: MemberStatus;
  variant?: BadgeVariant;
  className?: string;
}

const statusStyles: Record<MemberStatus, { text: string; bg: string }> = {
  ACTIVE: { text: 'text-success', bg: 'bg-success/10' },
  EXPIRED: { text: 'text-danger', bg: 'bg-danger/10' },
  INACTIVE: { text: 'text-neutral-400', bg: 'bg-neutral-100' },
};

export default function StatusBadge({
  status,
  variant = 'text',
  className,
}: StatusBadgeProps) {
  const style = statusStyles[status];

  if (variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${style.bg} ${style.text} ${className ?? ''}`}
      >
        {status}
      </span>
    );
  }

  return (
    <span className={`font-semibold uppercase ${style.text} ${className ?? ''}`}>
      {status}
    </span>
  );
}
