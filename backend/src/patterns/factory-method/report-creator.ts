import { Member } from '@prisma/client';
import {
  AtRiskMemberDTO,
  AtRiskMemberFactory,
  AtRiskMemberInput,
  ExpiryAlertDTO,
  ExpiryAlertFactory,
  InventoryAlertDTO,
  InventoryAlertFactory,
  InventoryAlertInput,
  PeakUtilizationDTO,
  PeakUtilizationFactory,
  PeakUtilizationInput,
  RevenueForecastDTO,
  RevenueForecastFactory,
  RevenueForecastInput,
} from './report.factory';
import { ReportType } from './report.types';

export class ReportCreator {
  private static expiryAlertFactory = new ExpiryAlertFactory();
  private static inventoryAlertFactory = new InventoryAlertFactory();
  private static atRiskMemberFactory = new AtRiskMemberFactory();
  private static revenueForecastFactory = new RevenueForecastFactory();
  private static peakUtilizationFactory = new PeakUtilizationFactory();

  public static createReport(
    type: ReportType.EXPIRY_ALERT,
    data: Member,
  ): ExpiryAlertDTO;
  public static createReport(
    type: ReportType.INVENTORY_ALERT,
    data: InventoryAlertInput,
  ): InventoryAlertDTO;
  public static createReport(
    type: ReportType.AT_RISK_MEMBER,
    data: AtRiskMemberInput,
  ): AtRiskMemberDTO;
  public static createReport(
    type: ReportType.REVENUE_FORECAST,
    data: RevenueForecastInput,
  ): RevenueForecastDTO;
  public static createReport(
    type: ReportType.PEAK_UTILIZATION,
    data: PeakUtilizationInput,
  ): PeakUtilizationDTO;
  public static createReport<TInput, TOutput>(type: ReportType, data: TInput): TOutput;
  public static createReport(type: ReportType, data: unknown): unknown {
    switch (type) {
      case ReportType.EXPIRY_ALERT:
        if (!this.isMember(data)) {
          throw new Error('Invalid input for report type: EXPIRY_ALERT');
        }
        return this.expiryAlertFactory.create(data);
      case ReportType.INVENTORY_ALERT:
        if (!this.isInventoryAlertInput(data)) {
          throw new Error('Invalid input for report type: INVENTORY_ALERT');
        }
        return this.inventoryAlertFactory.create(data);
      case ReportType.AT_RISK_MEMBER:
        if (!this.isAtRiskMemberInput(data)) {
          throw new Error('Invalid input for report type: AT_RISK_MEMBER');
        }
        return this.atRiskMemberFactory.create(data);
      case ReportType.REVENUE_FORECAST:
        if (!this.isRevenueForecastInput(data)) {
          throw new Error('Invalid input for report type: REVENUE_FORECAST');
        }
        return this.revenueForecastFactory.create(data);
      case ReportType.PEAK_UTILIZATION:
        if (!this.isPeakUtilizationInput(data)) {
          throw new Error('Invalid input for report type: PEAK_UTILIZATION');
        }
        return this.peakUtilizationFactory.create(data);
      default:
        throw new Error(`No report factory registered for type: ${type}`);
    }
  }

  public static createReportBatch(
    type: ReportType.EXPIRY_ALERT,
    data: Member[],
  ): ExpiryAlertDTO[];
  public static createReportBatch(
    type: ReportType.INVENTORY_ALERT,
    data: InventoryAlertInput[],
  ): InventoryAlertDTO[];
  public static createReportBatch(
    type: ReportType.AT_RISK_MEMBER,
    data: AtRiskMemberInput[],
  ): AtRiskMemberDTO[];
  public static createReportBatch(
    type: ReportType.PEAK_UTILIZATION,
    data: PeakUtilizationInput[],
  ): PeakUtilizationDTO[];
  public static createReportBatch<TInput, TOutput>(
    type: ReportType,
    data: TInput[],
  ): TOutput[];
  public static createReportBatch(
    type: ReportType,
    data: unknown[],
  ): unknown[] {
    switch (type) {
      case ReportType.EXPIRY_ALERT:
        if (!data.every((item): item is Member => this.isMember(item))) {
          throw new Error('Invalid input for report type: EXPIRY_ALERT');
        }
        return data.map((item) => this.createReport(ReportType.EXPIRY_ALERT, item));
      case ReportType.INVENTORY_ALERT:
        if (!data.every((item): item is InventoryAlertInput => this.isInventoryAlertInput(item))) {
          throw new Error('Invalid input for report type: INVENTORY_ALERT');
        }
        return data.map((item) => this.createReport(ReportType.INVENTORY_ALERT, item));
      case ReportType.AT_RISK_MEMBER:
        if (!data.every((item): item is AtRiskMemberInput => this.isAtRiskMemberInput(item))) {
          throw new Error('Invalid input for report type: AT_RISK_MEMBER');
        }
        return data.map((item) => this.createReport(ReportType.AT_RISK_MEMBER, item));
      case ReportType.PEAK_UTILIZATION:
        if (!data.every((item): item is PeakUtilizationInput => this.isPeakUtilizationInput(item))) {
          throw new Error('Invalid input for report type: PEAK_UTILIZATION');
        }
        return data.map((item) => this.createReport(ReportType.PEAK_UTILIZATION, item));
      default:
        throw new Error(`No report factory registered for type: ${type}`);
    }
  }

  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private static isMember(value: unknown): value is Member {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      typeof value.id === 'string' &&
      typeof value.firstName === 'string' &&
      typeof value.lastName === 'string' &&
      typeof value.contactNumber === 'string'
    );
  }

  private static isInventoryAlertInput(value: unknown): value is InventoryAlertInput {
    if (!this.isRecord(value)) {
      return false;
    }

    if (typeof value.threshold !== 'number' || !this.isRecord(value.equipment)) {
      return false;
    }

    return (
      typeof value.equipment.id === 'string' &&
      typeof value.equipment.itemName === 'string' &&
      typeof value.equipment.quantity === 'number'
    );
  }

  private static isAtRiskMemberInput(value: unknown): value is AtRiskMemberInput {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      this.isMember(value.member) &&
      typeof value.daysUntilExpiry === 'number' &&
      (value.lastCheckInTime === null || value.lastCheckInTime instanceof Date)
    );
  }

  private static isRevenueForecastInput(value: unknown): value is RevenueForecastInput {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      (value.projection === 'CONSERVATIVE' || value.projection === 'OPTIMISTIC') &&
      typeof value.baselineActivePlanRevenue === 'number' &&
      typeof value.projectedChurnAdjustment === 'number' &&
      typeof value.forecastedRevenue === 'number'
    );
  }

  private static isPeakUtilizationInput(value: unknown): value is PeakUtilizationInput {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      typeof value.hour === 'number' &&
      typeof value.planName === 'string' &&
      typeof value.count === 'number'
    );
  }
}
