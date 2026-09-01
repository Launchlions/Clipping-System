'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Search,
  Eye,
  Megaphone,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';
import { useCampaigns } from '@/lib/hooks/use-campaigns';
import { useToast } from '@/components/ui/toast';

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { campaigns } = useCampaigns();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'disputes' | 'telemetry'>('campaigns');

  const totalEscrow = campaigns.reduce((acc, c) => acc + c.budgetCents, 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + c.budgetSpentCents, 0);
  const totalSlotsClaimed = campaigns.reduce((acc, c) => acc + c.slotsClaimed, 0);
  const platformRevenue = Math.round(totalSpend * 0.15);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Operations &amp; Admin Console</h1>
          <p className="text-sm text-text-muted">Platform financial custody, global campaign monitoring, and dispute settlement.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/disputes">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Dispute Console
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Escrow in Custody" value={formatCents(totalEscrow)} subtitle="Across all active brand campaigns" />
        <MetricCard title="Disbursed Creator Payouts" value={formatCents(totalSpend)} subtitle="Released upon verified views" />
        <MetricCard title="15% Platform Take" value={formatCents(platformRevenue)} subtitle="Net realized marketplace fees" />
        <MetricCard title="Active Campaigns" value={campaigns.length.toString()} subtitle={`${totalSlotsClaimed} active creator slots`} />
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-border text-xs">
        {[
          { id: 'campaigns', label: `Global Campaigns (${campaigns.length})` },
          { id: 'disputes', label: 'Dispute Arbitration (0)' },
          { id: 'telemetry', label: 'Bot Velocity Shield' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`border-b-2 px-4 py-2.5 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-brand-accent text-brand-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Global Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          {campaigns.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-text-primary">No campaigns created yet</p>
              <p className="text-xs text-text-muted">When brands create campaigns, they will be tracked globally here.</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Campaign Title</th>
                  <th className="px-4 py-3 text-left font-medium">Brand</th>
                  <th className="px-4 py-3 text-left font-medium">Niche</th>
                  <th className="px-4 py-3 text-right font-medium">Budget</th>
                  <th className="px-4 py-3 text-center font-medium">Slots Claimed</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-text-primary">{c.title}</td>
                    <td className="px-4 py-3 text-text-secondary">{c.brandName}</td>
                    <td className="px-4 py-3">{c.niche}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-text-primary tabular-nums">
                      {formatCents(c.budgetCents)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{c.slotsClaimed} / {c.slotsTotal}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge type="campaign" status={c.status as any} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/brand/campaigns/${c.id}`}>
                        <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px] gap-1">
                          Inspect <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Disputes */}
      {activeTab === 'disputes' && (
        <div className="rounded-lg border border-border bg-surface p-12 text-center space-y-2">
          <CheckCircle2 className="mx-auto h-8 w-8 text-status-success" />
          <h3 className="text-sm font-semibold text-text-primary">All Dispute Queues Clear</h3>
          <p className="text-xs text-text-muted">Zero contested campaign submissions or pending arbitration cases.</p>
        </div>
      )}

      {/* Tab: Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Bot Velocity &amp; Anomaly Protection Engine</h3>
              <p className="text-xs text-text-muted">Multi-factor engagement ratio and view acceleration monitoring active.</p>
            </div>
            <span className="rounded bg-status-success/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-status-success">
              ● ANOMALY SHIELD OPERATIONAL
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded border border-border p-3 bg-surface-raised">
              <span className="text-text-muted">Anomaly Detection Sensitivity:</span>
              <p className="font-semibold text-text-primary mt-1">Strict (&lt;0.15% engagement threshold)</p>
            </div>
            <div className="rounded border border-border p-3 bg-surface-raised">
              <span className="text-text-muted">Polling Frequency:</span>
              <p className="font-semibold text-text-primary mt-1">Every 6 Hours (Meta Graph API)</p>
            </div>
            <div className="rounded border border-border p-3 bg-surface-raised">
              <span className="text-text-muted">Attribution Window:</span>
              <p className="font-semibold text-text-primary mt-1">7 to 14 Days Rolling</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
