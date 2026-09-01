'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, FileCheck, DollarSign, TrendingUp, ChevronRight, Lock } from 'lucide-react';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { formatCents } from '@/lib/utils/constants';
import { useCampaigns } from '@/lib/hooks/use-campaigns';

export default function ClipperDashboard() {
  const { campaigns, loading } = useCampaigns();

  const claimedCampaigns = campaigns.filter((c) => c.slotsClaimed > 0);
  const totalEstEarnings = claimedCampaigns.reduce((acc, c) => acc + (c.budgetCents / Math.max(1, c.slotsTotal)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Creator Dashboard</h1>
          <p className="text-sm text-text-muted">
            Track your reserved slots, active submissions, and performance payouts.
          </p>
        </div>
        <Link href="/clipper/marketplace">
          <Button size="sm" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs gap-1.5 shadow-sm">
            <ShoppingBag className="h-4 w-4" /> Browse Briefs
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Reserved Slots"
          value={claimedCampaigns.length.toString()}
          subtitle="48h slot duration"
        />
        <MetricCard
          title="Est. Pipeline Earnings"
          value={formatCents(totalEstEarnings)}
          subtitle="85% net creator split"
        />
        <MetricCard
          title="Marketplace Opportunities"
          value={campaigns.length.toString()}
          subtitle="Verified brand briefs"
        />
        <MetricCard
          title="Stripe Payout Status"
          value="CONNECTED"
          subtitle="Express instant transfers"
        />
      </div>

      {/* Available marketplace campaigns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            Marketplace Briefs ({campaigns.length})
          </h2>
          <Link href="/clipper/marketplace" className="text-xs text-brand-accent hover:underline font-medium">
            View all briefs &rarr;
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          {loading ? (
            <div className="p-8 text-center text-xs text-text-muted">Loading briefs...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted space-y-2">
              <p>No active briefs currently open.</p>
              <p className="text-[11px]">When brands launch campaigns, they appear here instantly.</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Campaign</th>
                  <th className="px-4 py-2.5 text-left font-medium">Niche</th>
                  <th className="px-4 py-2.5 text-left font-medium">Payout Model</th>
                  <th className="px-4 py-2.5 text-right font-medium">Est. Earning</th>
                  <th className="px-4 py-2.5 text-center font-medium">Slots Left</th>
                  <th className="px-4 py-2.5 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {campaigns.map((camp) => {
                  const slotsLeft = Math.max(0, camp.slotsTotal - camp.slotsClaimed);
                  return (
                    <tr
                      key={camp.id}
                      className="hover:bg-surface-raised/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/clipper/campaigns/${camp.id}`}
                          className="font-semibold text-text-primary hover:text-brand-accent"
                        >
                          {camp.title}
                        </Link>
                        <p className="text-[11px] text-text-muted">{camp.brandName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                          {camp.niche}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {camp.payoutType}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-status-success tabular-nums">
                        ~{formatCents(camp.budgetCents / Math.max(1, camp.slotsTotal))}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs">
                        {slotsLeft} / {camp.slotsTotal}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/clipper/campaigns/${camp.id}`}>
                          <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px] gap-1">
                            Inspect <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
