import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  DailyRevenueSummaryCard,
  LowInventoryAlertList,
  MembershipExpiryAlertList,
  MonthlyRevenueReportCard,
} from '../components/reports';
import { reportData } from '../components/reports/mockReportData';
import type { MonthlyRevenueRecord } from '../types/report';

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
  const latestMonthlyRecord = getLatestRecord(reportData.monthlyRevenue);
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    latestMonthlyRecord?.month ?? currentDate.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState(
    latestMonthlyRecord?.year ?? currentDate.getFullYear(),
  );
  const authRole = window.sessionStorage.getItem('authRole');

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

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DailyRevenueSummaryCard revenue={reportData.dailyRevenue} />
          <MonthlyRevenueReportCard
            records={reportData.monthlyRevenue}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <MembershipExpiryAlertList alerts={reportData.membershipExpiryAlerts} />
          <LowInventoryAlertList alerts={reportData.inventoryAlerts} />
        </section>
      </div>
    </div>
  );
}
