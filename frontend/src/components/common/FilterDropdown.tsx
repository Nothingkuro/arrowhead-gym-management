import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label?: string;
  options: Array<{ label: string; value: string }>;
  activeOption: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: string) => void;
  className?: string;
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function FilterDropdown({
  label = 'Filter',
  options,
  activeOption,
  isOpen,
  onToggle,
  onSelect,
  className,
}: FilterDropdownProps) {
  return (
    <div className={joinClasses('relative', className)}>
      <button
        onClick={onToggle}
        className="
          flex items-center gap-2 px-4 py-2.5 bg-surface
          border border-neutral-300 rounded-lg text-sm text-secondary
          hover:border-neutral-400 transition-all duration-200 cursor-pointer
        "
      >
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 top-full mt-1 w-36 z-20
            bg-surface border border-neutral-200 rounded-lg
            shadow-lg overflow-hidden
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`
                w-full px-4 py-2.5 text-left text-sm cursor-pointer
                transition-colors duration-150
                ${
                  activeOption === option.value
                    ? 'bg-primary text-text-light font-medium'
                    : 'text-secondary hover:bg-surface-alt'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
