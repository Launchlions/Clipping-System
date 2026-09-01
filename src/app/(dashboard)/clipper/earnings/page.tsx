'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';
import { useToast } from '@/components/ui/toast';

interface PayoutRecord {
  id: string;
  campaignTitle: string;
  brandName: string;
  grossAmountCents: number;
  commissionCents: number;
  netAmountCents: number;
  paidAt: string;
  transferId: string;
  status: string;
}

export default function ClipperEarningsPage() {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('clipbridge_clipper_payouts');
      if (saved) {
        setPayouts(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const totalGross = payouts.reduce((acc, p) => acc + p.grossAmountCents, 0);
  const totalNet = payouts.reduce((acc, p) => acc + p.netAmountCents, 0);

  const handleDownloadTaxSummary = () => {
    toast({
      type: 'info',
      title: 'Tax Statement Download',
      description: 'Generating Form 1099-K annual gross earnings statement...',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Earnings &amp; Payouts</h1>
          <p className="text-sm text-text-muted">Direct Stripe Connect Express disbursements and Form 1099-K tax reporting.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleDownloadTaxSummary}>
            <Download className="h-3.5 w-3.5" /> Download 1099-K Summary
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Paid Out" value={formatCents(totalNet)} subtitle="Net received in bank account" />
        <MetricCard title="Gross Generated" value={formatCents(totalGross)} subtitle="Total campaign earnings" />
        <MetricCard title="Platform Split" value="85% Net" subtitle="15% transparent market fee" />
        <MetricCard title="Stripe Connect" value="ACTIVE" subtitle="Instant direct deposit" />
      </div>

      {/* Stripe Express Status Card */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-accent/10 text-brand-accent">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Stripe Connect Express Account</h3>
              <p className="text-text-muted">Account: <strong className="text-text-secondary">Standard Direct Deposit (USD)</strong></p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded bg-status-success/10 text-status-success px-2 py-0.5 font-semibold text-[10px]">
            <CheckCircle2 className="h-3 w-3" /> VERIFIED &amp; ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-text-muted">
          <div>
            <span className="block font-medium text-text-secondary">Payout Schedule:</span>
            <span>Automated on 7-Day Attribution Close</span>
          </div>
          <div>
            <span className="block font-medium text-text-secondary">Tax Form (W-9):</span>
            <span className="text-status-success font-medium">Approved on file</span>
          </div>
          <div>
            <span className="block font-medium text-text-secondary">Connected Banking:</span>
            <span>Checking •••• 4128</span>
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">Disbursement History</h3>
        </div>

        {payouts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-text-primary">No payouts disbursed yet</p>
            <p className="text-xs text-text-muted">Claim briefs from the marketplace and submit approved edits to start earning.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Campaign</th>
                  <th className="px-4 py-2.5 text-left font-medium">Transfer Reference</th>
                  <th className="px-4 py-2.5 text-right font-medium">Gross</th>
                  <th className="px-4 py-2.5 text-right font-medium">15% Fee</th>
                  <th className="px-4 py-2.5 text-right font-medium">Net Payout</th>
                  <th className="px-4 py-2.5 text-right font-medium">Date</th>
                  <th className="px-4 py-2.5 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">{p.campaignTitle}</p>
                      <p className="text-[11px] text-text-muted">{p.brandName}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{p.transferId}</td>
                    <td className="px-4 py-3 text-right font-mono text-text-secondary tabular-nums">
                      {formatCents(p.grossAmountCents)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-muted tabular-nums">
                      -{formatCents(p.commissionCents)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-status-success tabular-nums">
                      +{formatCents(p.netAmountCents)}
                    </td>
                    <td className="px-4 py-3 text-right text-text-muted">{p.paidAt}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge type="submission" status={p.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
