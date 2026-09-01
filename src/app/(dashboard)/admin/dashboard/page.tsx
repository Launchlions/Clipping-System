'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Search,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';

interface DisputeItem {
  id: string;
  campaignTitle: string;
  brandName: string;
  clipperName: string;
  disputedAmountCents: number;
  reason: string;
  status: 'OPEN' | 'RESOLVED' | 'REFUNDED';
  openedAt: string;
}

interface FraudFlag {
  id: string;
  clipperName: string;
  reason: string;
  severity: 'HIGH' | 'MEDIUM';
  flaggedMetric: string;
  detectedAt: string;
}

const MOCK_DISPUTES: DisputeItem[] = [
  {
    id: 'disp-1',
    campaignTitle: 'Summer Activewear Reel Blitz',
    brandName: 'ActiveWear Official',
    clipperName: 'JakeEdits99',
    disputedAmountCents: 150_00,
    reason: 'Brand claims video was deleted from Instagram within 24 hours of payout.',
    status: 'OPEN',
    openedAt: 'Sep 01, 2026',
  },
  {
    id: 'disp-2',
    campaignTitle: 'Minimalist EDC Tech Gear Review Clips',
    brandName: 'Apex Everyday',
    clipperName: 'TechVibes',
    disputedAmountCents: 320_00,
    reason: 'Clipper claims view count frozen at 12k while live post has 45k.',
    status: 'OPEN',
    openedAt: 'Aug 30, 2026',
  },
];

const MOCK_FRAUD_FLAGS: FraudFlag[] = [
  {
    id: 'frd-1',
    clipperName: 'bot_clipper_sus',
    reason: '98% of views originated from single IP subnet in 15-minute spike.',
    severity: 'HIGH',
    flaggedMetric: 'Abnormal Velocity Spike (50K views / 10 mins)',
    detectedAt: 'Aug 31, 2026',
  },
];

export default function AdminDashboardPage() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  const resolveDispute = (id: string, resolution: 'RESOLVED' | 'REFUNDED') => {
    if (!overrideReason.trim()) {
      alert('Mandatory compliance audit note: Please specify the reason for this administrative action.');
      return;
    }

    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: resolution } : d))
    );
    alert(`Dispute ${id} marked as ${resolution}. Action logged to immutable audit ledger.`);
    setSelectedDispute(null);
    setOverrideReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Admin Operations &amp; Risk Console</h1>
        <p className="text-sm text-text-muted">
          Escrow dispute arbitration, fraud detection telemetry, and platform commission ledger.
        </p>
      </div>

      {/* High-level Platform Telemetry */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Escrow Custody" value="$48,500.00" subtitle="Across 34 active campaigns" />
        <MetricCard title="Platform Net Revenue" value="$7,275.00" trend={{ value: '+24%', direction: 'up' }} subtitle="15% commission YTD" />
        <MetricCard title="Open Disputes" value={`${disputes.filter((d) => d.status === 'OPEN').length}`} subtitle="Requires arbitration" />
        <MetricCard title="Active Fraud Flags" value="1" subtitle="Payout holds enforced" />
      </div>

      {/* Fraud Flag Alerts */}
      <div className="rounded-lg border border-status-danger/30 bg-status-danger-bg p-4 space-y-3">
        <div className="flex items-center gap-2 text-status-danger">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Automated Risk &amp; Fraud Detection</h3>
        </div>

        {MOCK_FRAUD_FLAGS.map((flag) => (
          <div key={flag.id} className="rounded-md border border-border bg-surface p-3 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-text-primary">Creator Flagged: @{flag.clipperName}</p>
              <p className="text-text-muted">{flag.reason} • <span className="font-mono text-status-danger">{flag.flaggedMetric}</span></p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => alert(`Frozen payouts for @${flag.clipperName}`)}>
                Freeze Payouts
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dispute Arbitration Queue */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary">Dispute Arbitration Queue</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Dispute ID</th>
                <th className="px-4 py-2.5 text-left font-medium">Campaign &amp; Parties</th>
                <th className="px-4 py-2.5 text-left font-medium">Dispute Reason</th>
                <th className="px-4 py-2.5 text-right font-medium">Disputed Amount</th>
                <th className="px-4 py-2.5 text-center font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {disputes.map((d) => (
                <tr key={d.id} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-text-muted">{d.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-text-primary">{d.campaignTitle}</p>
                    <p className="text-[11px] text-text-muted">{d.brandName} vs. @{d.clipperName}</p>
                  </td>
                  <td className="px-4 py-3 max-w-xs text-text-secondary">{d.reason}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-text-primary">
                    {formatCents(d.disputedAmountCents)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        d.status === 'OPEN' ? 'bg-status-warning-bg text-status-warning' : 'bg-status-success-bg text-status-success'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {d.status === 'OPEN' ? (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedDispute(d)}>
                        Arbitrate
                      </Button>
                    ) : (
                      <span className="text-[11px] text-text-muted">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Arbitration Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-text-primary">Arbitrate Dispute: {selectedDispute.id}</h3>
            <p className="text-xs text-text-muted">
              Disputed Amount: <strong className="font-mono">{formatCents(selectedDispute.disputedAmountCents)}</strong> for {selectedDispute.campaignTitle}
            </p>

            <div className="rounded-md border border-border bg-surface-raised p-3 text-xs">
              <p className="text-text-secondary">{selectedDispute.reason}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary">Mandatory Administrative Audit Note</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Detail why funds are being released to creator or refunded to brand..."
                rows={3}
                className="w-full rounded-md border border-input-border bg-input-bg p-2 text-xs text-text-primary focus:border-brand-accent focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedDispute(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => resolveDispute(selectedDispute.id, 'REFUNDED')}
              >
                Refund Brand
              </Button>
              <Button
                size="sm"
                className="bg-status-success text-white"
                onClick={() => resolveDispute(selectedDispute.id, 'RESOLVED')}
              >
                Release Payout to Creator
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
