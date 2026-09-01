'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Megaphone, 
  ChevronRight, 
  MoreHorizontal, 
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

interface CampaignItem {
  id: string;
  title: string;
  niche: string;
  payoutType: 'PER_POST' | 'CPM' | 'HYBRID';
  payoutDesc: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'COMPLETED';
  budgetCents: number;
  budgetSpentCents: number;
  escrowBalanceCents: number;
  submissionsCount: number;
  verifiedViews: number;
  slotsClaimed: number;
  slotsTotal: number;
  createdAt: string;
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'camp-1',
    title: 'Summer Activewear Reel Blitz',
    niche: 'Fitness',
    payoutType: 'HYBRID',
    payoutDesc: '$100 base + $15/1K views',
    status: 'ACTIVE',
    budgetCents: 5000_00,
    budgetSpentCents: 2150_00,
    escrowBalanceCents: 2850_00,
    submissionsCount: 14,
    verifiedViews: 148500,
    slotsClaimed: 7,
    slotsTotal: 10,
    createdAt: 'Aug 20, 2026',
  },
  {
    id: 'camp-2',
    title: 'Glow Serum Before & After Challenge',
    niche: 'Beauty',
    payoutType: 'PER_POST',
    payoutDesc: '$250 flat per approved Reel',
    status: 'ACTIVE',
    budgetCents: 3000_00,
    budgetSpentCents: 1250_00,
    escrowBalanceCents: 1750_00,
    submissionsCount: 8,
    verifiedViews: 86400,
    slotsClaimed: 5,
    slotsTotal: 8,
    createdAt: 'Aug 25, 2026',
  },
  {
    id: 'camp-3',
    title: 'Minimalist EDC Tech Gear Review Clips',
    niche: 'Tech',
    payoutType: 'CPM',
    payoutDesc: '$20 CPM (up to $1,000 cap)',
    status: 'PAUSED',
    budgetCents: 4000_00,
    budgetSpentCents: 850_00,
    escrowBalanceCents: 3150_00,
    submissionsCount: 6,
    verifiedViews: 42500,
    slotsClaimed: 4,
    slotsTotal: 5,
    createdAt: 'Aug 28, 2026',
  },
  {
    id: 'camp-4',
    title: 'Fall Winter Thermal Layering Series',
    niche: 'Fashion',
    payoutType: 'HYBRID',
    payoutDesc: '$120 base + $10/1K views',
    status: 'DRAFT',
    budgetCents: 6000_00,
    budgetSpentCents: 0,
    escrowBalanceCents: 6000_00,
    submissionsCount: 0,
    verifiedViews: 0,
    slotsClaimed: 0,
    slotsTotal: 12,
    createdAt: 'Sep 01, 2026',
  },
];

export default function BrandCampaignsPage() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [nicheFilter, setNicheFilter] = useState('ALL');

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.niche.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesNiche = nicheFilter === 'ALL' || c.niche === nicheFilter;
    return matchesSearch && matchesStatus && matchesNiche;
  });

  const toggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        toast({
          type: 'info',
          title: `Campaign ${newStatus === 'ACTIVE' ? 'Resumed' : 'Paused'}`,
          description: `${c.title} is now ${newStatus.toLowerCase()}.`,
        });
        return { ...c, status: newStatus };
      })
    );
  };

  const totalEscrow = campaigns.reduce((acc, c) => acc + c.escrowBalanceCents, 0);
  const totalViews = campaigns.reduce((acc, c) => acc + c.verifiedViews, 0);
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
        <MetricCard title="Total Escrow Held" value={formatCents(totalEscrow)} subtitle="Secured via Stripe" />
        <MetricCard title="Total Verified Views" value={totalViews.toLocaleString()} subtitle="Across active Reels" />
        <MetricCard title="Avg. CPM Efficiency" value="$14.48" subtitle="Industry benchmark: $22.00" />
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
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <table className="w-full text-xs">
          <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Campaign Title</th>
              <th className="px-4 py-3 text-left font-medium">Niche &amp; Terms</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Budget &amp; Spend</th>
              <th className="px-4 py-3 text-center font-medium">Slots</th>
              <th className="px-4 py-3 text-right font-medium">Verified Views</th>
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
                  <p className="text-[11px] text-text-muted mt-0.5">Created {camp.createdAt}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-text-secondary">{camp.niche}</span>
                  <p className="text-[11px] text-text-muted">{camp.payoutDesc}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge type="campaign" status={camp.status} />
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
                <td className="px-4 py-3 text-right font-mono font-bold text-text-primary tabular-nums">
                  {camp.verifiedViews.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {camp.status === 'ACTIVE' || camp.status === 'PAUSED' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(camp.id)}
                        className="h-7 px-2 text-[11px] gap-1 text-text-muted hover:text-text-primary"
                      >
                        {camp.status === 'ACTIVE' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        {camp.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                      </Button>
                    ) : null}

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
      </div>
    </div>
  );
}
