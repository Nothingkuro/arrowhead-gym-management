import { AlertTriangle } from 'lucide-react';
import type { InventoryAlert } from '../../types/report';
import ReportSectionCard from './ReportSectionCard';

interface LowInventoryAlertListProps {
  alerts: InventoryAlert[];
  threshold?: number;
}

export default function LowInventoryAlertList({
  alerts,
  threshold = 5,
}: LowInventoryAlertListProps) {
  const effectiveThreshold = alerts[0]?.threshold ?? threshold;

  const lowStockItems = alerts
    .filter((alert) => alert.quantity < (alert.threshold ?? threshold))
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <ReportSectionCard
      title="Low Inventory Alerts"
      subtitle={`Equipment below threshold (${effectiveThreshold} units)`}
      icon={<AlertTriangle size={20} />}
      iconClassName="bg-danger/20 text-danger"
    >
      {lowStockItems.length === 0 ? (
        <p className="rounded-lg border border-neutral-600 bg-secondary px-4 py-3 text-sm text-neutral-300">
          No low inventory alerts right now.
        </p>
      ) : (
        <ul className="space-y-3">
          {lowStockItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-lg border border-neutral-600 bg-secondary p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-text-light">{item.itemName}</p>
              </div>

              <span className="inline-flex w-fit items-center rounded-md border border-danger/40 bg-danger/15 px-2.5 py-1 text-sm font-semibold text-danger">
                Qty: {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      )}
    </ReportSectionCard>
  );
}
