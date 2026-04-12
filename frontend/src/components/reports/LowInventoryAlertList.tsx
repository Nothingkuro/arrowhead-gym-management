import { AlertTriangle } from 'lucide-react';
import type { InventoryAlert } from '../../types/report';
import ReportSectionCard from './ReportSectionCard';

interface LowInventoryAlertListProps {
  alerts: InventoryAlert[];
}

export default function LowInventoryAlertList({ alerts }: LowInventoryAlertListProps) {
  const lowStockItems = alerts
    .filter((alert) => alert.quantity < 5)
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <ReportSectionCard
      title="Low Inventory Alerts"
      subtitle="Equipment below threshold (5 units)"
      icon={<AlertTriangle size={20} />}
      iconClassName="bg-danger/20 text-danger"
    >
      {lowStockItems.length === 0 ? (
        <p className="rounded-lg border border-neutral-700 bg-secondary px-4 py-3 text-sm text-neutral-300">
          No low inventory alerts right now.
        </p>
      ) : (
        <ul className="space-y-3">
          {lowStockItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-lg border border-neutral-700 bg-secondary p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-text-light">{item.itemName}</p>
                <p className="text-xs text-neutral-300">
                  {item.category} - Threshold: {item.threshold}
                </p>
              </div>

              <p className="text-sm font-semibold text-danger">
                Qty: {item.quantity}
              </p>
            </li>
          ))}
        </ul>
      )}
    </ReportSectionCard>
  );
}
