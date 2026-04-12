import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  DailyRevenueSummaryCard,
  LowInventoryAlertList,
  MembershipExpiryAlertList,
  MonthlyRevenueReportCard,
} from '../components/reports';
import { getReportsOverview } from '../services/reportsApi';
import type { MonthlyRevenueRecord, ReportData } from '../types/report';

function getLatestRecord(records: MonthlyRevenueRecord[]): MonthlyRevenueRecord | null {
  if (records.length === 0) {
    return null;
  }

  return records.reduce((latest, record) => {
    if (record.year > latest.year) {
      return record;
    }

    if (record.year === latest.year && record.month > latest.month) {
      return record;
    }

    return latest;
  });
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inventoryThreshold, setInventoryThreshold] = useState(5);

  const latestMonthlyRecord = getLatestRecord(reportData?.monthlyRevenue ?? []);
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    latestMonthlyRecord?.month ?? currentDate.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState(
    latestMonthlyRecord?.year ?? currentDate.getFullYear(),
  );
  const authRole = window.sessionStorage.getItem('authRole');

  const loadReports = async (threshold: number) => {
    setIsLoading(true);
    setLoadError(null);

    const data = await getReportsOverview({ threshold, days: 3 });
    setReportData(data);

    const latestRecord = getLatestRecord(data.monthlyRevenue);
    if (latestRecord) {
      setSelectedMonth(latestRecord.month);
      setSelectedYear(latestRecord.year);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const loadInitialReports = async () => {
      try {
        await loadReports(inventoryThreshold);

        if (isCancelled) {
          return;
        }
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Failed to load reports';
        setLoadError(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialReports();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleRefresh = async () => {
    try {
      await loadReports(inventoryThreshold);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load reports';
      setLoadError(message);
      setIsLoading(false);
    }
  };

  if (authRole !== 'ADMIN') {
    return <Navigate to="/dashboard/members" replace />;
  }

  return (
    <div className="relative min-h-full">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-primary text-3xl sm:text-4xl font-semibold">
            Reports and Analytics
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <label htmlFor="inventory-threshold" className="text-sm text-secondary">
            Inventory threshold
          </label>
          <input
            id="inventory-threshold"
            type="number"
            min={0}
            value={inventoryThreshold}
            onChange={(event) => setInventoryThreshold(Math.max(0, Number(event.target.value) || 0))}
            className="w-24 rounded-md border border-neutral-300 bg-surface px-3 py-2 text-sm text-secondary"
          />
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-text-light hover:bg-primary-dark transition-colors"
          >
            Refresh
          </button>
        </div>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {isLoading ? (
            <div className="rounded-xl border border-neutral-300 bg-surface px-5 py-4 text-sm text-neutral-500">
              Loading reports...
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {loadError}
            </div>
          ) : reportData ? (
            <>
              <DailyRevenueSummaryCard revenue={reportData.dailyRevenue} />
              <MonthlyRevenueReportCard
                records={reportData.monthlyRevenue}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
            </>
          ) : null}
        </section>

        <section className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          {reportData ? (
            <>
              <MembershipExpiryAlertList alerts={reportData.membershipExpiryAlerts} />
              <LowInventoryAlertList alerts={reportData.inventoryAlerts} />
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
