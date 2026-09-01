'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CampaignData {
  id: string;
  title: string;
  brandName: string;
  niche: string;
  payoutType: string;
  payoutAmountCents: number;
  cpmRateCents: number;
  budgetCents: number;
  budgetSpentCents: number;
  slotsTotal: number;
  slotsClaimed: number;
  status: string;
  escrowStatus: string;
  attributionWindowDays: number;
  createdAt: string;
}

const DEFAULT_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp-1',
    title: 'Summer Activewear Reel Blitz',
    brandName: 'ActiveWear Official',
    niche: 'Fitness',
    payoutType: 'HYBRID',
    payoutAmountCents: 100_00,
    cpmRateCents: 15_00,
    budgetCents: 5000_00,
    budgetSpentCents: 2150_00,
    slotsTotal: 10,
    slotsClaimed: 7,
    status: 'ACTIVE',
    escrowStatus: 'FUNDED',
    attributionWindowDays: 7,
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'camp-2',
    title: 'Glow Serum Before & After Challenge',
    brandName: 'Lumiere Beauty',
    niche: 'Beauty',
    payoutType: 'PER_POST',
    payoutAmountCents: 250_00,
    cpmRateCents: 0,
    budgetCents: 3000_00,
    budgetSpentCents: 1250_00,
    slotsTotal: 8,
    slotsClaimed: 5,
    status: 'ACTIVE',
    escrowStatus: 'FUNDED',
    attributionWindowDays: 7,
    createdAt: '2026-08-25T14:30:00Z',
  },
  {
    id: 'camp-3',
    title: 'Minimalist EDC Tech Gear Review Clips',
    brandName: 'Apex Everyday',
    niche: 'Tech',
    payoutType: 'CPM',
    payoutAmountCents: 0,
    cpmRateCents: 20_00,
    budgetCents: 4000_00,
    budgetSpentCents: 850_00,
    slotsTotal: 5,
    slotsClaimed: 4,
    status: 'ACTIVE',
    escrowStatus: 'FUNDED',
    attributionWindowDays: 14,
    createdAt: '2026-08-28T09:15:00Z',
  },
];

export function useCampaigns(initialNiche = 'ALL') {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState(initialNiche);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedNiche === 'ALL' ? '/api/campaigns' : `/api/campaigns?niche=${encodeURIComponent(selectedNiche)}`;
      const res = await fetch(url);
      
      let serverCampaigns: CampaignData[] = [];
      if (res.ok) {
        const json = await res.json();
        serverCampaigns = json.data || [];
      }

      // Check localStorage for locally created client campaigns
      let localCreated: CampaignData[] = [];
      try {
        const saved = localStorage.getItem('clipbridge_custom_campaigns');
        if (saved) {
          localCreated = JSON.parse(saved);
        }
      } catch {}

      // Merge and deduplicate by ID
      const map = new Map<string, CampaignData>();
      localCreated.forEach((c) => map.set(c.id, c));
      serverCampaigns.forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, c);
      });
      DEFAULT_CAMPAIGNS.forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, c);
      });

      let merged = Array.from(map.values());
      if (selectedNiche !== 'ALL') {
        merged = merged.filter((c) => c.niche.toLowerCase() === selectedNiche.toLowerCase());
      }

      setCampaigns(merged);
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
      setCampaigns(DEFAULT_CAMPAIGNS);
    } finally {
      setLoading(false);
    }
  }, [selectedNiche]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const createCampaign = async (payload: Partial<CampaignData>) => {
    const newCamp: CampaignData = {
      id: `camp_${Date.now()}`,
      title: payload.title || 'Untitled Campaign',
      brandName: payload.brandName || 'ActiveWear Official',
      niche: payload.niche || 'Fitness',
      payoutType: payload.payoutType || 'PER_POST',
      payoutAmountCents: payload.payoutAmountCents || 100_00,
      cpmRateCents: payload.cpmRateCents || 0,
      budgetCents: payload.budgetCents || 5000_00,
      budgetSpentCents: 0,
      slotsTotal: payload.slotsTotal || 10,
      slotsClaimed: 0,
      status: 'ACTIVE',
      escrowStatus: 'FUNDED',
      attributionWindowDays: payload.attributionWindowDays || 7,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to local storage for instant persistent client state
    try {
      const existing = localStorage.getItem('clipbridge_custom_campaigns');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newCamp);
      localStorage.setItem('clipbridge_custom_campaigns', JSON.stringify(list));
    } catch {}

    // 2. Call API route to persist on server
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCamp),
      });
    } catch (e) {
      console.warn('Server save fallback to localStorage:', e);
    }

    setCampaigns((prev) => [newCamp, ...prev]);
    return newCamp;
  };

  const claimSlot = async (campaignId: string) => {
    // 1. Update local storage
    try {
      const existing = localStorage.getItem('clipbridge_custom_campaigns');
      if (existing) {
        const list: CampaignData[] = JSON.parse(existing);
        const updated = list.map((c) =>
          c.id === campaignId ? { ...c, slotsClaimed: Math.min(c.slotsTotal, c.slotsClaimed + 1) } : c
        );
        localStorage.setItem('clipbridge_custom_campaigns', JSON.stringify(updated));
      }
    } catch {}

    try {
      await fetch(`/api/campaigns/${campaignId}/claim`, { method: 'POST' });
    } catch {}

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, slotsClaimed: Math.min(c.slotsTotal, c.slotsClaimed + 1) } : c
      )
    );

    return { success: true, campaignId };
  };

  const toggleStatus = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        const newStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...c, status: newStatus };
      })
    );
  };

  return {
    campaigns,
    loading,
    error,
    selectedNiche,
    setSelectedNiche,
    refresh: fetchCampaigns,
    createCampaign,
    claimSlot,
    toggleStatus,
  };
}
