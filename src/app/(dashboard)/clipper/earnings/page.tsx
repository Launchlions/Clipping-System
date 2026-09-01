'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';

export default function ClipperEarningsPage() {
  const [taxSubmitted, setTaxSubmitted] = useState(true);

  const earnings = {
    totalPaidCents: 2450_00,
    pendingPayoutsCents: 350_00,
    ytdEarningsCents: 2450_00,
    reportingThresholdCents: 5000_00,
  };

  const payoutHistory = [
    {
      id: 'po-1',
      campaignTitle: 'High-Protein Ready Meal Taste Test Cuts',
      brandName: 'MacroFit Nutrition',
      grossAmountCents: 180_00,
      commissionCents: 27_00,
      netAmountCents: 153_00,
      paidAt: 'Aug 21, 2026',
      transferId: 'tr_1Pf98x2eZvKYlo2CL1940x',
      status: 'COMPLETED',
    },
    {
      id: 'po-2',
      campaignTitle: 'Wireless Noise-Canceling Earbuds Demo',
      brandName: 'SonicTech Labs',
      grossAmountCents: 320_00,
      commissionCents: 48_00,
      netAmountCents: 272_00,
      paidAt: 'Aug 04, 2026',
      transferId: 'tr_1Pdp1x2eZvKYlo2CL8812a',
      status: 'COMPLETED',
    },
    {
      id: 'po-3',
      campaignTitle: 'Summer Fit Challenge Promo Reel',
      brandName: 'ActiveWear Official',
      grossAmountCents: 400_00,
      commissionCents: 60_00,
      netAmountCents: 340_00,
      paidAt: 'Jul 22, 2026',
      transferId: 'tr_1Pax7x2eZvKYlo2CL4119k',
      status: 'COMPLETED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Earnings &amp; Payouts</h1>
        <p className="text-sm text-text-muted">Direct deposits via Stripe Connect Express and year-end tax documentation.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Lifetime Paid" value={formatCents(earnings.totalPaidCents)} subtitle="Transferred to your bank" />
        <MetricCard title="In Escrow / Pending" value={formatCents(earnings.pendingPayoutsCents)} subtitle="Awaiting attribution window" />
        <MetricCard title="2026 YTD Earnings" value={formatCents(earnings.ytdEarningsCents)} subtitle="Tax Year 2026" />
        <MetricCard title="Platform Commission" value="15.0%" subtitle="Transparent marketplace fee" />
      </div>

      {/* Stripe Connect & Tax Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Stripe Express Connection */}
        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-accent" />
              <h3 className="text-sm font-semibold text-text-primary">Payout Account</h3>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-status-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> Stripe Express Active
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Bank account ending in <strong className="text-text-secondary font-mono">•••• 4821</strong> (Chase Bank). Payouts transfer automatically within 24 hours of attribution completion.
          </p>
          <Button variant="outline" size="sm" className="text-xs gap-1">
            <ExternalLink className="h-3.5 w-3.5" /> Manage Stripe Express Dashboard
          </Button>
        </div>

        {/* Tax Information Box (1099-K / W-9) */}
        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-accent" />
              <h3 className="text-sm font-semibold text-text-primary">Tax Reporting (Form W-9 / 1099-K)</h3>
            </div>
            <StatusBadge type="kyc" status="VERIFIED" />
          </div>
          <p className="text-xs text-text-muted">
            W-9 form submitted and verified. You have earned <strong className="text-text-secondary font-mono">{formatCents(earnings.ytdEarningsCents)}</strong> of the $5,000 threshold for mandatory 1099-K reporting.
          </p>
          <div className="w-full bg-surface-raised h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-accent h-full rounded-full"
              style={{ width: `${(earnings.ytdEarningsCents / earnings.reportingThresholdCents) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">Payout Statement Ledger</h3>
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download Tax Statement (PDF)
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Campaign &amp; Brand</th>
                <th className="px-4 py-2.5 text-left font-medium">Transfer Reference</th>
                <th className="px-4 py-2.5 text-right font-medium">Gross Earned</th>
                <th className="px-4 py-2.5 text-right font-medium">Platform Fee (15%)</th>
                <th className="px-4 py-2.5 text-right font-medium">Net Payout</th>
                <th className="px-4 py-2.5 text-right font-medium">Date</th>
                <th className="px-4 py-2.5 text-center font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {payoutHistory.map((row) => (
                <tr key={row.id} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-text-primary">{row.campaignTitle}</p>
                    <p className="text-[11px] text-text-muted">{row.brandName}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{row.transferId}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-text-secondary">
                    {formatCents(row.grossAmountCents)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-text-muted">
                    -{formatCents(row.commissionCents)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-status-success">
                    {formatCents(row.netAmountCents)}
                  </td>
                  <td className="px-4 py-3 text-right text-text-muted">{row.paidAt}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => alert(`Downloading PDF invoice for ${row.transferId}`)}
                      className="text-brand-accent hover:underline text-[11px] font-medium"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
