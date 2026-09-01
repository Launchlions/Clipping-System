'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  DollarSign, 
  Users, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCents } from '@/lib/utils/constants';
import { useCampaigns } from '@/lib/hooks/use-campaigns';
import { useToast } from '@/components/ui/toast';

export default function MarketplacePage() {
  const { toast } = useToast();
  const { campaigns, loading, claimSlot } = useCampaigns();
  const [search, setSearch] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('ALL');
  const [selectedPayout, setSelectedPayout] = useState('ALL');

  const filtered = campaigns.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.brandName.toLowerCase().includes(search.toLowerCase());
    const matchesNiche = selectedNiche === 'ALL' || item.niche.toLowerCase() === selectedNiche.toLowerCase();
    const matchesPayout = selectedPayout === 'ALL' || item.payoutType === selectedPayout;
    return matchesSearch && matchesNiche && matchesPayout;
  });

  const handleClaim = async (campaignId: string, title: string) => {
    try {
      await claimSlot(campaignId);
      toast({
        type: 'success',
        title: 'Slot Reserved (48h Lock)',
        description: `You have locked a slot for "${title}". Download raw assets and submit your edit within 48 hours.`,
      });
    } catch {
      toast({
        type: 'error',
        title: 'Could not claim slot',
        description: 'All creator slots for this campaign may currently be filled.',
      });
    }
  };

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
            <option value="Fashion">Fashion</option>
          </select>

          <select
            value={selectedPayout}
            onChange={(e) => setSelectedPayout(e.target.value)}
            className="rounded-md border border-input-border bg-input-bg px-2.5 py-1.5 text-xs text-text-primary focus:border-brand-accent focus:outline-none"
          >
            <option value="ALL">All Payout Models</option>
            <option value="PER_POST">Per-Post Flat</option>
            <option value="CPM">CPM (Per 1K Views)</option>
            <option value="HYBRID">Hybrid (Base + CPM)</option>
          </select>
        </div>
      </div>

      {/* Campaign List */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading marketplace briefs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">No campaigns match your filter criteria.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="hidden sm:table w-full text-xs">
              <thead className="border-b border-border bg-surface-raised text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Campaign / Brand</th>
                  <th className="px-4 py-3 text-left font-medium">Niche</th>
                  <th className="px-4 py-3 text-left font-medium">Payout Model</th>
                  <th className="px-4 py-3 text-right font-medium">Est. Earnings</th>
                  <th className="px-4 py-3 text-center font-medium">Slots Available</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((item) => {
                  const slotsLeft = Math.max(0, item.slotsTotal - item.slotsClaimed);
                  const isFull = slotsLeft === 0;

                  return (
                    <tr key={item.id} className="hover:bg-surface-raised/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/clipper/campaigns/${item.id}`} className="font-semibold text-text-primary hover:text-brand-accent transition-colors">
                          {item.title}
                        </Link>
                        <p className="text-[11px] text-text-muted mt-0.5">{item.brandName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                          {item.niche}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-secondary">
                        {item.payoutType === 'HYBRID'
                          ? `$${(item.payoutAmountCents / 100).toFixed(0)} base + $${(item.cpmRateCents / 100).toFixed(0)} CPM`
                          : item.payoutType === 'CPM'
                          ? `$${(item.cpmRateCents / 100).toFixed(0)} CPM`
                          : `$${(item.payoutAmountCents / 100).toFixed(0)} flat`}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-status-success tabular-nums">
                        ~{formatCents(item.budgetCents / Math.max(1, item.slotsTotal))}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs">
                        <span className={slotsLeft <= 2 ? 'text-status-warning font-semibold' : 'text-text-secondary'}>
                          {item.slotsClaimed} / {item.slotsTotal}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            disabled={isFull}
                            onClick={() => handleClaim(item.id, item.title)}
                            className="h-8 gap-1 text-xs bg-brand-accent hover:bg-brand-accent-hover text-white shadow-sm"
                          >
                            <Lock className="h-3 w-3" /> {isFull ? 'Filled' : 'Claim Slot'}
                          </Button>
                          <Link href={`/clipper/campaigns/${item.id}`}>
                            <Button size="sm" variant="outline" className="h-8 text-xs">
                              Brief <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="divide-y divide-border sm:hidden">
              {filtered.map((item) => {
                const slotsLeft = Math.max(0, item.slotsTotal - item.slotsClaimed);
                const isFull = slotsLeft === 0;

                return (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/clipper/campaigns/${item.id}`} className="font-semibold text-text-primary text-sm">
                          {item.title}
                        </Link>
                        <p className="text-xs text-text-muted mt-0.5">{item.brandName}</p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-status-success tabular-nums">
                        ~{formatCents(item.budgetCents / Math.max(1, item.slotsTotal))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{item.niche} &bull; {item.payoutType}</span>
                      <span>{slotsLeft} slots remaining</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={isFull}
                        onClick={() => handleClaim(item.id, item.title)}
                        className="w-full text-xs bg-brand-accent text-white"
                      >
                        {isFull ? 'All Slots Filled' : 'Claim 48h Slot'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
