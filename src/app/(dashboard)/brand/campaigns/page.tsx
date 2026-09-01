'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  Pause, 
  Play, 
  Eye, 
  Users, 
  DollarSign,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { MetricCard } from '@/components/shared/metric-card';
import { formatCents } from '@/lib/utils/constants';
import { useToast } from '@/components/ui/toast';
import { useCampaigns } from '@/lib/hooks/use-campaigns';

export default function BrandCampaignsPage() {
  const { toast } = useToast();
  const { campaigns, loading, toggleStatus } = useCampaigns();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [nicheFilter, setNicheFilter] = useState('ALL');

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.niche.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesNiche = nicheFilter === 'ALL' || c.niche === nicheFilter;
    return matchesSearch && matchesStatus && matchesNiche;
  });

  const handleToggle = (id: string, currentStatus: string, title: string) => {
    toggleStatus(id);
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    toast({
      type: 'info',
      title: `Campaign ${nextStatus === 'ACTIVE' ? 'Resumed' : 'Paused'}`,
      description: `${title} is now ${nextStatus.toLowerCase()}.`,
    });
  };

  const totalBudget = campaigns.reduce((acc, c) => acc + c.budgetCents, 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + c.budgetSpentCents, 0);
  const activeCount = campaigns.filter((c) => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Campaign Management</h1>
          <p className="text-sm text-text-muted">
            Monitor active campaigns, approve creator slots, and track real-time video performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/brand/campaigns/new">
            <Button size="sm" className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs gap-1.5 shadow-sm">
              <Plus className="h-4 w-4" /> Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Active Campaigns" value={activeCount.toString()} subtitle="Running creator slots" />
        <MetricCard title="Total Escrow Allocated" value={formatCents(totalBudget)} subtitle="Secured in Stripe custody" />
        <MetricCard title="Total Spent" value={formatCents(totalSpent)} subtitle="Disbursed upon view milestones" />
        <MetricCard title="Avg. CPM Efficiency" value="$12.50" subtitle="Benchmark vs Paid Ads: $26.50" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-surface p-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full rounded-md border border-input-border bg-input-bg pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input-border bg-input-bg px-2.5 py-1.5 text-xs text-text-primary focus:border-brand-accent focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="DRAFT">Draft</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={nicheFilter}
            onChange={(e) => setNicheFilter(e.target.value)}
            className="rounded-md border border-input-border bg-input-bg px-2.5 py-1.5 text-xs text-text-primary focus:border-brand-accent focus:outline-none"
          >
            <option value="ALL">All Niches</option>
            <option value="Fitness">Fitness</option>
            <option value="Beauty">Beauty</option>
            <option value="Tech">Tech</option>
            <option value="Fashion">Fashion</option>
            <option value="Food">Food</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading active campaigns...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-text-primary">No campaigns match your search filter</p>
            <Link href="/brand/campaigns/new">
              <Button size="sm" className="bg-brand-accent text-white text-xs">Create New Campaign</Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Campaign Title</th>
                <th className="px-4 py-3 text-left font-medium">Niche &amp; Model</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Budget &amp; Spend</th>
                <th className="px-4 py-3 text-center font-medium">Slots Claimed</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map((camp) => (
                <tr key={camp.id} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/brand/campaigns/${camp.id}`} className="font-semibold text-text-primary hover:text-brand-accent transition-colors">
                      {camp.title}
                    </Link>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {camp.brandName} &bull; ID: {camp.id}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-text-secondary">{camp.niche}</span>
                    <p className="text-[11px] text-text-muted">
                      {camp.payoutType === 'HYBRID'
                        ? `$${(camp.payoutAmountCents / 100).toFixed(0)} base + $${(camp.cpmRateCents / 100).toFixed(0)} CPM`
                        : camp.payoutType === 'CPM'
                        ? `$${(camp.cpmRateCents / 100).toFixed(0)} CPM`
                        : `$${(camp.payoutAmountCents / 100).toFixed(0)} flat`}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="campaign" status={camp.status as any} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    <p className="font-semibold text-text-primary">{formatCents(camp.budgetCents)}</p>
                    <p className="text-[11px] text-text-muted">Spent: {formatCents(camp.budgetSpentCents)}</p>
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    <span className="font-semibold text-text-secondary">
                      {camp.slotsClaimed} / {camp.slotsTotal}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(camp.id, camp.status, camp.title)}
                        className="h-7 px-2 text-[11px] gap-1 text-text-muted hover:text-text-primary"
                      >
                        {camp.status === 'ACTIVE' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        {camp.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                      </Button>

                      <Link href={`/brand/campaigns/${camp.id}`}>
                        <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px] gap-1">
                          Inspect <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
