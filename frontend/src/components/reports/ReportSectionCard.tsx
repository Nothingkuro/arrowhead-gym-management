import type { ReactNode } from 'react';

interface ReportSectionCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconClassName?: string;
  children: ReactNode;
  actionSlot?: ReactNode;
}

export default function ReportSectionCard({
  title,
  subtitle,
  icon,
  iconClassName = 'bg-primary/20 text-primary-light',
  children,
  actionSlot,
}: ReportSectionCardProps) {
  return (
    <article className="rounded-xl border border-neutral-700 bg-secondary-light p-4 sm:p-5 shadow-card text-text-light">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
            aria-hidden="true"
          >
            {icon}
          </span>
          <div>
            <h2 className="text-lg font-semibold leading-tight text-text-light">{title}</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">{subtitle}</p>
          </div>
        </div>

        {actionSlot ? <div className="w-full sm:w-auto">{actionSlot}</div> : null}
      </header>

      {children}
    </article>
  );
}
