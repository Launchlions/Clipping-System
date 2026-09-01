export interface TaxSummary {
  calendarYear: number;
  grossEarningsCents: number;
  netPayoutsCents: number;
  platformFeesPaidCents: number;
  transactionsCount: number;
  thresholdMet: boolean; // IRS 1099-K reporting threshold ($600+)
  formStatus: 'NOT_REQUIRED' | 'GENERATED' | 'FILED';
}

export class TaxCalculator {
  static readonly IRS_THRESHOLD_CENTS = 600_00; // $600.00

  static computeSummary(grossEarningsCents: number, transactionsCount: number, year = 2026): TaxSummary {
    const platformFeesPaidCents = Math.round(grossEarningsCents * 0.15);
    const netPayoutsCents = grossEarningsCents - platformFeesPaidCents;
    const thresholdMet = grossEarningsCents >= this.IRS_THRESHOLD_CENTS;

    return {
      calendarYear: year,
      grossEarningsCents,
      netPayoutsCents,
      platformFeesPaidCents,
      transactionsCount,
      thresholdMet,
      formStatus: thresholdMet ? 'GENERATED' : 'NOT_REQUIRED',
    };
  }
}
