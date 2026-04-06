import type { ReactNode } from 'react';

interface ProfileInfoRowProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

export default function ProfileInfoRow({
  label,
  value,
  valueClassName,
}: ProfileInfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-primary font-semibold text-sm sm:text-base">{label}</span>
      <span className={`text-secondary text-sm sm:text-base font-medium ${valueClassName ?? ''}`}>
        {value}
      </span>
    </div>
  );
}
