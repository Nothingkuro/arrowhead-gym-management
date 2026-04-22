import { Member, MemberStatus, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import {
  AtRiskMemberDTO,
  AtRiskMemberInput,
  ExpiryAlertDTO,
  InventoryAlertDTO,
  InventoryAlertInput,
  PeakUtilizationDTO,
  PeakUtilizationInput,
  RevenueForecastDTO,
  RevenueForecastInput,
} from '../patterns/factory-method/report.factory';
import { ReportCreator } from '../patterns/factory-method/report-creator';
import { ReportType } from '../patterns/factory-method/report.types';
import revenueContext from './revenueStrategy';
import revenueForecastContext, { ForecastMode } from './revenueForecast.strategy';

const DAYS_UNTIL_RISK_EXPIRY = 14;
const DAYS_WITHOUT_ATTENDANCE = 10;
const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

type AtRiskCache = {
  data: AtRiskMemberDTO[];
  updatedAt: string;
};

type PeakUtilizationRow = {
  hour: number;
  planName: string;
  count: number;
};

export class AnalyticsService {
  private atRiskCache: AtRiskCache | null = null;

  private startOfTodayLocal(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  private toNumber(value: { toString(): string } | number | string): number {
    return Number(value);
  }

  private calculateDaysUntilExpiry(expiryDate: Date): number {
    return Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / MILLIS_PER_DAY));
  }

  async getDailyRevenueSummary(): Promise<{
    cash: number;
    gcash: number;
    total: number;
    date: string;
  }> {
    const start = this.startOfTodayLocal();
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const payments = await prisma.payment.findMany({
      where: {
        transactionDate: {
          gte: start,
          lt: end,
        },
      },
      select: {
        amount: true,
        paymentMethod: true,
      },
    });

    const summary = revenueContext.aggregate(
      payments.map((payment) => ({
        amount: this.toNumber(payment.amount),
        paymentMethod: payment.paymentMethod,
      })),
    );

    return {
      cash: summary.cash,
      gcash: summary.gcash,
      total: summary.cash + summary.gcash,
      date: start.toISOString(),
    };
  }

  async getMonthlyRevenueRecords(): Promise<Array<{ month: number; year: number; total: number }>> {
    const payments = await prisma.payment.findMany({
      select: {
        amount: true,
        transactionDate: true,
      },
      orderBy: {
        transactionDate: 'asc',
      },
    });

    const totals = new Map<string, { month: number; year: number; total: number }>();

    for (const payment of payments) {
      const date = new Date(payment.transactionDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${String(month).padStart(2, '0')}`;

      const current = totals.get(key) ?? { month, year, total: 0 };
      current.total += this.toNumber(payment.amount);
      totals.set(key, current);
    }

    return Array.from(totals.values()).sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      return a.month - b.month;
    });
  }

  async getUpcomingExpirations(days: number): Promise<ExpiryAlertDTO[]> {
    const start = this.startOfTodayLocal();
    const end = new Date(start);
    end.setDate(end.getDate() + days);

    const members = await prisma.member.findMany({
      where: {
        status: MemberStatus.ACTIVE,
        expiryDate: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        expiryDate: 'asc',
      },
    });

    return ReportCreator.createReportBatch<Member, ExpiryAlertDTO>(
      ReportType.EXPIRY_ALERT,
      members.filter((member) => member.expiryDate),
    );
  }

  async getLowInventoryAlerts(threshold: number): Promise<InventoryAlertDTO[]> {
    const equipment = await prisma.equipment.findMany({
      where: {
        quantity: {
          lt: threshold,
        },
      },
      orderBy: {
        quantity: 'asc',
      },
    });

    return ReportCreator.createReportBatch<InventoryAlertInput, InventoryAlertDTO>(
      ReportType.INVENTORY_ALERT,
      equipment.map((item) => ({ equipment: item, threshold })),
    );
  }

  async calculateAtRiskMembers(): Promise<AtRiskMemberDTO[]> {
    const start = this.startOfTodayLocal();
    const expiryCutoff = new Date(start);
    expiryCutoff.setDate(expiryCutoff.getDate() + DAYS_UNTIL_RISK_EXPIRY);

    const attendanceCutoff = new Date();
    attendanceCutoff.setDate(attendanceCutoff.getDate() - DAYS_WITHOUT_ATTENDANCE);

    const atRiskMembers = await prisma.member.findMany({
      where: {
        status: MemberStatus.ACTIVE,
        expiryDate: {
          gte: start,
          lte: expiryCutoff,
        },
        attendances: {
          none: {
            checkInTime: {
              gte: attendanceCutoff,
            },
          },
        },
      },
      orderBy: {
        expiryDate: 'asc',
      },
      include: {
        attendances: {
          select: {
            checkInTime: true,
          },
          orderBy: {
            checkInTime: 'desc',
          },
          take: 1,
        },
      },
    });

    const inputs: AtRiskMemberInput[] = atRiskMembers
      .filter((member) => member.expiryDate)
      .map((member) => ({
        member,
        daysUntilExpiry: this.calculateDaysUntilExpiry(member.expiryDate as Date),
        lastCheckInTime: member.attendances[0]?.checkInTime ?? null,
      }));

    return ReportCreator.createReportBatch<AtRiskMemberInput, AtRiskMemberDTO>(
      ReportType.AT_RISK_MEMBER,
      inputs,
    );
  }

  async refreshAtRiskMembersCache(): Promise<void> {
    const data = await this.calculateAtRiskMembers();
    this.atRiskCache = {
      data,
      updatedAt: new Date().toISOString(),
    };
  }

  async getAtRiskMembers(useCache = true): Promise<{ items: AtRiskMemberDTO[]; updatedAt: string }> {
    if (!useCache || !this.atRiskCache) {
      await this.refreshAtRiskMembersCache();
    }

    if (!this.atRiskCache) {
      return { items: [], updatedAt: new Date().toISOString() };
    }

    return {
      items: this.atRiskCache.data,
      updatedAt: this.atRiskCache.updatedAt,
    };
  }

  async getMonthlyRevenueForecast(mode: ForecastMode): Promise<RevenueForecastDTO> {
    const [{ _sum }, expiringMembers] = await Promise.all([
      prisma.membershipPlan.aggregate({
        where: { isActive: true },
        _sum: { price: true },
      }),
      prisma.member.findMany({
        where: {
          status: MemberStatus.ACTIVE,
          expiryDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1),
          },
        },
        include: {
          attendances: {
            where: {
              checkInTime: {
                gte: new Date(Date.now() - 30 * MILLIS_PER_DAY),
              },
            },
            select: { id: true },
            take: 1,
          },
          payments: {
            orderBy: {
              transactionDate: 'desc',
            },
            take: 1,
            include: {
              plan: {
                select: {
                  price: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const baselineActivePlanRevenue = this.toNumber(_sum.price ?? 0);

    const projectedChurnAdjustment = expiringMembers.reduce((total, member) => {
      if (member.attendances.length > 0) {
        return total;
      }

      const latestPlanPrice = member.payments[0]?.plan.price;
      return total + this.toNumber(latestPlanPrice ?? 0);
    }, 0);

    const projected = revenueForecastContext.project(mode, {
      baselineActivePlanRevenue,
      projectedChurnAdjustment,
    });

    const input: RevenueForecastInput = {
      projection: projected.projection,
      baselineActivePlanRevenue: projected.baselineActivePlanRevenue,
      projectedChurnAdjustment: projected.projectedChurnAdjustment,
      forecastedRevenue: projected.forecastedRevenue,
    };

    return ReportCreator.createReport<RevenueForecastInput, RevenueForecastDTO>(
      ReportType.REVENUE_FORECAST,
      input,
    );
  }

  async getPeakUtilizationByPlan(): Promise<PeakUtilizationDTO[]> {
    const rows = await prisma.$queryRaw<PeakUtilizationRow[]>(Prisma.sql`
      SELECT
        CAST(DATE_PART('hour', a."checkInTime") AS INTEGER) AS "hour",
        COALESCE(mp.name, 'Unassigned') AS "planName",
        CAST(COUNT(*) AS INTEGER) AS "count"
      FROM "attendances" a
      JOIN "members" m
        ON m.id = a."memberId"
      LEFT JOIN LATERAL (
        SELECT p."planId"
        FROM "payments" p
        WHERE p."memberId" = m.id
        ORDER BY p."transactionDate" DESC
        LIMIT 1
      ) latest_payment
        ON TRUE
      LEFT JOIN "membership_plans" mp
        ON mp.id = latest_payment."planId"
      GROUP BY 1, 2
      ORDER BY 1 ASC, 2 ASC
    `);

    return ReportCreator.createReportBatch<PeakUtilizationInput, PeakUtilizationDTO>(
      ReportType.PEAK_UTILIZATION,
      rows.map((row) => ({
        hour: Number(row.hour),
        planName: row.planName,
        count: Number(row.count),
      })),
    );
  }

  async getReportsOverview(threshold: number, days: number): Promise<{
    dailyRevenue: {
      cash: number;
      gcash: number;
      total: number;
      date: string;
    };
    monthlyRevenue: Array<{ month: number; year: number; total: number }>;
    membershipExpiryAlerts: ExpiryAlertDTO[];
    inventoryAlerts: InventoryAlertDTO[];
    atRiskMembers: AtRiskMemberDTO[];
    revenueForecast: RevenueForecastDTO;
    peakUtilization: PeakUtilizationDTO[];
  }> {
    const [
      dailyRevenue,
      monthlyRevenue,
      membershipExpiryAlerts,
      inventoryAlerts,
      atRiskMembers,
      revenueForecast,
      peakUtilization,
    ] = await Promise.all([
      this.getDailyRevenueSummary(),
      this.getMonthlyRevenueRecords(),
      this.getUpcomingExpirations(days),
      this.getLowInventoryAlerts(threshold),
      this.calculateAtRiskMembers(),
      this.getMonthlyRevenueForecast('CONSERVATIVE'),
      this.getPeakUtilizationByPlan(),
    ]);

    return {
      dailyRevenue,
      monthlyRevenue,
      membershipExpiryAlerts,
      inventoryAlerts,
      atRiskMembers,
      revenueForecast,
      peakUtilization,
    };
  }
}

export const analyticsService = new AnalyticsService();

export default analyticsService;
