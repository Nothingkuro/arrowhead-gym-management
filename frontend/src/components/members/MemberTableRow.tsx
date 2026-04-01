import type { Member } from '../../types/member';
import StatusBadge from './StatusBadge';

interface MemberTableRowProps {
  member: Member;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export default function MemberTableRow({
  member,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: MemberTableRowProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        flex items-center px-4 sm:px-6 py-3 border-b border-neutral-200
        last:border-b-0 transition-all duration-200 cursor-pointer
        ${
          isHovered
            ? 'bg-warning'
            : index % 2 === 0
              ? 'bg-surface'
              : 'bg-surface-alt/50'
        }
      `}
    >
      <span
        className={`
          text-sm font-medium w-16 shrink-0
          ${isHovered ? 'text-secondary' : 'text-primary'}
        `}
      >
        #{member.id}
      </span>

      <span
        className={`
          flex-1 text-sm text-right sm:text-center
          ${isHovered ? 'text-secondary font-medium' : 'text-secondary'}
        `}
      >
        {member.firstName} {member.lastName}
      </span>

      <StatusBadge
        status={member.status}
        className={`text-sm w-24 text-right shrink-0 ${isHovered ? 'text-danger font-semibold' : ''}`}
      />
    </div>
  );
}
