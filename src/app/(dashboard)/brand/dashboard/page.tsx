'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Megaphone, Eye, Users, DollarSign, ChevronRight } from 'lucide-react';
import { MetricCard } from '@/components/shared/metric-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { formatCents } from '@/lib/utils/constants';
import { useCampaigns } from '@/lib/hooks/use-campaigns';

export default function BrandDashboard() {
  const { campaigns, loading } = useCampaigns();

  const totalEscrow = campaigns.reduce((acc, c) => acc + c.budgetCents, 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + c.budgetSpentCents, 0);
  const totalSlotsClaimed = campaigns.reduce((acc, c) => acc + c.slotsClaimed, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted">
            Overview of your active campaigns, escrow balances, and reach.
          </p>
        </div>
        <Link href="/brand/campaigns/new">
          <Button size="sm" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" /> New Campaign
          </Button>
        </Link>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Escrow Balance"
          value={formatCents(totalEscrow)}
          subtitle={`Across ${campaigns.length} campaigns`}
        />
        <MetricCard
          title="Total Spend"
          value={formatCents(totalSpent)}
          trend={{ value: "+14.3%", direction: "up" }}
          subtitle="Disbursed upon performance"
        />
        <MetricCard
          title="Total Verified Reach"
          value="1.84M"
          trend={{ value: "+22.4%", direction: "up" }}
          subtitle="Across active Reels"
        />
        <MetricCard
          title="Active Creators"
          value={totalSlotsClaimed.toString()}
          trend={{ value: "+4", direction: "up" }}
          subtitle="Slots claimed &amp; active"
        />
      </div>

      {/* Active campaigns table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            Active Campaigns ({campaigns.length})
          </h2>
          <Link href="/brand/campaigns" className="text-xs text-brand-accent hover:underline font-medium">
            View all &rarr;
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          {loading ? (
            <div className="p-8 text-center text-xs text-text-muted">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted space-y-2">
              <p>No active campaigns yet.</p>
              <Link href="/brand/campaigns/new">
                <Button size="sm" className="bg-brand-accent text-white text-xs">Create First Campaign</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Campaign Title</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Budget</th>
                  <th className="px-4 py-2.5 text-right font-medium">Spent</th>
                  <th className="px-4 py-2.5 text-center font-medium">Slots Claimed</th>
                  <th className="px-4 py-2.5 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {campaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    className="hover:bg-surface-raised/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/brand/campaigns/${camp.id}`}
                        className="font-semibold text-text-primary hover:text-brand-accent"
                      >
                        {camp.title}
                      </Link>
                      <p className="text-[11px] text-text-muted">{camp.niche}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type="campaign" status={camp.status as any} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-text-primary tabular-nums">
                      {formatCents(camp.budgetCents)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-secondary tabular-nums">
                      {formatCents(camp.budgetSpentCents)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-text-secondary">
                      {camp.slotsClaimed} / {camp.slotsTotal}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/brand/campaigns/${camp.id}`}>
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
      </div>
    </div>
  );
}
