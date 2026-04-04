import { EquipmentCondition } from '../../types/equipment';

type BadgeVariant = 'text' | 'pill';

interface ConditionBadgeProps {
  condition?: EquipmentCondition | string;
  variant?: BadgeVariant;
  className?: string;
}

const conditionStyles: Record<EquipmentCondition, { text: string; bg: string; label: string }> = {
  [EquipmentCondition.GOOD]: {
    text: 'text-success',
    bg: 'bg-success/10',
    label: 'Good',
  },
  [EquipmentCondition.MAINTENANCE]: {
    text: 'text-orange-700',
    bg: 'bg-orange-100',
    label: 'Maintenance',
  },
  [EquipmentCondition.BROKEN]: {
    text: 'text-danger',
    bg: 'bg-danger/10',
    label: 'Broken',
  },
};

const fallbackStyle = {
  text: 'text-neutral-500',
  bg: 'bg-neutral-100',
  label: 'Unknown',
};

export default function ConditionBadge({
  condition,
  variant = 'text',
  className,
}: ConditionBadgeProps) {
  const style = condition
    ? conditionStyles[condition as EquipmentCondition] ?? fallbackStyle
    : fallbackStyle;

  if (variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${style.bg} ${style.text} ${className ?? ''}`}
      >
        {style.label}
      </span>
    );
  }

  return (
    <span className={`font-semibold uppercase ${style.text} ${className ?? ''}`}>
      {style.label}
    </span>
  );
}
