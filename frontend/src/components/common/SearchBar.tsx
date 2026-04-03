import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  showIcon?: boolean;
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false,
  className,
  inputClassName,
  showIcon = true,
}: SearchBarProps) {
  return (
    <div className={joinClasses('relative', className)}>
      {showIcon && (
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={joinClasses(
          showIcon ? 'pl-9' : 'pl-4',
          'w-full pr-4 py-2.5 rounded-lg border text-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          inputClassName,
        )}
      />
    </div>
  );
}
