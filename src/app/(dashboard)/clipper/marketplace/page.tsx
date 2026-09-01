'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Users, 
  ChevronRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';

interface MarketplaceCampaign {
  id: string;
  title: string;
  brandName: string;
  niche: string;
  payoutType: 'PER_POST' | 'CPM' | 'HYBRID';
  payoutDesc: string;
  estEarningsCents: number;
  slotsRemaining: number;
  totalSlots: number;
  deadline: string;
  verifiedBrand: boolean;
}

const MOCK_MARKETPLACE: MarketplaceCampaign[] = [
  {
    id: 'camp-1',
    title: 'Summer Activewear Reel Blitz',
    brandName: 'ActiveWear Official',
    niche: 'Fitness',
    payoutType: 'HYBRID',
    payoutDesc: '$100 base + $15/1K views',
    estEarningsCents: 450_00,
    slotsRemaining: 3,
    totalSlots: 10,
    deadline: 'Sep 15, 2026',
    verifiedBrand: true,
  },
  {
    id: 'camp-2',
    title: 'Glow Serum Before & After Edit Challenge',
    brandName: 'Lumiere Beauty',
    niche: 'Beauty',
    payoutType: 'PER_POST',
    payoutDesc: '$250 flat per approved Reel',
    estEarningsCents: 250_00,
    slotsRemaining: 5,
    totalSlots: 8,
    deadline: 'Sep 18, 2026',
    verifiedBrand: true,
  },
  {
    id: 'camp-3',
    title: 'Minimalist EDC Tech Gear Review Clips',
    brandName: 'Apex Everyday',
    niche: 'Tech',
    payoutType: 'CPM',
    payoutDesc: '$20 CPM (up to $1,000 cap)',
    estEarningsCents: 600_00,
    slotsRemaining: 1,
    totalSlots: 5,
    deadline: 'Sep 12, 2026',
    verifiedBrand: true,
  },
  {
    id: 'camp-4',
    title: 'High-Protein Ready Meal Taste Test Cuts',
    brandName: 'MacroFit Nutrition',
    niche: 'Food',
    payoutType: 'PER_POST',
    payoutDesc: '$180 flat per approved Reel',
    estEarningsCents: 180_00,
    slotsRemaining: 6,
    totalSlots: 12,
    deadline: 'Sep 22, 2026',
    verifiedBrand: false,
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('ALL');
  const [selectedPayout, setSelectedPayout] = useState('ALL');

  const filtered = MOCK_MARKETPLACE.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.brandName.toLowerCase().includes(search.toLowerCase());
    const matchesNiche = selectedNiche === 'ALL' || item.niche === selectedNiche;
    const matchesPayout = selectedPayout === 'ALL' || item.payoutType === selectedPayout;
    return matchesSearch && matchesNiche && matchesPayout;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Campaign Marketplace</h1>
        <p className="text-sm text-text-muted">Browse verified brand briefs, claim creator slots, and download raw footage.</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-surface p-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns or brands..."
            className="w-full rounded-md border border-input-border bg-input-bg pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="rounded-md border border-input-border bg-input-bg px-2.5 py-1.5 text-xs text-text-primary focus:border-brand-accent focus:outline-none"
          >
            <option value="ALL">All Niches</option>
            <option value="Fitness">Fitness</option>
            <option value="Beauty">Beauty</option>
            <option value="Tech">Tech</option>
            <option value="Food">Food</option>
          </select>

          <select
            value={selectedPayout}
            onChange={(e) => setSelectedPayout(e.target.value)}
            className="rounded-md border border-input-border bg-input-bg px-2.5 py-1.5 text-xs text-text-primary focus:border-brand-accent focus:outline-none"
          >
            <option value="ALL">All Payout Types</option>
            <option value="PER_POST">Pay Per Post</option>
            <option value="CPM">Performance CPM</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Campaign Feed Table (Desktop) & Cards (Mobile) */}
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="hidden w-full text-sm sm:table">
          <thead className="border-b border-border bg-surface-raised text-text-muted text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Campaign &amp; Brand</th>
              <th className="px-4 py-3 text-left font-medium">Niche</th>
              <th className="px-4 py-3 text-left font-medium">Payout Model</th>
              <th className="px-4 py-3 text-right font-medium">Est. Earning</th>
              <th className="px-4 py-3 text-center font-medium">Slots Left</th>
              <th className="px-4 py-3 text-right font-medium">Deadline</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-surface-raised/60">
                <td className="px-4 py-3">
                  <div>
                    <Link href={`/clipper/campaigns/${item.id}`} className="font-semibold text-text-primary hover:text-brand-accent">
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-text-muted">{item.brandName}</span>
                      {item.verifiedBrand && <CheckCircle2 className="h-3 w-3 text-brand-accent" />}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-surface-raised px-2 py-0.5 text-xs text-text-secondary">
                    {item.niche}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary">{item.payoutDesc}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-status-success tabular-nums">
                  ~{formatCents(item.estEarningsCents)}
                </td>
                <td className="px-4 py-3 text-center font-mono text-xs">
                  <span className={item.slotsRemaining <= 2 ? 'text-status-warning font-semibold' : 'text-text-secondary'}>
                    {item.slotsRemaining} / {item.totalSlots}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs text-text-muted">{item.deadline}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/clipper/campaigns/${item.id}`}>
                    <Button size="sm" className="h-8 gap-1 text-xs bg-brand-accent hover:bg-brand-accent-hover text-white">
                      View &amp; Claim <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="divide-y divide-border sm:hidden">
          {filtered.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/clipper/campaigns/${item.id}`} className="font-semibold text-text-primary text-sm">
                    {item.title}
                  </Link>
                  <p className="text-xs text-text-muted mt-0.5">{item.brandName}</p>
                </div>
                <span className="font-mono text-xs font-semibold text-status-success tabular-nums">
                  ~{formatCents(item.estEarningsCents)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{item.niche} • {item.payoutDesc}</span>
                <span>{item.slotsRemaining} slots left</span>
              </div>

              <Link href={`/clipper/campaigns/${item.id}`} className="block">
                <Button size="sm" className="w-full text-xs bg-brand-accent text-white">
                  View &amp; Claim Slot
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
