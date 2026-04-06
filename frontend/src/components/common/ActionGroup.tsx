export type ActionVariant = 'secondary' | 'neutral' | 'danger';

export interface ActionGroupItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: ActionVariant;
}

interface ActionGroupProps {
  actions: ActionGroupItem[];
  className?: string;
}

function variantClasses(variant: ActionVariant, disabled: boolean) {
  if (disabled) {
    return 'border-neutral-200 text-neutral-300 bg-neutral-50 cursor-not-allowed';
  }

  switch (variant) {
    case 'secondary':
      return 'border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-text-light cursor-pointer';
    case 'danger':
      return 'border-danger text-danger bg-transparent hover:bg-danger hover:text-text-light cursor-pointer';
    case 'neutral':
    default:
      return 'border-neutral-400 text-neutral-600 bg-transparent hover:bg-neutral-100 cursor-pointer';
  }
}

export default function ActionGroup({ actions, className }: ActionGroupProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className ?? ''}`}>
      {actions.map((action) => {
        const variant = action.variant ?? 'neutral';
        const disabled = action.disabled ?? false;

        return (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={disabled}
            className={`
              px-6 py-2 border-2 rounded-lg text-sm font-semibold
              active:scale-[0.97] transition-all duration-200
              ${variantClasses(variant, disabled)}
            `}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
